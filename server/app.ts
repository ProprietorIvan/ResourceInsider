import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import authRouter from './routes/auth.js'
import stripeRouter, { handleStripeWebhook } from './routes/stripe.js'
import adminRouter from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function getCorsOrigin(): string {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:5173'
}

export interface CreateAppOptions {
  /** Serve Vite `dist/` and SPA fallback (local `npm start` only). */
  serveStatic?: boolean
}

export function createApp(options: CreateAppOptions = {}) {
  const { serveStatic = false } = options
  const app = express()
  const baseUrl = getCorsOrigin()

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  )

  app.post(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    (req, res) => handleStripeWebhook(req, res),
  )

  app.use(cookieParser())
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/api/auth', authRouter)
  app.use('/api/stripe', stripeRouter)
  app.use('/api/admin', adminRouter)

  if (serveStatic) {
    const distPath = path.join(__dirname, '..', 'dist')
    app.use(express.static(distPath))
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        res.status(404).json({ error: 'Not found' })
        return
      }
      res.sendFile(path.join(distPath, 'index.html'))
    })
  }

  return app
}
