export enum EventType {
  CRYPTO_UPDATE_EUR = 'CRYPTO_UPDATE_EUR',
  CRYPTO_UPDATE_USD = 'CRYPTO_UPDATE_USD',
  USER_NOTIFICATION = 'USER_NOTIFICATION'
}
export interface Event {
  eventType: EventType
  payload: any
}
