interface IAPIError extends Error {
    code: number;
}

class APIError implements IAPIError {
    name: string;
    constructor(readonly code: number, readonly message: string) {}
}

class UnauthorizedError extends APIError {
    name = "Unauthorized";
    constructor() { super(403, "Not authorized to access this resource."); }
}

export {
    APIError,
    UnauthorizedError
};