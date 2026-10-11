import test from "node:test";
import assert from "node:assert/strict";
import { findAvailableRooms } from "./availabilityRules.js";

const rooms = [
  { id: 1, name: "Room A", capacity: 8, active: true, amenities: ["Display", "Whiteboard"] },
  { id: 2, name: "Room B", capacity: 4, active: true, amenities: ["Display"] },
  { id: 3, name: "Room C", capacity: 10, active: false, amenities: ["Display", "Whiteboard"] },
];
const criteria = {
  startTime: "2026-01-02T10:00:00.000Z",
  endTime: "2026-01-02T11:00:00.000Z",
  minimumCapacity: 1,
  requiredAmenities: [],
};

test("excludes a room with any booking overlap during the requested window", () => {
  const bookings = [
    {
      roomId: 1,
      status: "active",
      startTime: "2026-01-02T10:45:00.000Z",
      endTime: "2026-01-02T11:30:00.000Z",
    },
  ];
  const result = findAvailableRooms(rooms, bookings, criteria);
  assert.deepEqual(result.map((room) => room.id), [2]);
});

test("does not treat a cancelled booking as a conflict", () => {
  const bookings = [
    {
      roomId: 1,
      status: "cancelled",
      startTime: "2026-01-02T10:00:00.000Z",
      endTime: "2026-01-02T11:00:00.000Z",
    },
  ];
  const result = findAvailableRooms(rooms, bookings, criteria);
  assert.deepEqual(result.map((room) => room.id), [1, 2]);
});

test("requires all selected amenities and minimum capacity", () => {
  const result = findAvailableRooms(rooms, [], {
    ...criteria,
    minimumCapacity: 6,
    requiredAmenities: ["Display", "Whiteboard"],
  });
  assert.deepEqual(result.map((room) => room.id), [1]);
});

test("does not include inactive rooms", () => {
  const result = findAvailableRooms(rooms, [], {
    ...criteria,
    minimumCapacity: 9,
  });
  assert.deepEqual(result, []);
});
