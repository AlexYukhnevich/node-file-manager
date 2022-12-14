import { OperationFailedError } from "../errors/cli.error.js";

export const catchError = (err) => {
  const isNotExists = err?.code === 'ENOENT';
  if (isNotExists) {
    throw new OperationFailedError();
  } 
  throw err;
}