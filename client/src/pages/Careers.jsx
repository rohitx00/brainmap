import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';

const Careers = () => {
    const jobs = [
        {
            title: "Senior Full Stack Engineer",
            department: "Engineering",
            location: "Remote / San Francisco",
            type: "Full-time"
        },
        {
            title: "AI Research Scientist",
            department: "AI Lab",
            location: "London, UK",
            type: "Full-time"
        },
        {
            title: "Product Designer",
            department: "Design",
            location: "Remote",
            type: "Contract"
        },
        {
            title: "Community Manager",
            department: "Marketing",
            location: "New York, USA",
            type: "Full-time"
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Join Our Team
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Help us shape the future of education. We're looking for passionate individuals to join our mission.
                    </p>
                </motion.div>

                <div className="grid gap-6">
                    {jobs.map((job, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-slate-800/50 transition-colors group cursor-pointer"
                        >
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <Briefcase className="w-4 h-4" /> {job.department}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> {job.type}
                                    </span>
                                </div>
                            </div>
                            <button className="px-6 py-2 rounded-full bg-slate-700 group-hover:bg-primary text-white transition-all flex items-center gap-2">
                                Apply Now <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 text-center"
                >
                    <h2 className="text-2xl font-bold mb-4">Don't see the right role?</h2>
                    <p className="text-slate-400 mb-8">
                        We are always looking for talented people. Send your resume to <span className="text-primary">careers@brainmap.com</span>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Careers;
