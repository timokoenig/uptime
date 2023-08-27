export enum NOTIFICATION_TYPE {
  EMAIL = 'email',
}

export type Notification = {
  type: NOTIFICATION_TYPE
  email: string
}

export type Service = {
  name: string
  url: string
}

export type Config = {
  notification: Notification[]
  services: Service[]
}
