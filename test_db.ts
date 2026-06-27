import { initDb } from './src/lib/db';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });
initDb().then(() => process.exit(0));
