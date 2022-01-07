// Environment variables must be loaded as early as possible,
// e.g. so that the DEBUG environment variable is properly
// taken into account by the 'debug' module.
import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { AddressInfo } from 'net';

import app from './app';
import * as env from './env';
import Logger from './logger';

const logger = Logger('flipbook:server');

const port = parseInt(env.get('PORT') || '3000', 10);
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  switch (error.code) {
  case 'EACCES':
    console.error(`Port ${port} requires elevated privileges`);
    process.exit(1);
    break;
  case 'EADDRINUSE':
    console.error(`Port ${port} is already in use`);
    process.exit(1);
    break;
  default:
    throw error;
  }
}

function onListening() {
  const addr = server.address() as AddressInfo;
  logger.log(`Listening on port ${addr.port}`);
}
