export enum NOTIFICATION_TYPE {
  EMAIL = 'email',
}

export type Notification = {
  type: NOTIFICATION_TYPE
  email: string
}

export type ServiceResponse = {
  ok: number[]
}

export type RequestHeaders = {
  'Content-Type'?: string
}

export type Service = {
  name: string
  url: string
  method?: string
  headers?: RequestHeaders
  data?: object
  response?: ServiceResponse
}

export type Config = {
  notification: Notification[]
  services: Service[]
}
