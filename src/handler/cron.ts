import moment from 'moment'
import { NOTIFICATION_TYPE } from '../models/config'
import { readPingsForService, writePing } from '../utils/db'
import { readConfig } from '../utils/helper'
import { sendEmailNotification } from '../utils/mail'

export const cronHandler = async () => {
  try {
    const config = readConfig()

    // ping services one after another to avoid json write conflicts
    for (const service of config.services) {
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

        const pings = readPingsForService(service.url)
        const previousPing = pings.length == 0 ? undefined : pings[pings.length - 1]
        if (!previousPing || previousPing.status == 200) {
          // Send email notifications once the service switches from operational to failed
          await Promise.all(
            config.notification.map(async notification => {
              if (notification.type == NOTIFICATION_TYPE.EMAIL) {
                await sendEmailNotification(service.name, service.url, notification.email)
              }
            })
          )
        }
      }

      writePing({
        date,
        latency: latencyMs,
        status: response.status,
        url: service.url,
      })
    }
  } catch (err: unknown) {
    console.log(`Cron Error | ${err}`)
  }
}
