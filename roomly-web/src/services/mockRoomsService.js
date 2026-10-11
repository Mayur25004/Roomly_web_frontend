import { mockRooms } from "../data/mockRooms.js";
export async function getMockRooms() {
    return mockRooms.map((room) => ({
        ...room,
        amenities: [...room.amenities],
    }));
}
