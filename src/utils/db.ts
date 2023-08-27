import * as fs from 'fs'
import { Ping } from '../models/service'

const DB_FILE = 'db.json'

type DbType = { ping: Ping[] }

const defaultData = { ping: [] }
const setDefaultDataIfNeeded = () => {
  // Set default data if db does not exist yet
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData))
  }
}

export const readPingsForService = (serviceUrl: string): Ping[] => {
  setDefaultDataIfNeeded()

  // Read pings for given service url
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) as DbType
  return data.ping.filter(ping => ping.url == serviceUrl)
}

export const writePing = (ping: Ping): void => {
  setDefaultDataIfNeeded()

  // Write new ping
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) as DbType
  data.ping.push(ping)
  fs.writeFileSync(DB_FILE, JSON.stringify(data))
}
