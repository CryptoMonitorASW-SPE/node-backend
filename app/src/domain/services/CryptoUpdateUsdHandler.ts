import { EventHandler } from '../model/EventHandler'
import { Event, EventType } from '../model/Event'
import { EventOutputPort } from '../../application/ports/EventOutputPort'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CryptoUpdateUsdHandler implements EventHandler {
  eventTypes: EventType[] = [EventType.CRYPTO_UPDATE_USD]

  constructor(@inject('EventOutputPort') private eventOutput: EventOutputPort) {}

  handle(event: Event): void {
    const messageJson = {
      ...event,
      timestamp: new Date().toISOString()
    }
    this.eventOutput.broadcastUSD(messageJson)
  }
}
