import os from 'os';
import { InvalidInputError } from '../errors/cli.error.js';
import { catchError } from '../utils/catchError.js';

export class OSManager {
  OS_ARGS_COUNT = 1;
  
  constructor(cliManager) {
    this.cliManager = cliManager;
  }

  async os(args) {
    try {
      if (args.length !== this.OS_ARGS_COUNT) {
        throw new InvalidInputError();
      }
  
      const [osArg] = args;

      switch (osArg) {
        case '--EOL': 
          this.getEOL();
          break;
        case '--cpus': 
          this.getCpus();
          break;
        case '--homedir': 
          this.getHomedir();
          break;
        case '--username': 
          this.getUsername();
          break;
        case '--architecture': 
          this.getArchitecture();
          break;
        default:
          throw new InvalidInputError();
      } 
    } catch (err) {
      catchError(err);
    }
  }

  getEOL() {
    console.log(JSON.stringify(os.EOL));
  } 

  getCpus() {
    const overallAmount = os.cpus().length;
    const cpuInfo = os.cpus().map(({ model, speed }) => ({ model, clockRate: speed / 1e3 }));
    
    console.log({
      overallAmount,
      info: cpuInfo,
    });
  }

  getHomedir() {
    console.log(os.homedir());
  }

  getUsername() {
    console.log(os.userInfo().username);
  }

  getArchitecture() {
    console.log(os.arch());
  } 
}
