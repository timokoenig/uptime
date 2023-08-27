import * as http from 'http'
import moment from 'moment'
import { parseServiceViewModels } from '../utils/helper'
import { renderMainTemplate } from '../utils/html'

export const webHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
  const serviceViewModels = parseServiceViewModels()
  const systemStatusOK = serviceViewModels.findIndex(obj => obj.statusDown) == -1

  const lastPing =
    serviceViewModels.length == 0 || serviceViewModels[0].pings.length == 0
      ? undefined
      : serviceViewModels[0].pings[0].date

  const html = renderMainTemplate({
    LAST_PING: moment(lastPing).format('DD.MM.YYYY HH:mm'),
    STATUS_UP: systemStatusOK,
    STATUS_DOWN: !systemStatusOK,
    services: serviceViewModels,
  })

  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end(html)
}
