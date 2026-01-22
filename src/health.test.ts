import request from "supertest";
import { describe, it, expect } from "vitest";
import { createApp } from "./app.js";

describe("GET /health", () => {
    it("should return 200 and ok: true", async () => {
        const app = createApp();
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ ok: true });
    });
});
