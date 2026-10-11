import { mockAmenities } from "../data/mockAmenities.js";
import { mockRooms } from "../data/mockRooms.js";
import { getMockMyBookings } from "./mockMyBookingsService.js";

function copyRoom(room) {
  return { ...room, amenities: [...room.amenities] };
}

export async function getMockAdminRooms() {
  return mockRooms.map(copyRoom);
}

export async function saveMockRoom(roomDetails) {
  const existingRoom = mockRooms.find(
    (room) => String(room.id) === String(roomDetails.id),
  );

  if (existingRoom) {
    Object.assign(existingRoom, {
      name: roomDetails.name.trim(),
      location: roomDetails.location.trim(),
      capacity: Number(roomDetails.capacity),
      active: Boolean(roomDetails.active),
      amenities: [...roomDetails.amenities],
    });
    return copyRoom(existingRoom);
  }

  const newRoom = {
    id: Math.max(0, ...mockRooms.map((room) => Number(room.id))) + 1,
    name: roomDetails.name.trim(),
    location: roomDetails.location.trim(),
    capacity: Number(roomDetails.capacity),
    active: true,
    amenities: [...roomDetails.amenities],
  };
  mockRooms.push(newRoom);
  return copyRoom(newRoom);
}

export async function getMockAdminAmenities() {
  return mockAmenities.map((amenity) => ({ ...amenity }));
}

export async function saveMockAmenity(amenityDetails) {
  const existingAmenity = mockAmenities.find(
    (amenity) => String(amenity.id) === String(amenityDetails.id),
  );
  const normalizedName = amenityDetails.name.trim();
  const duplicateName = mockAmenities.some(
    (amenity) =>
      amenity.name.toLowerCase() === normalizedName.toLowerCase() &&
      String(amenity.id) !== String(amenityDetails.id),
  );
  if (duplicateName) {
    throw new Error("An amenity with this name already exists.");
  }

  if (existingAmenity) {
    const previousName = existingAmenity.name;
    existingAmenity.name = normalizedName;
    if (previousName !== normalizedName) {
      mockRooms.forEach((room) => {
        room.amenities = room.amenities.map((roomAmenity) =>
          roomAmenity === previousName ? normalizedName : roomAmenity,
        );
      });
    }
    existingAmenity.description = amenityDetails.description.trim();
    return { ...existingAmenity };
  }

  const newAmenity = {
    id: Math.max(0, ...mockAmenities.map((amenity) => Number(amenity.id))) + 1,
    name: normalizedName,
    description: amenityDetails.description.trim(),
  };
  mockAmenities.push(newAmenity);
  return { ...newAmenity };
}

export async function getMockUtilizationReport(dateRange) {
  const start = new Date(`${dateRange.startDate}T00:00:00`);
  const end = new Date(`${dateRange.endDate}T00:00:00`);
  end.setDate(end.getDate() + 1);
  const bookings = await getMockMyBookings();

  return mockRooms.map((room) => {
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
