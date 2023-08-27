import * as fs from 'fs'
import { Config } from '../models/config'

const CONFIG_FILE = 'uptime-config.json'

export const readConfig = (): Config => JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) as Config
