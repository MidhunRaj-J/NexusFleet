export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export function handleError(error) {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  if (error instanceof TypeError) {
    return {
      message: 'Invalid data format. Please try again.',
      code: 'TYPE_ERROR',
      statusCode: 400,
    };
  }

  if (error instanceof ReferenceError) {
    return {
      message: 'An internal error occurred. Please refresh and try again.',
      code: 'REFERENCE_ERROR',
      statusCode: 500,
    };
  }

  return {
    message: error?.message || 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  };
}

export function showErrorToast(message) {
  // Simple toast/notification helper
  console.error(message);
  // Can be enhanced with a toast library later
}
