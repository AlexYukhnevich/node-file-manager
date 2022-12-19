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
  ZIP_EXT = '.br'

  constructor(cliManager) {
    this.cliManager = cliManager;
    this.file = null;
  }

  async compress(args) {
    if (args.length !== this.COMPRESS_ARGS_COUNT) {
      throw new InvalidInputError();
    }
    
    const [srcF, destF] = args;
    const normalizedSrcPath = normalizePath(this.cliManager.currentDir, srcF);
    const normalizedDestPath = normalizePath(this.cliManager.currentDir, destF);

    try {
      const [srcFStat, destFStat] = await Promise.all([
        stat(normalizedSrcPath), 
        stat(normalizedDestPath),
      ]);

      if (srcFStat.isDirectory() || destFStat.isFile()) {
        throw new OperationFailedError();
      }

      this.file = srcF;
      const srcFileNameWithoutExt = path.parse(this.file).name;
      const destFileNameWithExt = normalizePath(normalizedDestPath, `${srcFileNameWithoutExt}${this.ZIP_EXT}`);
      
      const readableStream = createReadStream(normalizedSrcPath); 
      const writableStream = createWriteStream(destFileNameWithExt); 
      await pipeline(readableStream, createBrotliCompress(), writableStream);

      CLILogger.currentDir(this.cliManager.currentDir);
    } catch (err) {
      this.file = null;
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
      const [srcFStat, destFStat] = await Promise.all([
        stat(normalizedSrcPath), 
        stat(normalizedDestPath),
      ]);
   
      if (srcFStat.isDirectory() || destFStat.isFile()) {
        throw new OperationFailedError();
      }
      console.log({ normalizedDestPath, file: this.file })
      const destFileNameWithExt = normalizePath(normalizedDestPath, this.file); 

      const readableStream = createReadStream(normalizedSrcPath); 
      const writableStream = createWriteStream(destFileNameWithExt); 
      await pipeline(readableStream, createBrotliDecompress(), writableStream);

      CLILogger.currentDir(this.cliManager.currentDir);
    } catch (err) {
      this.file = null;
      catchError(err);
    }
  }
}