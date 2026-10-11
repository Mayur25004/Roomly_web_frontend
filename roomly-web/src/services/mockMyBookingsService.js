import { mockRooms } from "../data/mockRooms.js";
import { getSavedUser } from "./sessionStore.js";
function dateFromToday(daysFromToday, hour, minute) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    date.setHours(hour, minute, 0, 0);
    return date.toISOString();
}
// These mock records all belong to the signed-in employee represented by this demo.
let mockBookings = [
    {
        id: "booking-101",
        userId: "employee-demo",
        roomName: "Conference Room A",
        roomId: 1,
        location: "Floor 1",
        title: "Product planning",
        attendeeCount: 7,
        startTime: dateFromToday(2, 10, 0),
        endTime: dateFromToday(2, 11, 0),
        status: "active",
    },
    {
        id: "booking-102",
        userId: "employee-demo",
        roomName: "Meeting Room B",
        roomId: 2,
        location: "Floor 2",
        title: "Sprint review",
        attendeeCount: 5,
        startTime: dateFromToday(5, 14, 0),
        endTime: dateFromToday(5, 15, 0),
        status: "active",
    },
    {
        id: "booking-103",
        userId: "employee-demo",
        roomName: "Board Room",
        roomId: 3,
        location: "Floor 3",
        title: "Quarterly review",
        attendeeCount: 10,
        startTime: dateFromToday(7, 9, 30),
        endTime: dateFromToday(7, 10, 30),
        status: "cancelled",
    },
    {
        id: "booking-104",
        userId: "employee-demo",
        roomName: "Conference Room A",
        roomId: 1,
        location: "Floor 1",
        title: "Project kickoff",
        attendeeCount: 6,
        startTime: dateFromToday(-4, 11, 0),
        endTime: dateFromToday(-4, 12, 0),
        status: "active",
    },
];
export async function getMockMyBookings() {
    const currentUser = getSavedUser();
    if (!currentUser) {
        return [];
    }
    return mockBookings
        .filter((booking) => String(booking.userId) === String(currentUser.id))
        .map((booking) => ({ ...booking }));
}
export async function getAllMockBookings() {
    return mockBookings.map((booking) => ({ ...booking }));
}
export async function cancelMockBooking(bookingId) {
    const currentUser = getSavedUser();
    const booking = mockBookings.find((item) => item.id === bookingId &&
        String(item.userId) === String(currentUser?.id));
    if (!booking) {
        throw new Error("That booking could not be found.");
    }
    if (booking.status === "cancelled") {
        throw new Error("This booking has already been cancelled.");
    }
    if (new Date(booking.startTime) <= new Date()) {
        throw new Error("Past bookings cannot be cancelled.");
    }
    booking.status = "cancelled";
    return { ...booking };
}
export async function createMockBooking(bookingDetails) {
    const currentUser = getSavedUser();
    if (!currentUser) {
        throw new Error("Sign in before creating a booking.");
    }
    const room = mockRooms.find((item) => String(item.id) === String(bookingDetails.roomId));
    if (!room) {
        throw new Error("That room could not be found.");
    }
    if (room.active === false) {
        throw new Error("That room is inactive and cannot be booked.");
    }
    const hasConflict = mockBookings.some((booking) => {
        const overlaps = new Date(bookingDetails.startTime) < new Date(booking.endTime) &&
            new Date(bookingDetails.endTime) > new Date(booking.startTime);
        const sameRoom = String(booking.roomId) === String(room.id);
        return sameRoom && booking.status !== "cancelled" && overlaps;
    });
    if (hasConflict) {
        throw new Error("This room already has a booking during that time. Choose another time.");
    }
    const newBooking = {
        id: `booking-${Date.now()}`,
        userId: currentUser.id,
        roomName: room.name,
        roomId: bookingDetails.roomId,
        location: room.location,
        title: bookingDetails.title,
        attendeeCount: bookingDetails.attendeeCount,
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
        status: "active",
    };
    mockBookings = [...mockBookings, newBooking];
    return { ...newBooking };
}
