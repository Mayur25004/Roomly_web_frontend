import type { Room } from "../types/models.ts";

export const mockRooms: Room[] = [
  {
    id: 1,
    name: "Conference Room A",
    location: "Floor 1",
    capacity: 8,
    active: true,
    amenities: ["Display", "Whiteboard", "Video conferencing"],
  },
  {
    id: 2,
    name: "Meeting Room B",
    location: "Floor 2",
    capacity: 6,
    active: true,
    amenities: ["Display", "Video conferencing"],
  },
  {
    id: 3,
    name: "Board Room",
    location: "Floor 3",
    capacity: 12,
    active: true,
    amenities: ["Whiteboard", "Conference phone", "Video conferencing"],
  },
];
