import { Server as NodeHttpServer } from 'http'
import { Socket, Server as SocketIOServer } from 'socket.io'
import { inject, injectable } from 'tsyringe'
import { EventOutputPort } from '../../domain/ports/EventOutputPort'
import { AuthServicePort, AuthenticatedSocket } from '../../domain/ports/AuthServicePort'
import * as cookie from 'cookie'

@injectable()
export class SocketIOAdapter implements EventOutputPort {
  private io!: SocketIOServer
  private authIo!: SocketIOServer
  private isInitialized = false
  private userSocketMap: Record<string, Socket> = {}

  constructor(
    @inject('HttpServer') private httpServer: NodeHttpServer,
    @inject('AuthServicePort') private authService: AuthServicePort
  ) {
    this.initialize()
  }

  public initialize(): void {
    if (!this.isInitialized) {
      // Public socket (no auth)
      this.io = new SocketIOServer(this.httpServer, {
        path: '/updates',
        cors: { origin: '*', methods: ['GET', 'POST'] }
      })

      this.io.on('connection', socket => {
        console.log('Client connected (public socket) -', socket.id)
        socket.on('disconnect', () => {
          console.log('Client disconnected (public socket) -', socket.id)
        })
      })

      // Authenticated socket
      this.authIo = new SocketIOServer(this.httpServer, {
        path: '/user-updates',
        cors: {
          origin: 'http://frontend:80',
          methods: ['GET', 'POST'],
          credentials: true
        }
      })

      // Use AuthService for token validation
      this.authIo.use(async (socket, next) => {
        try {
          const cookieHeader = socket.handshake.headers.cookie
          if (!cookieHeader) {
            return next(new Error('No cookies provided'))
          }
          // Parse the cookie header. For example, if the cookie is set like: authToken=...;
          const cookies = cookie.parse(cookieHeader)
          const authToken = cookies['authToken']
          if (!authToken) {
            return next(new Error('No authToken provided in cookies'))
          }
          const validationResult = await this.authService.validateToken(authToken)
          if (validationResult) {
            ;(socket as AuthenticatedSocket).userId = validationResult.userId
            return next()
          } else {
            return next(new Error('Unauthorized'))
          }
        } catch (error) {
          console.error('Socket auth error:', error)
          return next(new Error('Unauthorized'))
        }
      })

      this.authIo.on('connection', socket => {
        const userId = (socket as AuthenticatedSocket).userId
        console.log(`Client connected (auth socket): userId=${userId}, socketId=${socket.id}`)

        // Store socket in map
        this.userSocketMap[userId] = socket
        socket.on('disconnect', () => {
          console.log(`Client disconnected (auth socket): userId=${userId}, socketId=${socket.id}`)
          // Clean up user socket reference if it hasn’t changed
          const mappedSocket = this.userSocketMap[userId]
          if (mappedSocket && mappedSocket.id === socket.id) {
            Reflect.deleteProperty(this.userSocketMap, userId)
          }
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

  // Send a message to a specific authenticated user
  public sendToUser(userId: string, messageJson: any): void {
    if (!this.isInitialized) {
      throw new Error('SocketIOAdapter not initialized')
    }
    const userSocket = this.userSocketMap[userId]
    if (userSocket) {
      userSocket.emit('user-specific-event', messageJson)
    }
  }
}
