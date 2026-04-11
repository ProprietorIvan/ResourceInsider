import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import serverless from 'serverless-http'
import { createApp } from '../dist-server/app.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const app = createApp({ serveStatic: false })
export default serverless(app)
