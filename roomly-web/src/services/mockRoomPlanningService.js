import { mockRooms } from "../data/mockRooms.js";
import { getMockMyBookings } from "./mockMyBookingsService.js";
import { getLocalDateString } from "../utils/dateTime.js";

export async function searchMockAvailability(criteria) {
  const bookings = await getMockMyBookings();
  const requestedStart = new Date(criteria.startTime);
  const requestedEnd = new Date(criteria.endTime);

  return mockRooms.filter((room) => {
    if (!room.active) {
      return false;
    }

    if (criteria.minimumCapacity && room.capacity < criteria.minimumCapacity) {
      return false;
    }

    const hasAmenities = criteria.requiredAmenities.every((amenity) =>
      room.amenities.includes(amenity),
    );
    if (!hasAmenities) {
      return false;
    }

    const hasConflict = bookings.some((booking) => {
      const sameRoom = String(booking.roomId) === String(room.id);
      const isActive = booking.status !== "cancelled";
      const overlaps =
        requestedStart < new Date(booking.endTime) &&
        requestedEnd > new Date(booking.startTime);

      return sameRoom && isActive && overlaps;
    });

    return !hasConflict;
  });
}

export async function getMockRoomSchedule(roomId, date) {
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
        new Date(first.startTime) - new Date(second.startTime),
    );
}
