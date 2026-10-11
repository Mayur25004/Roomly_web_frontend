import { apiRequest } from "../api/apiClient.js";
import {
  loginWithMock,
  logoutMock,
  registerWithMock,
} from "./mockAuthService.js";

const SESSION_USER_KEY = "roomly-session-user";
const useMockServices =
  import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_SERVICES !== "false";

const apiSettings = {
  loginPath: import.meta.env.VITE_LOGIN_PATH?.trim(),
  registerPath: import.meta.env.VITE_REGISTER_PATH?.trim(),
  logoutPath: import.meta.env.VITE_LOGOUT_PATH?.trim(),
  currentUserPath: import.meta.env.VITE_CURRENT_USER_PATH?.trim(),
};

function requireApiPath(name, value) {
  if (!value) {
    throw new Error(`${name} must be set after the authentication API contract is agreed.`);
  }
  return value;
}

function validateUserResponse(response) {
  const user = response?.user;
  if (!user || !user.id || !user.email || !["employee", "admin"].includes(user.role)) {
    throw new Error("The authentication API must return a user with id, email, and role.");
  }
  return user;
}

async function loginWithApi(email, password) {
  const path = requireApiPath("VITE_LOGIN_PATH", apiSettings.loginPath);
  const response = await apiRequest(path, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  return validateUserResponse(response);
}

async function registerWithApi(name, email, password) {
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

function saveUser(user) {
  sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  return user;
}

export function getCurrentUser() {
  try {
    const storedUser = sessionStorage.getItem(SESSION_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    sessionStorage.removeItem(SESSION_USER_KEY);
    return null;
  }
}

export async function login(email, password) {
  const user = useMockServices
    ? await loginWithMock(email, password)
    : await loginWithApi(email, password);
  return saveUser(user);
}

export async function registerEmployee(name, email, password) {
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

export async function restoreSession() {
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
