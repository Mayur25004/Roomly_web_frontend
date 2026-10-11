export function validateEmployeeRegistration(registration) {
    if (!registration.name.trim()) {
        return "Enter your name.";
    }
    if (!registration.email.trim()) {
        return "Enter your email address.";
    }
    if (registration.password.length < 8) {
        return "Use a password with at least 8 characters.";
    }
    return "";
}
