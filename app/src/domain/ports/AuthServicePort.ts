export interface AuthServicePort {
  validateToken(token: string): Promise<{ userId: string } | null>
}

import { Socket } from 'socket.io'

export interface AuthenticatedSocket extends Socket {
  userId: string
}
