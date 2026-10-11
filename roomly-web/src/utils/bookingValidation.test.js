import test from "node:test";
import assert from "node:assert/strict";
import {
  validateBookingInput,
  validateTimeWindow,
} from "./bookingValidation.ts";

const now = new Date(2026, 0, 1, 8, 0);
const validBooking = {
  title: "Planning meeting",
  attendeeCount: "5",
  meetingDate: "2026-01-02",
  startTime: "10:00",
  endTime: "11:00",
};

test("accepts a valid booking", () => {
  assert.equal(validateBookingInput(validBooking, 8, now), "");
});

test("requires a meeting title", () => {
  assert.equal(
    validateBookingInput({ ...validBooking, title: "   " }, 8, now),
    "Enter a title for this meeting.",
  );
});

test("does not allow more attendees than room capacity", () => {
  assert.equal(
    validateBookingInput({ ...validBooking, attendeeCount: "9" }, 8, now),
    "This room can hold up to 8 people.",
  );
});

test("rejects a start time in the past", () => {
  assert.equal(
    validateTimeWindow(
      { date: "2026-01-01", startTime: "07:00", endTime: "08:00" },
      now,
    ),
    "The booking must start in the future.",
  );
});

test("enforces the 15 minute minimum", () => {
  assert.equal(
    validateTimeWindow(
      { date: "2026-01-02", startTime: "10:00", endTime: "10:14" },
      now,
    ),
    "Bookings must be at least 15 minutes long.",
  );
});

test("enforces the 4 hour maximum", () => {
  assert.equal(
    validateTimeWindow(
      { date: "2026-01-02", startTime: "10:00", endTime: "14:01" },
      now,
    ),
    "Bookings cannot be longer than 4 hours.",
  );
});

test("requires the end time to follow the start time on that date", () => {
  assert.match(
    validateTimeWindow(
      { date: "2026-01-02", startTime: "15:00", endTime: "10:00" },
      now,
    ),
    /end time must be after the start time/,
  );
});
