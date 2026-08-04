import { afterEach, describe, expect, it } from "vitest";
import {
  createPartnerSessionToken,
  verifyPartnerSessionToken,
} from "@/lib/security/partner-session";

describe("partner-session", () => {
  const previous = process.env.SESSION_SIGNING_SECRET;

  afterEach(() => {
    if (previous === undefined) {
      delete process.env.SESSION_SIGNING_SECRET;
    } else {
      process.env.SESSION_SIGNING_SECRET = previous;
    }
  });

  it("signs and verifies a token", async () => {
    process.env.SESSION_SIGNING_SECRET = "test-signing-secret-32chars!!";
    const token = await createPartnerSessionToken();
    const result = await verifyPartnerSessionToken(token);
    expect(result.ok).toBe(true);
  });

  it("rejects tampered tokens", async () => {
    process.env.SESSION_SIGNING_SECRET = "test-signing-secret-32chars!!";
    const token = await createPartnerSessionToken();
    const tampered = `${token.slice(0, -4)}xxxx`;
    expect((await verifyPartnerSessionToken(tampered)).ok).toBe(false);
  });

  it("rejects expired tokens", async () => {
    process.env.SESSION_SIGNING_SECRET = "test-signing-secret-32chars!!";
    const token = await createPartnerSessionToken(Date.now() - 60_000, 1);
    expect((await verifyPartnerSessionToken(token)).ok).toBe(false);
  });
});
