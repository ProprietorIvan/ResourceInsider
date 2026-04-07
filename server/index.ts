import './load-env.js'
import { createApp } from './app.js'

const PORT = Number(process.env.PORT) || 3001
const app = createApp({
  serveStatic: process.env.NODE_ENV === 'production',
})

app.listen(PORT, () => {
  console.log(`API server http://localhost:${PORT}`)
})
