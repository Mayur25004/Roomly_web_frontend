import type { Room } from "../types/models.ts";
import { apiRequest } from "../api/apiClient.ts";
import { getMockRooms } from "./mockRoomsService.ts";

const useMockServices =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_SERVICES !== "false";
const roomsPath = import.meta.env.VITE_ROOMS_PATH?.trim();

async function getRoomsFromApi(): Promise<Room[]> {
  if (!roomsPath) {
    throw new Error("VITE_ROOMS_PATH must be set after the rooms API contract is agreed.");
  }

  const rooms = await apiRequest(roomsPath);
  if (!Array.isArray(rooms)) {
    throw new Error("The rooms API response must be a list of rooms.");
  }

  return rooms as Room[];
}

export const roomsService = {
  getRooms: useMockServices ? getMockRooms : getRoomsFromApi,
};
