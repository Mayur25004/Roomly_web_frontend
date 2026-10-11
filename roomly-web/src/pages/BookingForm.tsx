import type { Room } from "../types/models.ts";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import { mockRooms } from "../data/mockRooms.ts";
import { myBookingsService } from "../services/myBookingsService.ts";
import { combineLocalDateAndTime } from "../utils/dateTime.ts";
import { validateBookingInput } from "../utils/bookingValidation.ts";

function BookingForm() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const room: Room | undefined = mockRooms.find((item) => String(item.id) === roomId);
  const [title, setTitle] = useState("");
  const [attendeeCount, setAttendeeCount] = useState("1");
  const [meetingDate, setMeetingDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!room) {
      setErrorMessage("This room could not be found. Return to Browse Rooms and choose a room again.");
      return;
    }

    const validationMessage = validateBookingInput(
      { title, attendeeCount, meetingDate, startTime, endTime },
      room.capacity,
    );
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      await myBookingsService.createBooking({
        roomId: room.id,
        title: title.trim(),
        attendeeCount: Number(attendeeCount),
        startTime: combineLocalDateAndTime(meetingDate, startTime).toISOString(),
        endTime: combineLocalDateAndTime(meetingDate, endTime).toISOString(),
      });
      navigate("/my-bookings", { state: { bookingCreated: true } });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not create the booking. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!room) {
    return (
      <section className="space-y-5">
        <h1 className="text-3xl font-bold text-slate-900">Room not found</h1>
        <p className="text-sm text-slate-600">
          Choose a room from the browse page to start a booking.
        </p>
        <Link to="/rooms" className="font-semibold text-violet-700 underline">
          Browse rooms
        </Link>
      </section>
    );
  }

  if (room.active === false) {
    return (
      <section className="space-y-5">
        <h1 className="text-3xl font-bold text-slate-900">Room unavailable</h1>
        <p className="text-sm text-slate-600">
          {room.name} is currently unavailable for booking.
        </p>
        <Link to="/rooms" className="font-semibold text-violet-700 underline">
          Choose another room
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-7">
      <Link
        to="/rooms"
        className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 hover:text-violet-900"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back to rooms
      </Link>

      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Book {room.name}
        </h1>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <MapPin size={17} aria-hidden="true" /> {room.location}
          </span>
          <span className="flex items-center gap-2">
            <Users size={17} aria-hidden="true" /> Capacity: {room.capacity}
          </span>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        {errorMessage && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <div className="space-y-2">
          <label htmlFor="booking-title" className="block text-sm font-semibold text-slate-700">
            Meeting title
          </label>
          <input
            id="booking-title"
            type="text"
            maxLength={100}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
            placeholder="For example, Product planning"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="attendee-count" className="block text-sm font-semibold text-slate-700">
            Number of attendees
          </label>
          <input
            id="attendee-count"
            type="number"
            min="1"
            max={room.capacity}
            step="1"
            value={attendeeCount}
            onChange={(event) => setAttendeeCount(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
          <p className="text-xs text-slate-500">This room holds up to {room.capacity} people.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="meeting-date" className="block text-sm font-semibold text-slate-700">
            Meeting date
          </label>
          <input
            id="meeting-date"
            type="date"
            value={meetingDate}
            onChange={(event) => setMeetingDate(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="start-time" className="block text-sm font-semibold text-slate-700">
              Start time
            </label>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="end-time" className="block text-sm font-semibold text-slate-700">
              End time
            </label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Bookings must be between 15 minutes to 4 hours.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Creating booking..." : "Confirm booking"}
        </button>
      </form>
    </section>
  );
}

export default BookingForm;
