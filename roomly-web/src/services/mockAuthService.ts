import type { CurrentUser, MockUser } from "../types/models.ts";
import { mockUsers } from "../data/mockUsers.ts";

let registeredUsers: MockUser[] = [...mockUsers];

function toSafeUser(user: MockUser): CurrentUser {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function loginWithMock(email: string, password: string): Promise<CurrentUser> {
  const user = registeredUsers.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.password === password,
  );

  if (!user) {
    throw new Error("Email or password is incorrect.");
  }

  return toSafeUser(user);
}

export async function registerWithMock(name: string, email: string, password: string): Promise<CurrentUser> {
  const normalizedEmail = email.trim().toLowerCase();
  const alreadyRegistered = registeredUsers.some(
    (user) => user.email.toLowerCase() === normalizedEmail,
  );

  if (alreadyRegistered) {
    throw new Error("An account with this email already exists.");
  }

  const newUser = {
    id: `employee-${Date.now()}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: "employee" as const,
  };
  registeredUsers = [...registeredUsers, newUser];
  return toSafeUser(newUser);
}

export async function logoutMock() {
  return true;
}
