import * as fs from 'fs';
import * as path from 'path';


const ParseFile = () : void => {
  const file = fs.readFileSync(path.resolve('', 'Clientes_Cloud.txt'), 'utf-8');

  const lines = file.split('\r\n');

  let count = 0;

  let environment = '';
  let name = '';

  let project = {};
  let production = {};
  let quality = {};
  
  const separate = (env: string) : string => {
    name = env.toUpperCase();
    if (name.indexOf('_QA') > -1) {
      return 'QA';
    } else if (name.indexOf('_PROJ') > -1) {
      return 'PROJ';
    } else {
      return 'PROD';
    }
  }; 
  
  const setData = (type: string, value: string) : void => {
    switch(environment) {
    case 'PROJ':
      project = {
        ...project,
        [name] : {
          ...project[name],
          [type] : value
        }
      };
      break;
    case 'QA':
      quality = {
        ...quality,
        [name] : {
          ...quality[name],
          [type] : value
        }
      };
      break;
    case 'PROD':
      production = {
        ...production,
        [name] : {
          ...production[name],
          [type] : value
        }
      };
      break;
    default:
      break;
    }
  };
    
  for (const line of lines) {
    const data = line.replace('# ', '');
    switch (count) {
    case 0:   
      environment = separate(data);
      count++;
      break;
    case 1:            
      setData('user', data);
      count++;
      break;
    case 2:            
      setData('pass', data);
      count++;
      break;
    case 3:   
      setData('dbConn', data);
      count = 0;
      break;                            
    default:
      break;
    }
  }

  fs.writeFileSync('project.json', JSON.stringify(project));
  fs.writeFileSync('quality.json', JSON.stringify(quality));
  fs.writeFileSync('production.json', JSON.stringify(production));
};

export default ParseFile;