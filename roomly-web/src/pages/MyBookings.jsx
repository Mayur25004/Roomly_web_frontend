import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";
import { ApiError } from "../api/apiClient.js";
import { myBookingsService } from "../services/myBookingsService.js";

function formatDate(dateTime) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(dateTime));
}

function formatTime(dateTime) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateTime));
}

function getErrorMessage(error) {
  if (error instanceof ApiError || error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedView, setSelectedView] = useState("upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [loadErrorMessage, setLoadErrorMessage] = useState("");
  const [actionErrorMessage, setActionErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    setLoadErrorMessage("");

    try {
      const results = await myBookingsService.getMyBookings();
      setBookings(results);
    } catch (error) {
      setLoadErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function handleCancel(bookingId) {
    setCancellingId(bookingId);
    setActionErrorMessage("");
    setStatusMessage("");

    try {
      await myBookingsService.cancelBooking(bookingId);
      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking,
        ),
      );
      setStatusMessage("Booking cancelled. It remains in your booking history.");
    } catch (error) {
      setActionErrorMessage(getErrorMessage(error));
    } finally {
      setCancellingId(null);
    }
  }

  const now = new Date();
  const visibleBookings = bookings
    .filter((booking) => {
      const startsInFuture = new Date(booking.startTime) >= now;
      return selectedView === "upcoming" ? startsInFuture : !startsInFuture;
    })
    .sort((first, second) =>
      selectedView === "upcoming"
        ? new Date(first.startTime) - new Date(second.startTime)
        : new Date(second.startTime) - new Date(first.startTime),
    );

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Review your room bookings and manage upcoming meetings.
        </p>
      </header>

      <div className="flex gap-2" role="group" aria-label="Filter bookings">
        <button
          type="button"
          aria-pressed={selectedView === "upcoming"}
          onClick={() => setSelectedView("upcoming")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${
            selectedView === "upcoming"
              ? "bg-violet-100 text-violet-700"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Upcoming
        </button>
        <button
          type="button"
          aria-pressed={selectedView === "past"}
          onClick={() => setSelectedView("past")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 ${
            selectedView === "past"
              ? "bg-violet-100 text-violet-700"
              : "bg-white text-slate-600 hover:bg-slate-100"
          }`}
        >
          Past
        </button>
      </div>

      {statusMessage && (
        <p role="status" className="text-sm text-emerald-700">
          {statusMessage}
        </p>
      )}

      {loadErrorMessage && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <p>{loadErrorMessage}</p>
          <button
            type="button"
            onClick={loadBookings}
            className="mt-2 font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Try again
          </button>
        </div>
      )}

      {actionErrorMessage && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {actionErrorMessage}
        </p>
      )}

      {isLoading ? (
        <p role="status" className="text-sm text-slate-500">
          Loading your bookings...
        </p>
      ) : loadErrorMessage ? null : visibleBookings.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
          {selectedView === "upcoming"
            ? "You have no upcoming bookings."
            : "You have no past bookings."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {visibleBookings.map((booking) => {
            const isCancelled = booking.status === "cancelled";
            const statusLabel = isCancelled
              ? "Cancelled"
              : selectedView === "past"
                ? "Completed"
                : "Confirmed";
            const canCancel =
              selectedView === "upcoming" && !isCancelled;

            return (
              <article
                key={booking.id}
                className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-violet-700">
                      {booking.roomName}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      {booking.title}
                    </h2>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isCancelled
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <dl className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={17} aria-hidden="true" />
                    <dt className="sr-only">Date</dt>
                    <dd>{formatDate(booking.startTime)}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 size={17} aria-hidden="true" />
                    <dt className="sr-only">Time</dt>
                    <dd>
                      {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={17} aria-hidden="true" />
                    <dt className="sr-only">Attendees</dt>
                    <dd>{booking.attendeeCount} attendees</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={17} aria-hidden="true" />
                    <dt className="sr-only">Room</dt>
                    <dd>{booking.location}</dd>
                  </div>
                </dl>

                {canCancel && (
                  <button
                    type="button"
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancellingId === booking.id}
                    className="mt-6 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-wait disabled:opacity-60"
                  >
                    {cancellingId === booking.id ? "Cancelling..." : "Cancel booking"}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyBookings;
