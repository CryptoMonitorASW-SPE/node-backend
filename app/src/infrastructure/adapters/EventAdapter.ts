import { Router, Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'
import { EventInputPort } from '../../domain/ports/EventInputPort'
import { EventType } from '../../domain/model/Event'
import { Event } from '../../domain/model/Event'

@injectable()
export class EventAdapter {
  private router: Router

  constructor(@inject('EventInputPort') private eventInput: EventInputPort) {
    this.router = Router()
  }

  public initialize(): void {
    this.router.post('/realtime/events/notifyUser', this.handleNotifyUser)
    this.router.post('/realtime/events/cryptomarketdata', this.handleEvent)
    this.router.get('/health', this.healthCheck)
  }

  private handleNotifyUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, cryptoId, alertPrice, currentPrice, alertType, message } = req.body

      if (!userId) {
        res.status(400).json({ error: 'Bad Request: userId is required' })
        return
      }

      // Construct the event object
      const event: Event = {
        eventType: EventType.USER_NOTIFICATION,
        payload: { userId, cryptoId, alertPrice, currentPrice, alertType, message }
      }

      // Process the event through the input port
      await this.eventInput.processEvent(event)

      res.status(200).json({ status: 'Notification event processed' })
    } catch (error) {
      console.error('Error processing notifyUser event:', error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
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
