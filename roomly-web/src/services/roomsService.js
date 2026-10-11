import { apiRequest } from "../api/apiClient.js";
import { getMockRooms } from "./mockRoomsService.js";

const useMockServices =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_SERVICES !== "false";
const roomsPath = import.meta.env.VITE_ROOMS_PATH?.trim();

async function getRoomsFromApi() {
  if (!roomsPath) {
    throw new Error("VITE_ROOMS_PATH must be set after the rooms API contract is agreed.");
  }

  const rooms = await apiRequest(roomsPath);
  if (!Array.isArray(rooms)) {
    throw new Error("The rooms API response must be a list of rooms.");
  }

  return rooms;
}

export const roomsService = {
  getRooms: useMockServices ? getMockRooms : getRoomsFromApi,
};
