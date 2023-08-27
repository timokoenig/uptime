import moment from 'moment'
import { writePing } from '../utils/db'
import { readConfig } from '../utils/helper'

export const cronHandler = async () => {
  try {
    const config = readConfig()
    await Promise.all(
      config.services.map(async service => {
        const date = moment()
        console.log(`${date.toISOString()} | ➡️  Ping ${service.url}`)

        const response = await fetch(service.url)
        const latencyMs = moment().diff(date, 'milliseconds')

        if (response.ok) {
          console.log(
            `${moment().toISOString()} | ⬅️  Pong ${service.url} | ${latencyMs}ms | Status ${
              response.status
            }`
          )
        } else {
          console.log(
            `${moment().toISOString()} | ⬅️  Pong failed ${service.url} | Status ${response.status}`
          )
        }

        writePing({
          date,
          latency: latencyMs,
          status: response.status,
          url: service.url,
        })
      })
    )
  } catch (err: unknown) {
    console.log(`Cron Error | ${err}`)
  }
}
