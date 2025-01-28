import { Server as NodeHttpServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { inject, injectable } from 'tsyringe'
import { EventOutputPort } from '../../application/ports/EventOutputPort'
import axios from 'axios'

@injectable()
export class SocketIOAdapter implements EventOutputPort {
  private io!: SocketIOServer
  private isInitialized = false

  constructor(@inject('HttpServer') private httpServer: NodeHttpServer) {
    this.initialize()
  }

  public initialize(): void {
    if (!this.isInitialized) {
      this.io = new SocketIOServer(this.httpServer, {
        path: '/updates',
        cors: { origin: '*', methods: ['GET', 'POST'] }
      })

      this.io.on('connection', async socket => {
        console.log('Client connected')

        socket.on('disconnect', () => {
          console.log('Client disconnected')
        })
      })

      this.isInitialized = true
    }
  }

  public broadcastEUR(messageJson: any): void {
    if (!this.isInitialized) {
      throw new Error('SocketIOAdapter not initialized')
    }
    this.io.emit('broadcastEUR', messageJson)
  }

  public broadcastUSD(messageJson: any): void {
    if (!this.isInitialized) {
      throw new Error('SocketIOAdapter not initialized')
    }
    this.io.emit('broadcastUSD', messageJson)
  }
}
