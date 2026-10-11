import test from "node:test";
import assert from "node:assert/strict";
import { calculateUtilizationRows } from "./utilization.js";
import { getLocalDateString } from "./dateTime.js";

function localIso(year, month, day, hour, minute = 0) {
  const date = new Date(year, month - 1, day, hour, minute);
  return date.toISOString();
}

test("counts active bookings and hours that overlap the selected date range", () => {
  const dateRange = { startDate: "2026-01-10", endDate: "2026-01-10" };
  const rangeDay = new Date(`${dateRange.startDate}T00:00:00`);
  const date = getLocalDateString(rangeDay);
  const previous = new Date(rangeDay);
  previous.setDate(previous.getDate() - 1);
  const previousDate = getLocalDateString(previous);
  const rooms = [{ id: 1, name: "Room A" }, { id: 2, name: "Room B" }];
  const bookings = [
    { roomId: 1, status: "active", startTime: localIso(2026, 1, 10, 9), endTime: localIso(2026, 1, 10, 10, 30) },
    { roomId: 1, status: "active", startTime: localIso(2026, 1, 9, 23), endTime: localIso(2026, 1, 10, 1) },
    { roomId: 1, status: "cancelled", startTime: localIso(2026, 1, 10, 11), endTime: localIso(2026, 1, 10, 12) },
    { roomId: 2, status: "active", startTime: localIso(2026, 1, 11, 1), endTime: localIso(2026, 1, 11, 2) },
  ];
  assert.equal(date, dateRange.startDate);
  assert.equal(previousDate, "2026-01-09");

  const result = calculateUtilizationRows(rooms, bookings, dateRange);
  assert.deepEqual(result, [
    { roomId: 1, roomName: "Room A", bookedHours: 2.5, bookingCount: 2 },
    { roomId: 2, roomName: "Room B", bookedHours: 0, bookingCount: 0 },
  ]);
});
