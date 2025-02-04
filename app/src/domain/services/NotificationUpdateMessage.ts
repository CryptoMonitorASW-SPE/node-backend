import { CryptoData } from '../model/CryptoData'
import { CryptoPriceData } from '../model/CryptoPriceData'
import { Event } from '../model/Event'

export interface NotificationUpdateMessage {
  timestamp: string
  payload: CryptoPriceData[]
}

export function createNotificationUpdateMessage(
  timestamp: string,
  eventInbound: Event
): NotificationUpdateMessage {
  const cryptoPriceData: CryptoPriceData[] = eventInbound.payload.map(
    (crypto: { id: any; symbol: any; price: any }) => ({
      id: crypto.id,
      symbol: crypto.symbol,
      price: crypto.price
    })
  )

  return {
    timestamp,
    payload: cryptoPriceData
  }
}
