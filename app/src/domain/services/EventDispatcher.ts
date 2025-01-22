import { Event } from '../model/Event';
import { EventHandler } from '../model/EventHandler';
import { EventType } from '../model/Event';

export interface EventDispatcher {
    dispatch(event: Event): void;
}

export class DomainEventDispatcher implements EventDispatcher {
    private handlers: Map<EventType, EventHandler[]> = new Map();

    constructor(handlers: EventHandler[]) {
        handlers.forEach(handler => {
            handler.eventTypes.forEach(eventType => {
                if (!this.handlers.has(eventType)) {
                    this.handlers.set(eventType, []);
                }
                this.handlers.get(eventType)!.push(handler);
            });
        });
    }

    dispatch(event: Event): void {
        const handlers = this.handlers.get(event.eventType);
        if (handlers && handlers.length > 0) {
            handlers.forEach(handler => handler.handle(event));
        } else {
            throw new Error(`No handler found for event type: ${event.eventType}`);
        }
    }
}