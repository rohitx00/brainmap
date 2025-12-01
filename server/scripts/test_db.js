import connectDB from '../db.js';

console.log('Testing DB connection...');
connectDB().then(() => {
    console.log('DB Connected via db.js');
    process.exit(0);
}).catch(err => {
    console.error('DB Connection failed:', err);
    process.exit(1);
});
