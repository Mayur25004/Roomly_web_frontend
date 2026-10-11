import type { AvailabilityCriteria, Booking } from "../types/models.ts";
import { mockRooms } from "../data/mockRooms.ts";
import { getMockMyBookings } from "./mockMyBookingsService.ts";
import { getLocalDateString } from "../utils/dateTime.ts";
import { findAvailableRooms } from "../utils/availabilityRules.ts";

export async function searchMockAvailability(criteria: AvailabilityCriteria) {
  const bookings = await getMockMyBookings();
  return findAvailableRooms(mockRooms, bookings, criteria);
}

export async function getMockRoomSchedule(roomId: string | number, date: string): Promise<Booking[]> {
  const room = mockRooms.find((item) => String(item.id) === String(roomId));
  if (!room) {
    throw new Error("That room could not be found.");
  }

  const bookings = await getMockMyBookings();
  return bookings
    .filter(
      (booking) =>
        String(booking.roomId) === String(roomId) &&
        getLocalDateString(new Date(booking.startTime)) === date,
    )
    .sort(
      (first, second) =>
        new Date(first.startTime).getTime() - new Date(second.startTime).getTime(),
    );
}
