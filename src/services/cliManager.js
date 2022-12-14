import os from 'os';
import { InvalidInputError, OperationFailedError } from '../errors/cli.error.js';
import { CLIManagerLogger } from '../logger/logger.js';


export class CLIManager {
  static START_CLI_ARGUMENT = '--username';
  static _instance = null;
  
  /**
  * Get class instance - it's working as singleton
  * @return {CLIManager} - global dependencies for services
  */
  static getInstance() {
    return this._instance;
  }
  
  /**
  * Start cli program - can start only once
  * @return {void}
  */
  static startProgram(args) {
    try {
      if (this._instance) {
        throw new OperationFailedError();
      }
  
      const startArgument = args.find((arg) => arg.startsWith(this.START_CLI_ARGUMENT));
      if (!startArgument) {
        throw new InvalidInputError();
      }
      
      const [cliArgument, userName] = startArgument.split('=');
      
      if (cliArgument !== this.START_CLI_ARGUMENT) {
        throw new InvalidInputError();
      }

      this._instance = new this({ userName, currentDir: os.homedir() });
      delete this._instance.constructor;

      CLIManagerLogger.start(userName);
      CLIManagerLogger.currentDir(os.homedir());

    } catch (err) {
      console.error(err);
    }
  }

  /**
  * Finish cli program - can start only once
  * @return {void}
  */
  static finishProgram(readline) {
    CLIManagerLogger.finish(this._instance.userName);
    readline.close();
  }
  
  /**
  * Create global cli dependencies
  * @param {string} userName - Value for "--username" argument
  * @param {string} currentDir - Current "virtual" working directory
  */
  constructor({ userName, currentDir }) {
    this.userName = userName;
    this.currentDir = currentDir;
  }
}