export function findAvailableRooms(rooms, bookings, criteria) {
    const requestedStart = new Date(criteria.startTime);
    const requestedEnd = new Date(criteria.endTime);
    return rooms.filter((room) => {
        if (!room.active) {
            return false;
        }
        if (criteria.minimumCapacity && room.capacity < criteria.minimumCapacity) {
            return false;
        }
        const hasAmenities = criteria.requiredAmenities.every((amenity) => room.amenities.includes(amenity));
        if (!hasAmenities) {
            return false;
        }
        const hasConflict = bookings.some((booking) => {
            const sameRoom = String(booking.roomId) === String(room.id);
            const isActive = booking.status !== "cancelled";
            const overlaps = requestedStart < new Date(booking.endTime) &&
                requestedEnd > new Date(booking.startTime);
            return sameRoom && isActive && overlaps;
        });
        return !hasConflict;
    });
}
