export interface EventInputPort {
  processEvent(eventJson: any): Promise<void>
}
