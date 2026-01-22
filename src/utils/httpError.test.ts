import { describe, it, expect } from "vitest";
import { HttpError } from "./httpError.js";

describe("HttpError", () => {
    it("should create an instance of HttpError with correct properties", () => {
        const error = new HttpError(404, "Not Found");
        expect(error).toBeInstanceOf(HttpError);
        expect(error).toBeInstanceOf(Error);
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("Not Found");
        expect(error.name).toBe("HttpError");
    });

    it("should work with 500 status code", () => {
        const error = new HttpError(500, "Internal Server Error");
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe("Internal Server Error");
    });
});
