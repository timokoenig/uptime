import * as fs from 'fs'
import moment from 'moment'
import { Config, Service, ServiceResponse } from '../models/config'
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

const parsePingViewModels = (pings: Ping[], service: Service): PingViewModel[] => {
  const models: PingViewModel[] = []

  const numberUnknownPings = PING_COUNT - pings.length
  if (numberUnknownPings > 0) {
    for (let i = 0; i < numberUnknownPings; i++) {
      models.push({
        date: moment().format('DD.MM.YYYY HH:mm'),
        statusUp: false,
        statusDown: false,
        statusUnknown: true,
      })
    }
  }

  pings.forEach(ping => {
    models.push({
      date: moment(ping.date).format('DD.MM.YYYY HH:mm'),
      latency: ping.latency.toFixed(0),
      statusUp: isValidResponse(ping.status, service.response),
      statusDown: !isValidResponse(ping.status, service.response),
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
    const isStatusOk =
      last5Pings.findIndex(obj => !isValidResponse(obj.status, service.response)) == -1

    const lastXPings = pings.slice(0, PING_COUNT).sort(sortPingASC)
    const pingViewModels = parsePingViewModels(lastXPings, service)

    return {
      statusUp: isStatusOk,
      statusDown: !isStatusOk,
      name: service.name,
      url: service.url,
      pings: pingViewModels,
      uptimePercentage: (
        (100 / lastXPings.length) *
        lastXPings.filter(obj => isValidResponse(obj.status, service.response)).length
      ).toFixed(2),
      LATENCY_MIN: Math.min(...lastXPings.map(obj => obj.latency)).toFixed(0),
      LATENCY_MAX: Math.max(...lastXPings.map(obj => obj.latency)).toFixed(0),
      LATENCY_AVG: (
        lastXPings.map(obj => obj.latency).reduce((a, b) => a + b, 0) / lastXPings.length
      ).toFixed(0),
    }
  })
}

export const parseRequestBody = (service: Service): BodyInit | undefined => {
  if (service.data === undefined) {
    return undefined
  }

  if (service.headers !== undefined && service.headers['Content-Type'] == 'application/json') {
    return JSON.stringify(service.data)
  }

  if (
    service.headers !== undefined &&
    service.headers['Content-Type'] == 'application/x-www-form-urlencoded'
  ) {
    return Object.entries(service.data)
      .map((key, value) => `${key}=${encodeURIComponent(value)}`)
      .join('&') as BodyInit
  }

  return service.data as BodyInit
}

export const parseRequestUrl = (service: Service): string => {
  if (
    service.headers !== undefined &&
    service.headers['Content-Type'] == 'application/x-www-form-urlencoded' &&
    service.data !== undefined
  ) {
    const params = Object.entries(service.data)
      .map((key, value) => `${key}=${encodeURIComponent(value)}`)
      .join('&')
    return `${service.url}?${params}`
  }

  return service.url
}

export const isValidResponse = (
  status: number,
  serviceResponse: ServiceResponse | undefined
): boolean => {
  if (serviceResponse === undefined) {
    return status >= 200 && status < 300
  }
  return serviceResponse.ok.includes(status)
}
