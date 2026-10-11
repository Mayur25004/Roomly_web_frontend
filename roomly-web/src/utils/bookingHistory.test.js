import test from "node:test";
import assert from "node:assert/strict";
import { getBookingsForView } from "./bookingHistory.ts";

const bookings = [
  { id: "upcoming", startTime: "2026-05-03T10:00:00.000Z", status: "active" },
  { id: "cancelled-upcoming", startTime: "2026-05-04T10:00:00.000Z", status: "cancelled" },
  { id: "completed", startTime: "2026-05-01T10:00:00.000Z", status: "active" },
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
