import { getBookingsForView } from "./bookingHistory.js";

export function getProfileBookingCounts(bookings, now = new Date()) {
    return {
        total: bookings.length,
        upcoming: getBookingsForView(bookings, "upcoming", now).length,
    };
}

export function getUserInitials(user) {
    const displayName = user.name?.trim();
    if (displayName) {
        const words = displayName.split(/\s+/);
        return words.length > 1
            ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
            : words[0].slice(0, 2).toUpperCase();
    }
    return user.email?.trim().slice(0, 1).toUpperCase() || "U";
}
