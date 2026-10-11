# Roomly Web

Roomly is a meeting-room booking frontend built with React and JSX. The interface supports employee sign-in, room browsing, availability search, booking creation and history, room schedules, and admin room, amenity, and utilization screens.

## Run locally

1. Install the locked dependencies:

   ```sh
   npm ci
   ```

2. Copy the environment template:

   ```sh
   cp .env.example .env
   ```

3. Start Vite:

   ```sh
   npm run dev
   ```

For local mock accounts, expand **Development demo accounts** on the login page. Mock accounts, room and amenity edits, and bookings are temporary in-memory data; reloading the app resets those changes.

## Check the project

Run the unit tests and production build with:

```sh
npm test
npm run build
```

The tests cover booking rules and history, availability conflicts, mock account ownership, admin form validation, utilization calculations, and API error messages.

## Project structure

- `src/pages/` contains the route-level employee and admin screens.
- `src/layouts/` contains the shared page layout; the sidebar occupies its own sticky column beside the page content.
- `src/components/` contains reusable pieces such as room cards and protected-route handling.
- `src/services/` selects mock or API-backed room, booking, authentication, and admin operations.
- `src/data/` contains temporary development fixtures.
- `src/api/` centralizes HTTP requests and response errors.
- `src/utils/` contains booking validation, date formatting, availability rules, booking history, and utilization calculations.
- `docs/API-CONTRACT.md` records the frontend’s proposed API shapes and the decisions still needing agreement.

## Employee profile page

The signed-in user can open **Profile** from the sidebar. The page shows the name, email, and role already held by the application session. The round avatar displays initials made from the user's name; when the name is unavailable, it uses the first letter of the email. It is an initials avatar, not a profile photo, because the current account model has no photo field.

The booking summary loads the current user's bookings through `myBookingsService.getMyBookings()`. **Total bookings** counts every booking returned by that service, including cancelled and past bookings. **Upcoming bookings** uses the same `getBookingsForView()` rule as My Bookings: it excludes cancelled bookings and bookings whose end time has passed, while including a booking that is currently in progress.

Important files:

- `src/pages/Profile.jsx` is the page component. It receives `currentUser` as a prop, loads bookings when the page opens, and displays loading and error states. **Try again** repeats the request after a failure.
- `src/utils/profileSummary.js` contains the count and avatar-initial calculations, separate from the visual page so they can be tested independently.
- `src/utils/profileSummary.test.js` checks those calculations with fixed example data and a fixed date.
- `src/App.jsx` registers the protected `/profile` route, `src/components/Sidebar.jsx` adds the navigation link, and `src/layouts/MainLayout.jsx` sets the browser tab title.

React concepts used here: `useState` stores the booking results and loading/error messages; `useEffect` starts the load when the page mounts; `useCallback` keeps the retry function stable for the effect dependency. The page does not make its own `fetch()` call: it uses the same booking service as the rest of the app, so it can use mock data during development and the API service when the backend contract is configured.

## Mock services and API integration

Vite development uses mock services by default. Set `VITE_USE_MOCK_SERVICES=false` in the local `.env` file to select the API services during development. Production builds use the API services; they do not use mock data.

The Go backend contract has not yet been agreed. Until it is, API routes and payloads remain proposals, and the blank route settings in `.env.example` should stay blank. Agree on authentication, endpoint paths, response shapes, error status codes, pagination, request IDs, and UTC timestamp formats with the backend developer before configuring those values. The frontend API client uses `VITE_API_BASE_URL`, includes credentials for session cookies, and surfaces `X-Request-ID` in API errors when provided.

Booking validation in the browser helps people correct mistakes, while the backend must make the final decisions about booking duration, capacity, availability, conflicts, and authorization. Real API integration has not been verified because the backend contract and endpoints are not available yet.

Before final submission, replace the development mock services with verified API implementations and remove the temporary mock records and mock accounts.
