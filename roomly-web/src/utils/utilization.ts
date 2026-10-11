import type { Booking, Room, UtilizationDateRange, UtilizationRow } from "../types/models.ts";

export function calculateUtilizationRows(
  rooms: Room[],
  bookings: Booking[],
  dateRange: UtilizationDateRange,
): UtilizationRow[] {
  const start = new Date(`${dateRange.startDate}T00:00:00`);
  const end = new Date(`${dateRange.endDate}T00:00:00`);
  end.setDate(end.getDate() + 1);

  return rooms.map((room) => {
    const roomBookings = bookings.filter((booking) => {
      const overlapsRange =
        new Date(booking.startTime) < end && new Date(booking.endTime) > start;
      return (
        String(booking.roomId) === String(room.id) &&
        booking.status !== "cancelled" &&
        overlapsRange
      );
    });

    const bookedMilliseconds = roomBookings.reduce((total, booking) => {
      const overlapStart = Math.max(
        start.getTime(),
        new Date(booking.startTime).getTime(),
      );
      const overlapEnd = Math.min(
        end.getTime(),
        new Date(booking.endTime).getTime(),
      );
      return total + Math.max(0, overlapEnd - overlapStart);
    }, 0);

    return {
      roomId: room.id,
      roomName: room.name,
      bookedHours: Math.round((bookedMilliseconds / 3600000) * 10) / 10,
      bookingCount: roomBookings.length,
    };
  });
}
