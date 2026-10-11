import test from "node:test";
import assert from "node:assert/strict";
import { mockRooms } from "../data/mockRooms.js";
import {
  createMockBooking,
  getMockMyBookings,
} from "./mockMyBookingsService.js";

test("booking conflicts are matched by room ID after a room is renamed", async () => {
  const room = mockRooms.find((item) => String(item.id) === "1");
  assert.ok(room);

  const originalName = room.name;
  const existingBooking = (await getMockMyBookings()).find(
    (booking) => String(booking.roomId) === String(room.id) && booking.status !== "cancelled",
  );
  assert.ok(existingBooking);

  room.name = "Renamed conference room";
  try {
    await assert.rejects(
      createMockBooking({
        roomId: room.id,
        title: "Overlapping meeting",
        attendeeCount: 2,
        startTime: existingBooking.startTime,
        endTime: existingBooking.endTime,
      }),
      /already has a booking during that time/,
    );
  } finally {
    room.name = originalName;
  }
});
