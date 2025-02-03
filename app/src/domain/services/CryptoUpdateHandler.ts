import { EventHandler } from '../model/EventHandler'
import { Event, EventType } from '../model/Event'
import { CryptoPriceData } from '../model/CryptoPriceData'
import { EventOutputPort } from '../ports/EventOutputPort'
import { inject, injectable } from 'tsyringe'
import axios from 'axios'
import { createViewUpdateMessage, ViewUpdateMessage } from './ViewUpdateMessage'
import {
  createNotificationUpdateMessage,
  NotificationUpdateMessage
} from './NotificationUpdateMessage'

@injectable()
export class CryptoUpdateHandler implements EventHandler {
  eventTypes: EventType[] = [EventType.CRYPTO_UPDATE_EUR, EventType.CRYPTO_UPDATE_USD]

  eventOutbound = 'CRYPTO_UPDATE'

  constructor(@inject('EventOutputPort') private eventOutput: EventOutputPort) {}

  handle(eventInbound: Event): void {
    const updateMessage: ViewUpdateMessage = createViewUpdateMessage(
      new Date().toISOString(),
      eventInbound.payload
    )

    const notificationUpdateMessage: NotificationUpdateMessage = createNotificationUpdateMessage(
      new Date().toISOString(),
      eventInbound
    )

    if (eventInbound.eventType === EventType.CRYPTO_UPDATE_EUR) {
      this.eventOutput.broadcastEUR(updateMessage)

      this.notifyService('eur', notificationUpdateMessage)
    } else if (eventInbound.eventType === EventType.CRYPTO_UPDATE_USD) {
      this.eventOutput.broadcastUSD(updateMessage)

      this.notifyService('usd', notificationUpdateMessage)
    }
  }

  private notifyService(currency: 'usd' | 'eur', messageJson: any): void {
    axios.post(`http://notification:8080/data?currency=${currency}`, messageJson).catch(error => {
      console.error('Error notifying notification service:', error)
    })
  }
}
