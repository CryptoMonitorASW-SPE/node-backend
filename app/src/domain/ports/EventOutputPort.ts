export interface EventOutputPort {
  sendToUser(userId: any, arg1: { message: any }): unknown
  broadcastEUR(messageJson: any): void
  broadcastUSD(messageJson: any): void
}
