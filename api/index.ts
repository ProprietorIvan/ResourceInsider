import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

let handler: any

try {
  const serverless = await import('serverless-http')
  const { createApp } = await import('../dist-server/app.js')
  const app = createApp({ serveStatic: false })
  handler = serverless.default(app)
} catch (e: any) {
  handler = async (_req: any, res: any) => {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Function init failed', detail: e?.message || String(e) }))
  }
}

export default handler
