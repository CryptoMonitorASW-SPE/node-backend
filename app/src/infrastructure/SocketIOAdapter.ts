import { Server as SocketIOServer, Socket } from 'socket.io';
import { BroadcastMessage } from '../domain/model/BroadcastMessage';
import { injectable } from 'tsyringe';

@injectable()
export class SocketIOService {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.io.on('connection', (socket: Socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }

  broadcast(message: BroadcastMessage): void {
    console.log('[SocketIOAdapter] Broadcasting message:', message);
    this.io.emit('broadcast', message);
  }
}