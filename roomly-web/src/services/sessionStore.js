const SESSION_USER_KEY = "roomly-session-user";

export function getSavedUser() {
    if (typeof sessionStorage === "undefined") {
        return null;
    }
    try {
        const storedUser = sessionStorage.getItem(SESSION_USER_KEY);
        return storedUser ? JSON.parse(storedUser) : null;
    }
    catch {
        sessionStorage.removeItem(SESSION_USER_KEY);
        return null;
    }
}

export function saveUser(user) {
    sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    return user;
}

export function clearSavedUser() {
    if (typeof sessionStorage !== "undefined") {
        sessionStorage.removeItem(SESSION_USER_KEY);
    }
}
