import * as fs from 'fs-extra';
import { exec } from 'child_process';

import * as path from 'path';
import { logger, Logger } from './Logger';

interface DbConn {
  [key: string]: {
    user?: string,
    pass?: string,
    dbConn?: string
  }  
}

class Runner {
  constructor(env: string, files: string[]) {
    this.env = env;
    this.files = files;
    this.baseDir = path.resolve('', 'exec', logger.folder);
  }

  env: string;
  files: string[];
  baseDir: string;

  async start() : Promise<void> {
    const file = `${this.env}.json`;
    logger.debug(`Looking for the config file ${file}`);
    try {
      // Reading database config file
      const configFile = fs.readFileSync(path.resolve(this.baseDir, 'config', `${file}`), 'utf-8');
      logger.debug(`Parsing file ${file}`);
      const config = JSON.parse(configFile);
      // Looking for Database Connections and Validate if parameters are ok
      let dbConnections = {};
      Object.keys(config).forEach((it) => {
        logger.debug(`Parsing Connection Key ${it} from ${file}`);
        const user: string = config[it].user;
        const pass: string = config[it].pass;
        const dbConn: string = config[it].dbConn;
        if (user && pass && dbConn) {
          dbConnections = {
            ...dbConnections,
            [it] : {
              user,
              pass,
              dbConn
            }
          };
        } else {
          logger.debug(`Error in parameters for connection ${it}`);
        }
      });
      //Executes scripts on Each Database
      await this.execute(dbConnections);
    } catch (error) {
      logger.error(`Error reading file ${file} - ${error}`);
    }
    
  }

  async execute(dbParameters: DbConn) : Promise<boolean> {
    const scriptError = false;
    const scriptLogger = new Logger(`${this.env}.log`, logger.folder);
    //
    fs.openSync(path.resolve(this.baseDir, `executing-${this.env}`), 'w');
    for (const key of Object.keys(dbParameters)) {
      try {
        const { user, pass, dbConn } = dbParameters[key];        
        const conn = `sqlplus -s -l ${user}/${pass}@${dbConn}`; 
        // Connection Test        
        scriptLogger.debug(`${key}: ${conn}`);
        const connTest = await new Promise((resolve) => {
          exec(`echo exit | ${conn}`, (error, stdout, stderr) => {
            resolve((stdout) ? stdout : stderr);
          });
        });
        if (connTest.toString().indexOf('ORA-') == -1) {
          scriptLogger.debug(`${key}: Connected`);
          this.files.forEach(async (file) => {
            scriptLogger.info(`${key}: Running script @${file}`);
            const script = path.resolve(this.baseDir, 'scripts', this.env, file);
            const cmd = `${conn} @${script}`;
            scriptLogger.debug(`${key}: ${cmd}`);
            const execution = await new Promise((resolve) => {
              exec(`echo exit | ${cmd}`, (error, stdout, stderr) => {
                resolve((stdout) ? stdout : stderr);
              });
            });
            scriptLogger.info(`${key}: ${execution.toString()}`);
          });
        } else {
          scriptLogger.error(`${key}: ${connTest.toString().trimEnd()}`);
        }        
      } catch (error) {
        scriptLogger.error(`${key}: ${error}`);
      }
    }
    fs.removeSync(path.resolve(this.baseDir, `executing-${this.env}`));
    return !scriptError;
  }
}

export default Runner;