import { describe, expect, it } from "vitest";

import { HttpError } from "./httpError.js";

describe("HttpError", () => {
  it("creates HttpError with statusCode + message", () => {
    const err = new HttpError(404, "Not Found");
    expect(err).toBeInstanceOf(HttpError);
    expect(err).toBeInstanceOf(Error);
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Not Found");
    expect(err.name).toBe("HttpError");
    expect(err.code).toBeUndefined();
    expect(err.details).toBeUndefined();
  });

  it("supports optional code/details without assigning undefined", () => {
    const err = new HttpError(400, "Bad Request", {
      code: "VALIDATION_ERROR",
      details: [{ field: "email", message: "Invalid" }]
    });

    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.details).toEqual([{ field: "email", message: "Invalid" }]);
  });

  it("does not set code when not provided", () => {
    const err1 = new HttpError(400, "Bad");
    expect(err1.code).toBeUndefined();

    const err2 = new HttpError(400, "Bad", {});
    expect(err2.code).toBeUndefined();
  });
});
