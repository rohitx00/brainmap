const MAX_QUEUE_SIZE = 100;

export const manageQueue = async (currentQueue, operation, topic) => {
    return new Promise((resolve) => {
        let queue = currentQueue ? [...currentQueue] : [];

        if (operation === 'enqueue' && topic) {
            if (queue.length < MAX_QUEUE_SIZE) {
                queue.push(topic);
            }
        } else if (operation === 'dequeue') {
            if (queue.length > 0) {
                queue.shift();
            }
        } else if (operation === 'remove' && topic) {
            // Remove all instances of topic? C code removed all instances except if it found one it kept duplicates?
            // Wait, C code: 
            // if (strcmp(q->items[i], item) != 0) { keep } else { if (found) { keep } else { found=1; skip } }
            // So it removes ONLY the FIRST instance found.

            const index = queue.indexOf(topic);
            if (index > -1) {
                queue.splice(index, 1);
            }
        }

        resolve(queue);
    });
};
