export class HttpError extends Error {
  statusCode: number;
  code?: string;
  details?: unknown;

  constructor(statusCode: number, message: string, options?: { code?: string; details?: unknown }) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";

    if (options?.code) this.code = options.code;
    if (options?.details !== undefined) this.details = options.details;
  }
}
