import { pino, type Logger } from 'pino';

export const logger: Logger = pino({
  timestamp: true,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
  level: process.env.PINO_LOG_LEVEL || 'info',

  redact: [], // prevent logging of sensitive data
});
