import { Event } from '../domain/model/Event';
import { PriceUpdatePayload } from '../domain/model/PriceUpdatePayload';
import { BroadcastMessage } from '../domain/model/BroadcastMessage';
import { injectable, inject } from 'tsyringe';
import { SocketIOService } from '../infrastructure/SocketIOAdapter';

@injectable()
export class HandleReceivedEvent {
  constructor(
    @inject(SocketIOService) private socketIOService: SocketIOService
  ) {}

  async execute(event: Event): Promise<void> {
    const { eventType, payload } = event;

    switch (eventType) {
      case 'PRICE_UPDATED':
        // Cast or validate payload as PriceUpdatedPayload
        await this.handlePriceUpdated(payload as PriceUpdatePayload);
        break;
      default:
        console.warn(`Unhandled event type: ${eventType}`);
    }
  }

  private async handlePriceUpdated(payload: PriceUpdatePayload): Promise<void> {
    const { cryptoId, newPrice } = payload;

    const message: BroadcastMessage = {
      type: 'PRICE_UPDATED',
      cryptoId,
      newPrice,
    };
    console.log('Broadcasting message:', message);
    this.socketIOService.broadcast(message);
  }
}