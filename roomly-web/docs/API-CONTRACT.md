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
