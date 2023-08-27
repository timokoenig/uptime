import * as http from 'http'
import * as cron from 'node-cron'
import { cronHandler } from './handler/cron'
import webHandler from './handler/web'
import { readConfig } from './utils/helper'

// Check for existing uptime config
try {
  readConfig()
} catch (err: unknown) {
  throw new Error('uptime-config.json is missing')
}

const hostname = '127.0.0.1'
const port = 3000

// Run cron job
cron.schedule('* * * * *', cronHandler)

// Run web server
const server = http.createServer(webHandler)
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
