export function validateRoomDetails(room) {
    if (!room.name.trim()) {
        return "Enter a room name.";
    }
    if (!room.location.trim()) {
        return "Enter a room location.";
    }
    const capacity = Number(room.capacity);
    if (!Number.isInteger(capacity) || capacity < 1) {
        return "Capacity must be a whole number greater than zero.";
    }
    return "";
}

export function validateAmenityDetails(amenity) {
    if (!amenity.name.trim()) {
        return "Enter an amenity name.";
    }
    return "";
}
