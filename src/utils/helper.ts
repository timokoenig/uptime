import * as fs from 'fs'
import moment from 'moment'
import { Config } from '../models/config'
import { Ping, PingViewModel, ServiceViewModel } from '../models/service'
import { readPingsForService } from './db'

const CONFIG_FILE = 'uptime-config.json'
const PING_COUNT = 60

export const readConfig = (): Config => JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) as Config

export const sortPingDESC = (a: Ping, b: Ping): number =>
  moment(a.date).isSameOrBefore(moment(b.date))
    ? 1
    : moment(a.date).isAfter(moment(b.date))
    ? -1
    : 0

export const sortPingASC = (a: Ping, b: Ping): number =>
  moment(a.date).isSameOrBefore(moment(b.date))
    ? -1
    : moment(a.date).isAfter(moment(b.date))
    ? 1
    : 0

const parsePingViewModels = (pings: Ping[]): PingViewModel[] => {
  const models: PingViewModel[] = []

  const numberUnknownPings = PING_COUNT - pings.length
  if (numberUnknownPings > 0) {
    for (let i = 0; i < numberUnknownPings; i++) {
      models.push({
        date: moment(),
        statusUp: false,
        statusDown: false,
        statusUnknown: true,
      })
    }
  }

  pings.forEach(ping => {
    models.push({
      date: ping.date,
      statusUp: ping.status == 200,
      statusDown: ping.status != 200,
      statusUnknown: false,
    })
  })

  return models
}

export const parseServiceViewModels = (): ServiceViewModel[] => {
  const config = readConfig()

  return config.services.map(service => {
    const pings = readPingsForService(service.url).sort(sortPingDESC)

    const last5Pings = pings.slice(0, 5)
    const isStatusOk = last5Pings.findIndex(obj => obj.status != 200) == -1

    const lastXPings = pings.slice(0, PING_COUNT).sort(sortPingASC)
    const pingViewModels = parsePingViewModels(lastXPings)

    return {
      statusUp: isStatusOk,
      statusDown: !isStatusOk,
      name: service.name,
      url: service.url,
      pings: pingViewModels,
      uptimePercentage: (
        (100 / lastXPings.length) *
        lastXPings.filter(obj => obj.status == 200).length
      ).toFixed(2),
      LATENCY_MIN: Math.min(...lastXPings.map(obj => obj.latency)).toFixed(0),
      LATENCY_MAX: Math.max(...lastXPings.map(obj => obj.latency)).toFixed(0),
      LATENCY_AVG: (
        lastXPings.map(obj => obj.latency).reduce((a, b) => a + b, 0) / lastXPings.length
      ).toFixed(0),
    }
  })
}
