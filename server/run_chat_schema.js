import db from './db.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runChatSchema = async () => {
    try {
        console.log('Running chat schema migration...');

        const schemaPath = join(__dirname, 'chat_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolons and execute each statement
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            await db.query(statement);
        }

        console.log('✅ Chat schema applied successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error applying chat schema:', error);
        process.exit(1);
    }
};

runChatSchema();
