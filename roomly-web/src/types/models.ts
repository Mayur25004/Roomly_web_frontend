export type UserRole = "employee" | "admin";

export interface CurrentUser {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
}

export interface Room {
  id: string | number;
  name: string;
  location: string;
  capacity: number;
  active: boolean;
  amenities: string[];
}

export interface Booking {
  id: string;
  roomId: string | number;
  roomName: string;
  location: string;
  title: string;
  attendeeCount: number;
  startTime: string;
  endTime: string;
  status: string;
}

export interface BookingValidationInput {
  title: string;
  attendeeCount: string | number;
  meetingDate: string;
  startTime: string;
  endTime: string;
}

export interface TimeWindowInput {
  date: string;
  startTime: string;
  endTime: string;
}

export interface AvailabilityCriteria {
  startTime: string;
  endTime: string;
  minimumCapacity: number | null;
  requiredAmenities: string[];
}

export interface UtilizationDateRange {
  startDate: string;
  endDate: string;
}

export interface UtilizationRow {
  roomId: string | number;
  roomName: string;
  bookedHours: number;
  bookingCount: number;
}

export interface Amenity {
  id: string | number;
  name: string;
  description: string;
}

export interface MockUser extends CurrentUser {
  password: string;
}

export interface BookingRequest {
  roomId: string | number;
  title: string;
  attendeeCount: number;
  startTime: string;
  endTime: string;
}

export interface RoomDetails {
  id?: string | number | null;
  name: string;
  location: string;
  capacity: number;
  active: boolean;
  amenities: string[];
}

export interface AmenityDetails {
  id?: string | number | null;
  name: string;
  description: string;
}
