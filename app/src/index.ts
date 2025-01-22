import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { container } from 'tsyringe';

import { EventAdapter } from './infrastructure/adapters/EventAdapter';
import { SocketIOAdapter } from './infrastructure/adapters/SocketIOAdapter';
import { EventService } from './application/EventService';

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);
container.registerInstance('HttpServer', server);
container.registerSingleton('EventOutputPort', SocketIOAdapter);

container.registerSingleton('EventInputPort', EventService);

const eventAdapter = container.resolve(EventAdapter);
eventAdapter.initialize();

// Mount routes
app.use('/', eventAdapter.getRouter());

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});