import moment from 'moment'

export type Ping = {
  date: moment.Moment
  url: string
  latency: number
  status: number
}
