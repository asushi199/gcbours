import { expect, test } from "@playwright/test";

test.describe("OURS smoke", () => {
  test("unlock page is reachable", async ({ page }) => {
    await page.goto("/unlock");
    await expect(page.getByRole("heading", { name: /Identity verification required/i })).toBeVisible();
    await expect(page.getByLabel("专属密码")).toBeVisible();
  });

  test("protected experience routes redirect to unlock when logged out", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/unlock/);
  });

  test("studio requires admin login", async ({ page }) => {
    await page.goto("/studio");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("login page renders", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("heading", { name: "管理员登录" })).toBeVisible();
  });
});
