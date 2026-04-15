class CustomError extends Error {
  statusCode: number;
  status: 'success' | 'fail' | 'server error';
  success: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode ?? 500;
    this.status =
      statusCode >= 400 && statusCode < 500 ? 'success' : 'server error';
    this.success = statusCode >= 400 && statusCode < 500 ? true : false;
    Error.captureStackTrace(this, CustomError);
  }
}

export default CustomError;
