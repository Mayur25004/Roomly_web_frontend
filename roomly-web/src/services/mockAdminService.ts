import type { Amenity, AmenityDetails, Room, RoomDetails, UtilizationDateRange, UtilizationRow } from "../types/models.ts";
import { mockAmenities } from "../data/mockAmenities.ts";
import { mockRooms } from "../data/mockRooms.ts";
import { getMockMyBookings } from "./mockMyBookingsService.ts";
import { calculateUtilizationRows } from "../utils/utilization.ts";

function copyRoom(room: Room): Room {
  return { ...room, amenities: [...room.amenities] };
}

export async function getMockAdminRooms(): Promise<Room[]> {
  return mockRooms.map(copyRoom);
}

export async function saveMockRoom(roomDetails: RoomDetails): Promise<Room> {
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

export async function getMockAdminAmenities(): Promise<Amenity[]> {
  return mockAmenities.map((amenity) => ({ ...amenity }));
}

export async function saveMockAmenity(amenityDetails: AmenityDetails): Promise<Amenity> {
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
        room.amenities = room.amenities.map((roomAmenity: string) =>
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

export async function getMockUtilizationReport(dateRange: UtilizationDateRange): Promise<UtilizationRow[]> {
  const bookings = await getMockMyBookings();
  return calculateUtilizationRows(mockRooms, bookings, dateRange);
}
