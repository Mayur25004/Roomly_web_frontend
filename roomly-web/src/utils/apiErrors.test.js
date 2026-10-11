import test from "node:test";
import assert from "node:assert/strict";
import { getApiErrorMessage } from "./apiErrors.ts";

test("uses a server validation message and includes the request ID", () => {
  assert.equal(
    getApiErrorMessage(422, { message: "Attendee count exceeds room capacity." }, "req-123"),
    "Attendee count exceeds room capacity. Request ID: req-123.",
  );
});

test("provides a readable booking conflict message", () => {
  assert.match(getApiErrorMessage(409, null, null), /conflicts with existing data/);
});

test("explains an expired session", () => {
  assert.match(getApiErrorMessage(401, null, null), /session has expired/);
});
