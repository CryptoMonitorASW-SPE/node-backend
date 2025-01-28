import { CryptoData } from './CryptoData'

export enum EventType {
  CRYPTO_UPDATE_EUR = 'CRYPTO_UPDATE_EUR',
  CRYPTO_UPDATE_USD = 'CRYPTO_UPDATE_USD'
}
export interface Event {
  eventType: EventType
  payload: CryptoData[]
}
