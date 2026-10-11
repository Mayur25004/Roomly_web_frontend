import { mockRooms } from "../data/mockRooms.js";
import { getAllMockBookings } from "./mockMyBookingsService.js";
import { getLocalDateString } from "../utils/dateTime.js";
import { findAvailableRooms } from "../utils/availabilityRules.js";
export async function searchMockAvailability(criteria) {
    const bookings = await getAllMockBookings();
    return findAvailableRooms(mockRooms, bookings, criteria);
}
export async function getMockRoomSchedule(roomId, date) {
    const room = mockRooms.find((item) => String(item.id) === String(roomId));
    if (!room) {
        throw new Error("That room could not be found.");
    }
    const bookings = await getAllMockBookings();
    return bookings
        .filter((booking) => String(booking.roomId) === String(roomId) &&
        getLocalDateString(new Date(booking.startTime)) === date)
        .sort((first, second) => new Date(first.startTime).getTime() - new Date(second.startTime).getTime());
}
