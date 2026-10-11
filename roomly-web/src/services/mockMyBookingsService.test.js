import test from "node:test";
import assert from "node:assert/strict";
import { mockRooms } from "../data/mockRooms.js";
import {
  createMockBooking,
  cancelMockBooking,
  getMockMyBookings,
} from "./mockMyBookingsService.js";
import { searchMockAvailability } from "./mockRoomPlanningService.js";

const storedSession = new Map([
  ["roomly-session-user", JSON.stringify({ id: "employee-demo" })],
]);
globalThis.sessionStorage = {
  getItem(key) {
    return storedSession.get(key) ?? null;
  },
  setItem(key, value) {
    storedSession.set(key, value);
  },
  removeItem(key) {
    storedSession.delete(key);
  },
};

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

test("returns only bookings owned by the signed-in user", async () => {
  assert.ok((await getMockMyBookings()).length > 0);

  storedSession.set("roomly-session-user", JSON.stringify({ id: "another-employee" }));
  assert.deepEqual(await getMockMyBookings(), []);

  storedSession.set("roomly-session-user", JSON.stringify({ id: "employee-demo" }));
});

test("does not allow a user to cancel another employee's booking", async () => {
  const booking = (await getMockMyBookings())[0];
  storedSession.set("roomly-session-user", JSON.stringify({ id: "another-employee" }));

  await assert.rejects(cancelMockBooking(booking.id), /could not be found/);

  storedSession.set("roomly-session-user", JSON.stringify({ id: "employee-demo" }));
});

test("availability still checks bookings made by other users", async () => {
  const employeeBooking = (await getMockMyBookings()).find(
    (booking) => String(booking.roomId) === "1" && booking.status !== "cancelled",
  );
  assert.ok(employeeBooking);
  storedSession.set("roomly-session-user", JSON.stringify({ id: "another-employee" }));

  const availableRooms = await searchMockAvailability({
    startTime: employeeBooking.startTime,
    endTime: employeeBooking.endTime,
    minimumCapacity: null,
    requiredAmenities: [],
  });

  assert.equal(availableRooms.some((room) => String(room.id) === "1"), false);
  storedSession.set("roomly-session-user", JSON.stringify({ id: "employee-demo" }));
});
