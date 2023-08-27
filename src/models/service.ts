import moment from 'moment'

export type Ping = {
  date: moment.Moment
  url: string
  latency: number
  status: number
}

export type PingViewModel = {
  date: moment.Moment
  statusUp: boolean
  statusDown: boolean
  statusUnknown: boolean
}

export type ServiceViewModel = {
  statusUp: boolean
  statusDown: boolean
  name: string
  url: string
  pings: PingViewModel[]
}
