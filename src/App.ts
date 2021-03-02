import * as fs from 'fs-extra';
import * as path from 'path';
import { logger } from './Logger';
import Runner from './Runner';

// User for Parsing the log from DevOps script runner
// import ParseFile from './ParseFile';
// ParseFile();

const App = async () => {
  const baseDir = path.resolve('', 'exec', logger.folder);
  try {
    fs.openSync(path.resolve(baseDir, 'executing-main'), 'w');
    logger.info(`Initiating script Execution on folder ${baseDir}`);
    logger.debug('Copying folder scripts');
    fs.copySync(path.resolve('', 'scripts'), path.resolve(baseDir, 'scripts'), {
      filter: (file) => {
        return (file.indexOf('.gitignore') > -1) ? false : true;
      }
    });
    logger.debug('Copying folder config');
    fs.copySync(path.resolve('', 'config'), path.resolve(baseDir, 'config'), {
      filter: (file) => {
        return (file.indexOf('.gitignore') > -1) ? false : true;
      }
    });
    logger.info('Reading "scripts" folder in order to check if there anre any scripts placed');
    const scriptDirectories = fs.readdirSync(path.resolve(baseDir, 'scripts'));
    scriptDirectories.length === 0 && logger.debug('No directories found');
    const processes = scriptDirectories.map(scriptDir => {
      logger.info(`Reading directory ${scriptDir}`);
      const dir = fs.readdirSync(path.resolve(baseDir, 'scripts', scriptDir));
      const scriptFiles = dir.filter(file => { return file.toLowerCase().indexOf('.sql') !== -1; });
      if (scriptFiles.length > 0) {
        const runner = new Runner(scriptDir, scriptFiles);
        return new Promise(resolve => resolve(runner.start()));
      } else {
        logger.debug('No script files found (.SQL extension)'); 
      }        
    });
    await Promise.all(processes);
  } catch (error) {
    logger.error(error);
  } finally {
    fs.removeSync(path.resolve(baseDir, 'executing-main'));
    logger.close();
  }
};

App().catch(console.error);