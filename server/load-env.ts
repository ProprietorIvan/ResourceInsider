/**
 * Load root `.env` before any other server modules read `process.env`.
 * Must be the first import in `server/index.ts` (listed first so it evaluates first).
 */
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, '..', '.env')
dotenv.config({ path: envPath })
