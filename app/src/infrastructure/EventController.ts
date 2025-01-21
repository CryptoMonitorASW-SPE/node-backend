import { Request, Response } from 'express';
import { HandleReceivedEvent } from '../application/HandleReceivedEvent';
import { Event } from '../domain/model/Event';
import { injectable, inject } from 'tsyringe';

@injectable()
export class EventController {
  constructor(
    @inject(HandleReceivedEvent) private handleReceivedEvent: HandleReceivedEvent
  ) {}

  async postEvent(req: Request, res: Response): Promise<void> {
    try {
      const event: Event = req.body;
      await this.handleReceivedEvent.execute(event);
      res.status(200).send({ status: 'Event processed' });
    } catch (error) {
      console.error('Error processing event:', error);
      res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
