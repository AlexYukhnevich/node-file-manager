import path from 'path';
import { open, rename, unlink, stat } from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { InvalidInputError, OperationFailedError } from '../errors/cli.error.js';
import { catchError } from '../utils/catchError.js';
import { CLILogger } from '../logger/logger.js';
import { pipeline } from 'stream/promises';
import { normalizePath } from '../utils/getFullPath.js';


export class FileManager {
  CAT_ARGS_COUNT = 1;
  ADD_ARGS_COUNT = 1;
  REMOVE_ARGS_COUNT = 1;
  RENAME_ARGS_COUNT = 2;
  COPY_ARGS_COUNT = 2;
  MOVE_ARGS_COUNT = 2;
  
  constructor(cliManager) {
    this.cliManager = cliManager;
  }

  // print file
  async cat(args) {
    try {
      if (args.length !== this.CAT_ARGS_COUNT) {
        throw new InvalidInputError();
      }
  
      const [f] = args;
      const normalizedPath = normalizePath(this.cliManager.currentDir, f);
      const fStat = await stat(normalizedPath);
    
      if (fStat.isDirectory()) {
        throw new OperationFailedError();
      }
 
      const readableStream = createReadStream(normalizedPath, 'utf-8');

      readableStream.on('data', console.log);
      readableStream.on('end', () => CLILogger.currentDir(this.cliManager.currentDir));
    } catch (err) {
      catchError(err);
    }
  }
  // create a new file
  async add(args) {
    try {
      if (args.length !== this.ADD_ARGS_COUNT) {
        throw new InvalidInputError();
      }
  
      const [f] = args;
      const normalizedPath = normalizePath(this.cliManager.currentDir, f);
      
      await stat(normalizedPath);
      throw new OperationFailedError(); // throw error if file exists.
    } catch (err) {
      const isNotExistedFile = err.code === 'ENOENT';
      if (isNotExistedFile) {
        await open(err.path, 'w+');
        CLILogger.currentDir(this.cliManager.currentDir);
      } else {
        catchError(err);
      }
    }
  }
  // rename file
  async rn(args) {
    try {
      if (args.length !== this.RENAME_ARGS_COUNT) {
        throw new InvalidInputError();
      }
      
      const [srcF, destF] = args;
      const normalizedSrcPath = normalizePath(this.cliManager.currentDir, srcF);
      const normalizedDestPath = normalizePath(this.cliManager.currentDir, destF);
      const isTheSameFolder = path.dirname(normalizedSrcPath) === path.dirname(normalizedDestPath);    

      const fStat = await stat(normalizedSrcPath);

      if (fStat.isDirectory() || !isTheSameFolder) {
        throw new OperationFailedError();
      } 
    
      await rename(normalizedSrcPath, normalizedDestPath);

      CLILogger.currentDir(this.cliManager.currentDir);
    } catch (err) {
      catchError(err);
    }
  }
  // copy file
  async cp(args) {
    try {
      if (args.length !== this.COPY_ARGS_COUNT) {
        throw new InvalidInputError();
      }
    
      const [srcF, destF] = args;
      const normalizedSrcPath = normalizePath(this.cliManager.currentDir, srcF);
      const normalizedDestPath = normalizePath(this.cliManager.currentDir, destF);
  
      const [srcFStat, destFStat] = await Promise.all([
        stat(normalizedSrcPath), 
        stat(normalizedDestPath),
      ]);

      if (srcFStat.isDirectory() || destFStat.isFile()) {
        throw new OperationFailedError();
      } 
      
      const file = path.parse(srcF).base;
      const destFilePath = path.join(normalizedDestPath, file);

      const readableStream = createReadStream(normalizedSrcPath, 'utf-8');
      const writableStream = createWriteStream(destFilePath, 'utf-8');

      await pipeline(readableStream, writableStream);

      CLILogger.currentDir(this.cliManager.currentDir);
    } catch (err) {
      catchError(err);
    }
  }
  // move file
  async mv(args) {
    try {
      if (args.length !== this.MOVE_ARGS_COUNT) {
        throw new InvalidInputError();
      }
  
      const [srcF, destF] = args;
      const normalizedSrcPath = normalizePath(this.cliManager.currentDir, srcF);
      const normalizedDestPath = normalizePath(this.cliManager.currentDir, destF);

      const [srcFStat, destFStat] = await Promise.all([
        stat(normalizedSrcPath), 
        stat(normalizedDestPath),
      ]);

      if (srcFStat.isDirectory() || destFStat.isFile()) {
        throw new OperationFailedError();
      } 

      const file = path.parse(srcF).base;
      const destFilePath = path.join(normalizedDestPath, file);

      const readableStream = createReadStream(normalizedSrcPath , 'utf-8');
      const writableStream = createWriteStream(destFilePath, 'utf-8');

      await pipeline(readableStream, writableStream);
      await unlink(normalizedSrcPath);

      CLILogger.currentDir(this.cliManager.currentDir);
    } catch (err) {
      catchError(err);
    }
  }

  // remove file
  async rm(args) {
    try {
      if (args.length !== this.REMOVE_ARGS_COUNT) {
        throw new InvalidInputError();
      }
      const [f] = args;
      const normalizedPath = normalizePath(this.cliManager.currentDir, f);

      const fStat = await stat(normalizedPath);
  
      if (fStat.isDirectory()) {
        throw new OperationFailedError();
      }

      await unlink(normalizedPath);

      CLILogger.currentDir(this.cliManager.currentDir);
    } catch (err) {
      catchError(err);
    }
  }
}