// EventService.ts
import { container } from 'tsyringe'
import { injectable, inject } from 'tsyringe'
import { EventInputPort } from './ports/EventInputPort'
import { DomainEventDispatcher, EventDispatcher } from '../domain/services/EventDispatcher'
import { Event, EventType } from '../domain/model/Event'
import { CryptoUpdateHandler } from '../domain/services/CryptoUpdateHandler'
import { EventHandler } from '../domain/model/EventHandler'
import { EventOutputPort } from './ports/EventOutputPort' // Ensure this import exists

@injectable()
export class EventService implements EventInputPort {
  private eventDispatcher: EventDispatcher

  constructor(@inject('EventOutputPort') private eventOutputPort: EventOutputPort) {
    const cryptoUpdateHandler = new CryptoUpdateHandler(this.eventOutputPort)
    // Initialize other handlers here
    const handlers: EventHandler[] = [cryptoUpdateHandler /*, other handlers */]
    const eventDispatcher = new DomainEventDispatcher(handlers)
    container.registerInstance<DomainEventDispatcher>('EventDispatcher', eventDispatcher)
    this.eventDispatcher = eventDispatcher // Assigning to the class property
  }

  async processEvent(eventJson: Event): Promise<void> {
    if (!this.isValidEventData(eventJson)) {
      throw new Error('Invalid event data')
    }

    this.eventDispatcher.dispatch(eventJson)
  }

  private isValidEventData(eventJson: Event): boolean {
    const validTypes: EventType[] = Object.values(EventType) // Dynamic retrieval of valid types
    return !!eventJson && validTypes.includes(eventJson.eventType) && eventJson.payload.length > 0
  }
}
