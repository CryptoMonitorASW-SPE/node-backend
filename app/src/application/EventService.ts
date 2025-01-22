import { injectable, inject } from 'tsyringe';
import { EventInputPort } from '../application/ports/EventInputPort';
import { EventOutputPort } from '../application/ports/EventOutputPort';
import { Event } from '../domain/model/Event';
import { PriceUpdatePayload } from '../domain/model/PriceUpdatePayload';
import { BroadcastMessage } from '../domain/model/BroadcastMessage';

@injectable()
export class EventService implements EventInputPort {
    constructor(
        @inject('EventOutputPort') private eventOutput: EventOutputPort
    ) {}

    async processEvent(eventJson: any): Promise<void> {
        // Convert JSON to domain model
        const event: Event = {
            eventType: eventJson.eventType,
            payload: eventJson.payload,
            timestamp: eventJson.timestamp
        };

        // Process with domain models
        const priceUpdate: PriceUpdatePayload = {
            cryptoId: event.payload.cryptoId,
            newPrice: event.payload.newPrice
        };

        const message: BroadcastMessage = {
            type: 'PRICE_UPDATED',
            cryptoId: priceUpdate.cryptoId,
            newPrice: priceUpdate.newPrice
        };

        // Convert back to JSON for output
        const messageJson = {
            type: message.type,
            cryptoId: message.cryptoId,
            newPrice: message.newPrice,
            timestamp: new Date().toISOString()
        };

        this.eventOutput.broadcast(messageJson);
    }
}