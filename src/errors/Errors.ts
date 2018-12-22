interface IAPIError extends Error {
  code: number;
}

class APIError implements IAPIError {
  name: string;
  payload?: Error;
  constructor(readonly code: number, readonly message: string) {}
}

class UnauthorizedError extends APIError {
  name = "Unauthorized";
  constructor() {
    super(403, "Not authorized to access this resource.");
  }
}

class ValidationError extends APIError {
  name = "Invalid Data";
  constructor(cause?: Error) {
    super(400, "The input is invalid.");
    this.payload = cause;
  }
}

export { APIError, UnauthorizedError, ValidationError };
