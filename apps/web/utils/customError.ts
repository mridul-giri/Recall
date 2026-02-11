export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode || 500;
  }
}
