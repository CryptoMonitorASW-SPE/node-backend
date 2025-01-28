import { Router, Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'
import { EventInputPort } from '../../application/ports/EventInputPort'

@injectable()
export class EventAdapter {
  private router: Router

  constructor(@inject('EventInputPort') private eventInput: EventInputPort) {
    this.router = Router()
  }

  public initialize(): void {
    this.router.post('/realtime/events/cryptomarketdata', this.handleEvent)
    this.router.get('/health', this.healthCheck)
  }

  private handleEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.eventInput.processEvent(req.body)
      res.status(200).json({ status: 'Event processed' })
    } catch (error) {
      console.error('Error processing event:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  private healthCheck = (req: Request, res: Response): void => {
    res.status(200).json({
      status: 'healthy',
      service: 'event-service',
      timestamp: new Date().toISOString()
    })
  }

  public getRouter(): Router {
    return this.router
  }
}
