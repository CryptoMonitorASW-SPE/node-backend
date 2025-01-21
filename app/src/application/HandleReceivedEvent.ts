import { Event } from '../domain/model/Event';
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
        await this.handlePriceUpdated(payload);
        break;
      default:
        console.warn(`Unhandled event type: ${eventType}`);
    }
  }

  private async handlePriceUpdated(payload: any): Promise<void> {
    const { cryptoId, newPrice } = payload;

    const message = {
      type: 'PRICE_UPDATED',
      cryptoId,
      newPrice,
    };
    console.log('Broadcasting message:', message);
    this.socketIOService.broadcast(message);
  }
}