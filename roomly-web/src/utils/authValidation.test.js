import test from "node:test";
import assert from "node:assert/strict";
import { validateEmployeeRegistration } from "./authValidation.js";

const validRegistration = {
  name: "Sam Lee",
  email: "sam@example.com",
  password: "password1",
};

test("accepts a registration with a name, email, and long enough password", () => {
  assert.equal(validateEmployeeRegistration(validRegistration), "");
});

test("rejects a name that contains only spaces", () => {
  assert.equal(
    validateEmployeeRegistration({ ...validRegistration, name: "   " }),
    "Enter your name.",
  );
});

test("rejects a blank email and a password shorter than eight characters", () => {
  assert.equal(
    validateEmployeeRegistration({ ...validRegistration, email: "   " }),
    "Enter your email address.",
  );
  assert.equal(
    validateEmployeeRegistration({ ...validRegistration, password: "short" }),
    "Use a password with at least 8 characters.",
  );
});
