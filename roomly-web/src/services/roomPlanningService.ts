import type { AvailabilityCriteria, Booking, Room } from "../types/models.ts";
import { apiRequest } from "../api/apiClient.ts";
import {
  getMockRoomSchedule,
  searchMockAvailability,
} from "./mockRoomPlanningService.ts";

const useMockServices =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_SERVICES !== "false";
const availabilityPath = import.meta.env.VITE_ROOM_AVAILABILITY_PATH?.trim();
const schedulePathTemplate = import.meta.env.VITE_ROOM_SCHEDULE_PATH_TEMPLATE?.trim();

function getRequiredPath(name: string, path: string | undefined): string {
  if (!path) {
    throw new Error(`${name} must be set after the room planning API contract is agreed.`);
  }
  return path;
}

async function searchAvailabilityFromApi(criteria: AvailabilityCriteria): Promise<Room[]> {
  const path = getRequiredPath(
    "VITE_ROOM_AVAILABILITY_PATH",
    availabilityPath,
  );
  const query = new URLSearchParams({
    startTime: criteria.startTime,
    endTime: criteria.endTime,
  });

  if (criteria.minimumCapacity) {
    query.set("minimumCapacity", String(criteria.minimumCapacity));
  }
  criteria.requiredAmenities.forEach((amenity) => {
    query.append("amenities", amenity);
  });

  const rooms = await apiRequest(`${path}?${query.toString()}`);
  if (!Array.isArray(rooms)) {
    throw new Error("The availability API response must be a list of rooms.");
  }
  return rooms as Room[];
}

async function getRoomScheduleFromApi(roomId: string | number, date: string): Promise<Booking[]> {
  const template = getRequiredPath(
    "VITE_ROOM_SCHEDULE_PATH_TEMPLATE",
    schedulePathTemplate,
  );
  if (!template.includes("{roomId}")) {
    throw new Error("The room schedule path must include {roomId}.");
  }

  const path = template.replace("{roomId}", encodeURIComponent(roomId));
  const bookings = await apiRequest(
    `${path}?${new URLSearchParams({ date }).toString()}`,
  );
  if (!Array.isArray(bookings)) {
    throw new Error("The room schedule API response must be a list of bookings.");
  }
  return bookings as Booking[];
}

export const roomPlanningService = useMockServices
  ? {
      searchAvailability: searchMockAvailability,
      getRoomSchedule: getMockRoomSchedule,
    }
  : {
      searchAvailability: searchAvailabilityFromApi,
      getRoomSchedule: getRoomScheduleFromApi,
    };
