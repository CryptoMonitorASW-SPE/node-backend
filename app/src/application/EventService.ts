import { injectable, inject } from 'tsyringe';
import { EventInputPort } from '../application/ports/EventInputPort';
import { EventOutputPort } from '../application/ports/EventOutputPort';
import { Event } from '../domain/model/Event';

@injectable()
export class EventService implements EventInputPort {
    constructor(
        @inject('EventOutputPort') private eventOutput: EventOutputPort
    ) {}

    async processEvent(eventJson: Event): Promise<void> {
        
        if (!this.isValidEventData(eventJson)) {
            throw new Error('Invalid event data');
        }

        const messageJson = {
            ...eventJson,
            timestamp: new Date().toISOString()
        };

        this.eventOutput.broadcast(messageJson);
    }

    private isValidEventData(eventJson: Event): boolean {
        return !!(eventJson && eventJson.eventType && eventJson.payload);
    }
}