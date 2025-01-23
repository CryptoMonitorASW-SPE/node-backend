import { Server as NodeHttpServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { inject, injectable } from 'tsyringe'
import { EventOutputPort } from '../../application/ports/EventOutputPort'

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

      this.io.on('connection', socket => {
        console.log('Client connected')
        socket.on('disconnect', () => {
          console.log('Client disconnected')
        })
      })

      this.isInitialized = true
    }
  }

  public broadcast(messageJson: any): void {
    if (!this.isInitialized) {
      throw new Error('SocketIOAdapter not initialized')
    }
    this.io.emit('broadcast', messageJson)
  }
}
