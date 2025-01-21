import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { container } from 'tsyringe';
import { HandleReceivedEvent } from './application/HandleReceivedEvent';
import { SocketIOService } from './infrastructure/SocketIOAdapter';
import { EventController } from './infrastructure/EventController';

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  path: '/updates',
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

container.registerInstance(SocketIOServer, io);
container.registerSingleton(SocketIOService);
container.registerSingleton(HandleReceivedEvent);
container.registerSingleton(EventController);

const eventController = container.resolve(EventController);

app.post('/realtime/events', (req, res) => eventController.postEvent(req, res));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});