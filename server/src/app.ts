import cookieParser from 'cookie-parser';
import express from 'express';
import { ErrorRequestHandler } from 'express';
import createError from 'http-errors';
import morgan from 'morgan';
import path from 'path';

import Logger from './logger';

const app = express();
const logger = Logger('flipbook:app');

app.use(morgan('dev', { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// We intentionally include the `next` parameter, even though it's never read,
// because otherwise this function won't be recognized as an error handler
// by Express, and the default error handler will be used instead.
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500);
  res.json({ error: { name: err.name, message: err.message } });
};
app.use(errorHandler);

export = app;
