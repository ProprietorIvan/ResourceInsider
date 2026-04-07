import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import authRouter from './routes/auth.js'
import stripeRouter, { handleStripeWebhook } from './routes/stripe.js'
import adminRouter from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const PORT = Number(process.env.PORT) || 3001
const baseUrl = process.env.BASE_URL || 'http://localhost:5173'

app.use(
  cors({
    origin: baseUrl,
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

const distPath = path.join(__dirname, '..', 'dist')

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`API server http://localhost:${PORT}`)
})
