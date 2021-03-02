import * as path from 'path';

import * as winston from 'winston';

class Logger {
  constructor(name?: string, folder?: string) {
    const { format, transports } = winston;
    this.folder = (folder) ? folder : this.logTimestamp();
    const logFile = path.join('', 'exec', this.folder, (name) ? name : 'exec.log');
    this.logger = winston.createLogger({
      levels: {
        debug: 2,
        info: 1,
        error: 0
      },
      transports: [
        new transports.File({
          filename: logFile,
          level: 'error',
          format: format.combine(format.simple())
        }),
        new transports.File({
          filename: logFile,
          level: 'info',
          format: format.combine(format.simple())
        })
      ]
    });
  }

  logger: winston.Logger;

  folder: string;

  timestamp(): string {
    return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      .replace(/T/, ' ')
      .replace(/\..+/, '');
  }

  logTimestamp(): string {
    return new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      .replace(/T|:|\//g, '-')      // replace T with a space
      .replace(/\..+|,/, '')     // delete the dot and everything after
      .replace(/ /g, '-');     // delete the dot and everything after
  }

  debug(message: string): void {
    this.logger.debug(`${this.timestamp()} - ${message}`);
  }

  info(message: string): void {
    this.logger.info(`${this.timestamp()} - ${message}`);
  }

  error(message: string): void {
    this.logger.error(`${this.timestamp()} - ${message}`);
  }

  close(): void {
    this.logger.on('flush', () => {
      process.exit(0);
    });    
  }

}

const logger = new Logger();

export { logger, Logger };