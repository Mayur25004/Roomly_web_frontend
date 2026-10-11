// These fake accounts are development fixtures and must not ship in the final build.
import type { MockUser } from "../types/models.ts";

export const mockUsers: MockUser[] = [
  {
    id: "employee-demo",
    name: "Demo Employee",
    email: "employee@roomly.local",
    password: "Roomly123!",
    role: "employee",
  },
  {
    id: "admin-demo",
    name: "Demo Admin",
    email: "admin@roomly.local",
    password: "Admin123!",
    role: "admin",
  },
];
