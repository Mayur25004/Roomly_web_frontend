# Roomly API Contract

**Status: Draft — pending agreement with the Go backend developer.**

This document records the contract decisions the frontend needs before it calls real endpoints. Endpoint paths, HTTP methods, and JSON payloads are intentionally left open until both sides agree.

## Decisions to agree

- API base URL and versioning approach.
- Registration, login, logout, and current-user/session retrieval.
- Authentication mechanism, session persistence, and expired-session behavior.
- Employee and admin role representation, plus unauthorized response behavior.
- Room listing, filters, sorting, pagination, creation, updates, and deactivation.
- Amenity listing and management.
- Room availability search and room day schedules.
- Booking creation, listing, cancellation, and conflict handling.
- Admin utilization reports and date-range parameters.
- Request and response JSON shapes for each operation.
- Error response format and HTTP status codes, including validation errors.
- Pagination metadata and UTC date-time representation.
- `X-Request-ID` response-header behavior and propagation.

## Domain fields from the assessment

These are frontend concepts derived from the assessment and ER diagram, not an API schema:

- User: identity, email, role, active status.
- Room: name, capacity, location, active status, amenities.
- Booking: room, employee, title, attendee count, start/end time, status.
- Amenity: name and description.
- Utilization report: room, booked hours, booking count, selected date range.

## Frontend configuration

Set `VITE_API_BASE_URL` in a local `.env` file. Use `.env.example` as a placeholder only; do not commit a real `.env` file or credentials.


## My Bookings page draft shape

The frontend page expects a booking list with `id`, `roomName`, `location`, `title`, `attendeeCount`, `startTime`, `endTime`, and `status`. Cancellation needs the agreed path template (with `{bookingId}`), HTTP method, and successful response behavior. These are proposed frontend needs; confirm the real response and cancellation contract with the backend developer before integration.

For local development, `VITE_USE_MOCK_SERVICES` selects the isolated mock service. The mock is enabled by default in Vite development and is never selected in a production build. Setting it to `false` selects the API service. Populate `VITE_MY_BOOKINGS_PATH`, `VITE_CANCEL_BOOKING_PATH_TEMPLATE`, and `VITE_CANCEL_BOOKING_METHOD` only after the corresponding contract has been agreed.


## Booking creation draft shape

**Status: Proposed — confirm with the Go backend developer before real API integration.**

The booking form currently sends a `POST` request to the path configured by `VITE_CREATE_BOOKING_PATH`. Its proposed JSON body is:

- `roomId`: selected room identifier.
- `title`: meeting title.
- `attendeeCount`: number of attendees.
- `startTime` and `endTime`: ISO 8601 UTC timestamps.

The backend must remain the final authority for duration, capacity, availability, and booking conflicts. Confirm the endpoint path, field names, response body, and validation/conflict error format with the backend developer before configuring this API path.


## Room listing draft

**Status: Proposed — confirm with the Go backend developer before real API integration.**

The Browse Rooms page can load a list from the path configured by `VITE_ROOMS_PATH`. Each proposed room includes `id`, `name`, `location`, `capacity`, boolean `active`, and an `amenities` list. Until pagination and filter query parameters are agreed, the frontend applies the room filters and six-item pagination to the returned list. Confirm whether the backend will return a complete list or server-paginated results before enabling this API service in production.


## Availability and room schedule draft

**Status: Proposed — confirm with the Go backend developer before real API integration.**

- Availability search uses `VITE_ROOM_AVAILABILITY_PATH` with `startTime` and `endTime` as UTC ISO 8601 query values. Optional `minimumCapacity` and repeated `amenities` query values are also sent. The response is proposed to be a list of rooms available for the entire window.
- A daily room schedule uses `VITE_ROOM_SCHEDULE_PATH_TEMPLATE` with `{roomId}` and a `date` query value (`YYYY-MM-DD`). The response is proposed to be a list of bookings with room, title, attendee count, start/end time, and status.

Confirm the actual route, query names, response envelope, and whether cancelled bookings appear in schedules before setting these environment variables. In mock mode, cancelled bookings are shown in a day schedule but do not block an availability search.
