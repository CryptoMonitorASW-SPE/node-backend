import { EventHandler } from '../model/EventHandler'
import { Event, EventType } from '../model/Event'
import { EventOutputPort } from '../../application/ports/EventOutputPort'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CryptoUpdateHandler implements EventHandler {
  eventTypes: EventType[] = [EventType.CRYPTO_UPDATE_EUR, EventType.CRYPTO_UPDATE_USD]

  constructor(@inject('EventOutputPort') private eventOutput: EventOutputPort) {}

  handle(event: Event): void {
    console.log('Handling event:', event)
    const updatedEventType = 'CRYPTO_UPDATE'
    const messageJson = {
      ...event,
      eventType: updatedEventType,
      timestamp: new Date().toISOString()
    }
    console.log('Updated message:', messageJson)

    if (event.eventType === EventType.CRYPTO_UPDATE_EUR) {
      console.log('Broadcasting EUR update:', messageJson)
      this.eventOutput.broadcastEUR(messageJson)
    } else if (event.eventType === EventType.CRYPTO_UPDATE_USD) {
      console.log('Broadcasting USD update:', messageJson)
      this.eventOutput.broadcastUSD(messageJson)
    }
  }
}
