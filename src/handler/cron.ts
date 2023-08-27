import moment from 'moment'

export const cronHandler = () => {
  console.log(`running a task every minute - ${moment().toISOString()}`)
}
