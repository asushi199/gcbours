import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/security/password-hash";

describe("password-hash", () => {
  it("round-trips a password", async () => {
    const hash = await hashPassword("our-secret-day");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(await verifyPassword("our-secret-day", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });
});
