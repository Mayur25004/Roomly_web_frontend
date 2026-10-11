import { mockRooms } from "../data/mockRooms.ts";

import type { Room } from "../types/models.ts";

export async function getMockRooms(): Promise<Room[]> {
  return mockRooms.map((room) => ({
    ...room,
    amenities: [...room.amenities],
  }));
}
