import { CryptoData } from './CryptoData';

export enum EventType {
    CRYPTO_UPDATE = 'CRYPTO_UPDATE'
}
export interface Event {
    eventType: EventType;
    payload: CryptoData[];
}