import os from 'os';
import { readdir, stat } from 'fs/promises';
import { OperationFailedError, InvalidInputError } from '../errors/cli.error.js';
import { normalizePath } from '../utils/getFullPath.js';
import { catchError } from '../utils/catchError.js';
import { CLILogger } from '../logger/logger.js';

export class NavigationManager {
  CD_ARGS_COUNT = 1;
  LS_ARGS_COUNT = 0;
  UP_ARGS_COUNT = 0;

  constructor(cliManager) {
    this.cliManager = cliManager;
  }
  // print dir content 
  async ls(args) {
    try {
      if (args.length !== this.LS_ARGS_COUNT) {
        throw new InvalidInputError();
      }

      const folderList = await readdir(this.cliManager.currentDir);
      const dirData = await Promise.all(
        folderList.map(
          async (f) => {
            const stats = await stat(normalizePath(this.cliManager.currentDir, f));
            const type = stats.isDirectory() ? 'directory' : 'file';
            return { Name: f, Type: type };
          }
        )
      );
      dirData.sort((a, b) => a.Type > b.Type ? 1 : -1);

      CLILogger.printTable(dirData);
      CLILogger.currentDir(this.cliManager.currentDir);
    } catch (err) {
      catchError(err);
    }
  }
  // change directory
  async cd(args) {
    try {
      if (args.length !== this.CD_ARGS_COUNT) {
        throw new InvalidInputError();
      }
      
      const [f] = args;
      const normalizedPath = normalizePath(this.cliManager.currentDir, f);
      const fStat = await stat(normalizedPath);
      
      if (fStat.isFile()) {
        throw new OperationFailedError();
      }

      if (normalizedPath.startsWith(os.homedir())) {
        this.cliManager.currentDir = normalizedPath;
      }

      CLILogger.currentDir(this.cliManager.currentDir); 
    } catch (err) {
      catchError(err);
    }
  }
  // change directory on "up" level
  async up(args) {
    try {
      if (args.length !== this.UP_ARGS_COUNT) {
        throw new InvalidInputError();
      }
      const normalizedDirPath = normalizePath(this.cliManager.currentDir, '..');

      if (normalizedDirPath.startsWith(os.homedir())) {
        this.cliManager.currentDir = normalizedDirPath;
      }

      CLILogger.currentDir(this.cliManager.currentDir); 
    } catch (err) {
      catchError(err);
    }
  }
}