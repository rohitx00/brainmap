// SM-2 Algorithm Constants
const MIN_EF = 1.3;
const INITIAL_EF = 2.5;

export const getDueReviews = async (attempts) => {
    return new Promise((resolve) => {
        if (!attempts || attempts.length === 0) {
            resolve([]);
            return;
        }

        const currentTime = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
        const topics = {};

        // Process attempts in order to build state
        attempts.forEach(a => {
            const topicName = a.topic;
            const timestamp = Math.floor(new Date(a.timestamp).getTime() / 1000);

            if (!topics[topicName]) {
                topics[topicName] = {
                    name: topicName,
                    ef: INITIAL_EF,
                    interval: 0,
                    repetitions: 0,
                    lastReviewTime: 0
                };
            }

            const t = topics[topicName];
            t.lastReviewTime = timestamp;

            // Calculate Quality (0-5)
            const percentage = a.total_questions > 0 ? (a.score / a.total_questions) : 0.0;
            const quality = Math.round(percentage * 5.0);

            if (quality >= 3) {
                if (t.repetitions === 0) {
                    t.interval = 1;
                } else if (t.repetitions === 1) {
                    t.interval = 6;
                } else {
                    t.interval = Math.round(t.interval * t.ef);
                }
                t.repetitions++;

                // Update EF
                const qDiff = 5 - quality;
                t.ef = t.ef + (0.1 - qDiff * (0.08 + qDiff * 0.02));
                if (t.ef < MIN_EF) t.ef = MIN_EF;
            } else {
                // Failed attempt, reset
                t.repetitions = 0;
                t.interval = 1;
            }
        });

        const dueTopics = [];

        for (const topicName in topics) {
            const t = topics[topicName];
            const nextDue = t.lastReviewTime + (t.interval * 24 * 60 * 60);

            if (nextDue <= currentTime) {
                dueTopics.push({
                    topic: t.name,
                    interval: t.interval,
                    dueInDays: Math.floor((nextDue - currentTime) / (24 * 60 * 60))
                });
            }
        }

        resolve(dueTopics);
    });
};
