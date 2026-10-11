import type { CurrentUser, UserRole } from "../types/models.ts";
import { apiRequest } from "../api/apiClient.ts";
import {
  loginWithMock,
  logoutMock,
  registerWithMock,
} from "./mockAuthService.ts";

const SESSION_USER_KEY = "roomly-session-user";
const useMockServices =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_SERVICES !== "false";

const apiSettings = {
  loginPath: import.meta.env.VITE_LOGIN_PATH?.trim(),
  registerPath: import.meta.env.VITE_REGISTER_PATH?.trim(),
  logoutPath: import.meta.env.VITE_LOGOUT_PATH?.trim(),
  currentUserPath: import.meta.env.VITE_CURRENT_USER_PATH?.trim(),
};

function requireApiPath(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} must be set after the authentication API contract is agreed.`);
  }
  return value;
}

function validateUserResponse(response: unknown): CurrentUser {
  if (!response || typeof response !== "object" || !("user" in response)) {
    throw new Error("The authentication API must return a user object.");
  }
  const user = response.user as Partial<CurrentUser> | null;
  if (
    !user ||
    typeof user.id !== "string" ||
    typeof user.email !== "string" ||
    (user.role !== "employee" && user.role !== "admin")
  ) {
    throw new Error("The authentication API must return a user with id, email, and role.");
  }
  return user as CurrentUser;
}

async function loginWithApi(email: string, password: string) {
  const path = requireApiPath("VITE_LOGIN_PATH", apiSettings.loginPath);
  const response = await apiRequest(path, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  return validateUserResponse(response);
}

async function registerWithApi(name: string, email: string, password: string) {
  const path = requireApiPath("VITE_REGISTER_PATH", apiSettings.registerPath);
  const response = await apiRequest(path, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
    credentials: "include",
  });
  return validateUserResponse(response);
}

async function logoutWithApi() {
  const path = requireApiPath("VITE_LOGOUT_PATH", apiSettings.logoutPath);
  return apiRequest(path, { method: "POST", credentials: "include" });
}

async function restoreCurrentUserFromApi() {
  const path = requireApiPath(
    "VITE_CURRENT_USER_PATH",
    apiSettings.currentUserPath,
  );
  const response = await apiRequest(path, { credentials: "include" });
  return validateUserResponse(response);
}

function saveUser(user: CurrentUser): CurrentUser {
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  return user;
}

export function getCurrentUser(): CurrentUser | null {
  try {
    const storedUser = sessionStorage.getItem(SESSION_USER_KEY);
    return storedUser ? (JSON.parse(storedUser) as CurrentUser) : null;
  } catch {
    sessionStorage.removeItem(SESSION_USER_KEY);
    return null;
  }
}

export async function login(email: string, password: string): Promise<CurrentUser> {
  const user = useMockServices
    ? await loginWithMock(email, password)
    : await loginWithApi(email, password);
  return saveUser(user);
}

export async function registerEmployee(name: string, email: string, password: string): Promise<CurrentUser> {
  const user = useMockServices
    ? await registerWithMock(name, email, password)
    : await registerWithApi(name, email, password);
  return saveUser(user);
}

export async function logout() {
  try {
    if (useMockServices) {
      await logoutMock();
    } else {
      await logoutWithApi();
    }
  } finally {
    sessionStorage.removeItem(SESSION_USER_KEY);
  }
}

export async function restoreSession(): Promise<CurrentUser | null> {
  if (useMockServices) {
    return getCurrentUser();
  }

  try {
    const user = await restoreCurrentUserFromApi();
    return saveUser(user);
  } catch (error) {
    sessionStorage.removeItem(SESSION_USER_KEY);
    throw error;
  }
}

export function clearSavedUser() {
  sessionStorage.removeItem(SESSION_USER_KEY);
}
