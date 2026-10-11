import { apiRequest } from "../api/apiClient.js";
import { cancelMockBooking, createMockBooking, getMockMyBookings, } from "./mockMyBookingsService.js";
const useMockServices = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_SERVICES !== "false";
const apiSettings = {
    myBookingsPath: import.meta.env.VITE_MY_BOOKINGS_PATH?.trim(),
    cancelPathTemplate: import.meta.env.VITE_CANCEL_BOOKING_PATH_TEMPLATE?.trim(),
    cancelMethod: import.meta.env.VITE_CANCEL_BOOKING_METHOD?.trim(),
    createBookingPath: import.meta.env.VITE_CREATE_BOOKING_PATH?.trim(),
};
function getRequiredApiSetting(name, setting) {
    const value = apiSettings[setting];
    if (!value) {
        throw new Error(`${name} must be set after the API contract is agreed.`);
    }
    return value;
}
async function getMyBookingsFromApi() {
    const path = getRequiredApiSetting("VITE_MY_BOOKINGS_PATH", "myBookingsPath");
    const bookings = await apiRequest(path);
    if (!Array.isArray(bookings)) {
        throw new Error("The My Bookings API response must be a list of bookings.");
    }
    return bookings;
}
async function cancelMyBookingFromApi(bookingId) {
    const pathTemplate = getRequiredApiSetting("VITE_CANCEL_BOOKING_PATH_TEMPLATE", "cancelPathTemplate");
    const method = getRequiredApiSetting("VITE_CANCEL_BOOKING_METHOD", "cancelMethod");
    if (!pathTemplate.includes("{bookingId}")) {
        throw new Error("The cancellation path must include {bookingId}.");
    }
    const path = pathTemplate.replace("{bookingId}", encodeURIComponent(bookingId));
    return apiRequest(path, { method });
}
async function createBookingWithApi(bookingDetails) {
    const path = getRequiredApiSetting("VITE_CREATE_BOOKING_PATH", "createBookingPath");
    return apiRequest(path, {
        method: "POST",
        body: JSON.stringify(bookingDetails),
    });
}
const apiBookingsService = {
    getMyBookings: getMyBookingsFromApi,
    cancelBooking: cancelMyBookingFromApi,
    createBooking: createBookingWithApi,
};
const mockBookingsService = {
    getMyBookings: getMockMyBookings,
    cancelBooking: cancelMockBooking,
    createBooking: createMockBooking,
};
export const myBookingsService = useMockServices
    ? mockBookingsService
    : apiBookingsService;
