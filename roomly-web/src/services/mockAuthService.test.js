import test from "node:test";
import assert from "node:assert/strict";
import { loginWithMock, registerWithMock } from "./mockAuthService.ts";

test("mock login returns a safe user summary without a password", async () => {
  const user = await loginWithMock("employee@roomly.local", "Roomly123!");
  assert.equal(user.role, "employee");
  assert.equal(user.email, "employee@roomly.local");
  assert.equal("password" in user, false);
});

test("public mock registration always creates an employee and rejects duplicates", async () => {
  const email = `assessment-${Date.now()}@example.test`;
  const user = await registerWithMock("Assessment User", email, "Password123!");
  assert.equal(user.role, "employee");
  assert.equal("password" in user, false);
  await assert.rejects(
    registerWithMock("Duplicate User", email, "Password123!"),
    /already exists/,
  );
});
