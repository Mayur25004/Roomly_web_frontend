export function getBookingsForView(bookings, view, now = new Date()) {
    return bookings
        .filter((booking) => {
        const isCancelled = booking.status === "cancelled";
        const hasEnded = new Date(booking.endTime) <= now;
        if (view === "upcoming") {
            return !hasEnded && !isCancelled;
        }
        return hasEnded || isCancelled;
    })
        .sort((first, second) => {
        const firstStart = new Date(first.startTime).getTime();
        const secondStart = new Date(second.startTime).getTime();
        return view === "upcoming"
            ? firstStart - secondStart
            : secondStart - firstStart;
    });
}

export function getBookingStatusLabel(booking, now = new Date()) {
    if (booking.status === "cancelled") {
        return "Cancelled";
    }
    if (new Date(booking.endTime) <= now) {
        return "Completed";
    }
    if (new Date(booking.startTime) <= now) {
        return "In progress";
    }
    return "Confirmed";
}
