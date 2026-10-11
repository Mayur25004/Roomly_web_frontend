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
    roomName: "Conference Room A",
    location: "Floor 1",
    title: "Product planning",
    attendeeCount: 7,
    startTime: dateFromToday(2, 10, 0),
    endTime: dateFromToday(2, 11, 0),
    status: "active",
  },
  {
    id: "booking-102",
    roomName: "Meeting Room B",
    location: "Floor 2",
    title: "Sprint review",
    attendeeCount: 5,
    startTime: dateFromToday(5, 14, 0),
    endTime: dateFromToday(5, 15, 0),
    status: "active",
  },
  {
    id: "booking-103",
    roomName: "Board Room",
    location: "Floor 3",
    title: "Quarterly review",
    attendeeCount: 10,
    startTime: dateFromToday(7, 9, 30),
    endTime: dateFromToday(7, 10, 30),
    status: "cancelled",
  },
  {
    id: "booking-104",
    roomName: "Conference Room A",
    location: "Floor 1",
    title: "Project kickoff",
    attendeeCount: 6,
    startTime: dateFromToday(-4, 11, 0),
    endTime: dateFromToday(-4, 12, 0),
    status: "active",
  },
];

export async function getMockMyBookings() {
  return mockBookings.map((booking) => ({ ...booking }));
}

export async function cancelMockBooking(bookingId) {
  const booking = mockBookings.find((item) => item.id === bookingId);

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
