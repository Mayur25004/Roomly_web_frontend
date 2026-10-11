import test from "node:test";
import assert from "node:assert/strict";
import { getBookingStatusLabel, getBookingsForView } from "./bookingHistory.js";

const bookings = [
  { id: "upcoming", startTime: "2026-05-03T10:00:00.000Z", endTime: "2026-05-03T11:00:00.000Z", status: "active" },
  { id: "cancelled-upcoming", startTime: "2026-05-04T10:00:00.000Z", endTime: "2026-05-04T11:00:00.000Z", status: "cancelled" },
  { id: "completed", startTime: "2026-05-01T10:00:00.000Z", endTime: "2026-05-01T11:00:00.000Z", status: "active" },
];

test("shows confirmed future bookings under Upcoming", () => {
  const result = getBookingsForView(
    bookings,
    "upcoming",
    new Date("2026-05-02T00:00:00.000Z"),
  );
  assert.deepEqual(result.map((booking) => booking.id), ["upcoming"]);
});

test("moves cancelled bookings to Past immediately and sorts newest first", () => {
  const result = getBookingsForView(
    bookings,
    "past",
    new Date("2026-05-02T00:00:00.000Z"),
  );
  assert.deepEqual(result.map((booking) => booking.id), ["cancelled-upcoming", "completed"]);
});

test("keeps an ongoing booking out of Past until its end time", () => {
  const ongoing = {
    id: "ongoing",
    startTime: "2026-05-02T09:30:00.000Z",
    endTime: "2026-05-02T10:30:00.000Z",
    status: "active",
  };
  const now = new Date("2026-05-02T10:00:00.000Z");

  assert.deepEqual(getBookingsForView([ongoing], "upcoming", now), [ongoing]);
  assert.deepEqual(getBookingsForView([ongoing], "past", now), []);
  assert.equal(getBookingStatusLabel(ongoing, now), "In progress");
});

test("uses Completed only after a non-cancelled booking has ended", () => {
  const completed = {
    id: "completed",
    startTime: "2026-05-02T09:00:00.000Z",
    endTime: "2026-05-02T10:00:00.000Z",
    status: "active",
  };

  assert.equal(
    getBookingStatusLabel(completed, new Date("2026-05-02T10:00:00.000Z")),
    "Completed",
  );
});

test("keeps the Cancelled status label", () => {
  assert.equal(getBookingStatusLabel(bookings[1]), "Cancelled");
});
