import { EventHandler } from '../model/EventHandler'
import { Event, EventType } from '../model/Event'
import { EventOutputPort } from '../ports/EventOutputPort'
import { inject, injectable } from 'tsyringe'

@injectable()
export class UserNotificationHandler implements EventHandler {
  eventTypes: EventType[] = [EventType.USER_NOTIFICATION]

  constructor(@inject('EventOutputPort') private eventOutput: EventOutputPort) {}

  handle(event: Event): void {
    const { userId, message } = event.payload
    console.log(`[USERNOTIFICATIONHANDLER] Sending notification to user ${userId}: ${message}`)

    // Send the notification to the specific user via the EventOutputPort
    this.eventOutput.sendToUser(userId, { message })
  }
}
