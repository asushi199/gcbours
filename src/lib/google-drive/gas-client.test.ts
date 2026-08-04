import { describe, expect, it } from "vitest";
import { isDriveConfigured } from "@/lib/google-drive/gas-client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

describe("Phase 2 env helpers", () => {
  it("reports supabase as unconfigured without env", () => {
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("reports drive gas gateway as unconfigured without env", () => {
    expect(isDriveConfigured()).toBe(false);
  });
});
