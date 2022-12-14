export class OperationFailedError extends Error {
  constructor(message = 'Operation failed') {
    super(message);
    this.name = 'OperationFailedError';
  }
}

export class InvalidInputError extends Error {
  constructor(message = 'Invalid input') {
    super(message);
    this.name = 'InvalidInputError';
  }
}