import { mockUsers } from "../data/mockUsers.js";

let registeredUsers = [...mockUsers];

function toSafeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function loginWithMock(email, password) {
  const user = registeredUsers.find(
    (item) => item.email.toLowerCase() === email.trim().toLowerCase() &&
      item.password === password,
  );

  if (!user) {
    throw new Error("Email or password is incorrect.");
  }

  return toSafeUser(user);
}

export async function registerWithMock(name, email, password) {
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
    role: "employee",
  };
  registeredUsers = [...registeredUsers, newUser];
  return toSafeUser(newUser);
}

export async function logoutMock() {
  return true;
}
