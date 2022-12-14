import { readFile, stat } from 'fs/promises';
import { createHash } from 'crypto'; 
import { InvalidInputError, OperationFailedError } from '../errors/cli.error.js';
import { normalizePath } from '../utils/getFullPath.js';
import { catchError } from '../utils/catchError.js';
import { CLILogger } from '../logger/logger.js';

export class HashManager {
  HASH_ARGS_COUNT = 1;

  constructor(cliManager) {
    this.cliManager = cliManager;
  }

  async hash(args) {
    try {
      if (args.length !== this.HASH_ARGS_COUNT) {
        throw new InvalidInputError();
      }
      
      const [f] = args;
      const normalizedPath = normalizePath(this.cliManager.currentDir, f);
      const fStat = await stat(normalizedPath);
      
      if (fStat.isDirectory()) {
        throw new OperationFailedError();
      }

      const data = await readFile(normalizedPath, { encoding: 'utf-8' });
      const hash = createHash('sha256').update(data);  

      console.log(hash.digest('hex'));

      CLILogger.currentDir(this.cliManager.currentDir);
    } catch (err) {
      catchError(err);
    }
  }
}