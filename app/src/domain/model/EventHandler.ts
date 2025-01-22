import { Event, EventType } from './Event';

export interface EventHandler {
    eventTypes: EventType[];
    handle(event: Event): void;
}