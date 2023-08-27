import * as dotenv from 'dotenv'
import * as http from 'http'
import * as cron from 'node-cron'
import { cronHandler } from './handler/cron'
import { webHandler } from './handler/web'
import { readConfig } from './utils/helper'

dotenv.config()

// Check for existing uptime config
try {
  readConfig()
} catch (err: unknown) {
  throw new Error('uptime-config.json is missing')
}

const hostname = process.env.HOST || 'localhost'
const port = Number(process.env.PORT) || 3000

// Run cron job
console.log('Schedule cron job to run every minute')
cron.schedule('* * * * *', cronHandler)

// Run web server
const server = http.createServer(webHandler)
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
