import path from 'path';
import { stat } from 'fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { InvalidInputError, OperationFailedError } from '../errors/cli.error.js';
import { catchError } from '../utils/catchError.js';
import { normalizePath } from '../utils/getFullPath.js';
import { CLILogger } from '../logger/logger.js';

export class ZipManager {
  COMPRESS_ARGS_COUNT = 2;
  DECOMPRESS_ARGS_COUNT = 2;

  constructor(cliManager) {
    this.cliManager = cliManager;
  }

  async compress(args) {
    if (args.length !== this.COMPRESS_ARGS_COUNT) {
      throw new InvalidInputError();
    }
    
    const [srcF, destF] = args;
    const normalizedSrcPath = normalizePath(this.cliManager.currentDir, srcF);
    const normalizedDestPath = normalizePath(this.cliManager.currentDir, destF);

    try {
      const [srcFStat] = await Promise.all([
        stat(normalizedSrcPath), 
        stat(path.dirname(normalizedDestPath)),
      ]);

      if (srcFStat.isDirectory()) {
        throw new OperationFailedError();
      }

      const readableStream = createReadStream(normalizedSrcPath); 
      const writableStream = createWriteStream(normalizedDestPath); 
      await pipeline(readableStream, createBrotliCompress(), writableStream);

      CLILogger.currentDir(this.cliManager.currentDir);
    } catch (err) {
      catchError(err);
    }
  }

  async decompress(args) {
    if (args.length !== this.DECOMPRESS_ARGS_COUNT) {
      throw new InvalidInputError();
    }
    
    const [srcF, destF] = args;
    const normalizedSrcPath = normalizePath(this.cliManager.currentDir, srcF);
    const normalizedDestPath = normalizePath(this.cliManager.currentDir, destF);

    try {
      const [srcFStat] = await Promise.all([
        stat(normalizedSrcPath), 
        stat(path.dirname(normalizedDestPath)),
      ]);
   
      if (srcFStat.isDirectory()) {
        throw new OperationFailedError();
      }

      const readableStream = createReadStream(normalizedSrcPath); 
      const writableStream = createWriteStream(normalizedDestPath); 
      await pipeline(readableStream, createBrotliDecompress(), writableStream);

      CLILogger.currentDir(this.cliManager.currentDir);
    } catch (err) {
      catchError(err);
    }
  }
}