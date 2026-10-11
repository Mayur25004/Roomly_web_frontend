import type { Booking } from "../types/models.ts";

export type BookingHistoryView = "upcoming" | "past";

export function getBookingsForView(
  bookings: Booking[],
  view: BookingHistoryView,
  now: Date = new Date(),
): Booking[] {
  return bookings
    .filter((booking) => {
      const startsInFuture = new Date(booking.startTime) >= now;
      const isCancelled = booking.status === "cancelled";

      if (view === "upcoming") {
        return startsInFuture && !isCancelled;
      }

      return !startsInFuture || isCancelled;
    })
    .sort((first, second) => {
      const firstStart = new Date(first.startTime).getTime();
      const secondStart = new Date(second.startTime).getTime();

      return view === "upcoming"
        ? firstStart - secondStart
        : secondStart - firstStart;
    });
}
