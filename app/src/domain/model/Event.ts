import { CryptoData } from './CryptoData';
export interface Event {
    eventType: string;
    payload: CryptoData[];
}