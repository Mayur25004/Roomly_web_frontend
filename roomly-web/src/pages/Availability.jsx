import { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard.jsx";
import { roomsService } from "../services/roomsService.ts";
import { roomPlanningService } from "../services/roomPlanningService.ts";
import {
  combineLocalDateAndTime,
  getLocalDateString,
} from "../utils/dateTime.ts";
import { validateTimeWindow } from "../utils/bookingValidation.ts";

function Availability() {
  const [meetingDate, setMeetingDate] = useState(getLocalDateString());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [minimumCapacity, setMinimumCapacity] = useState("");
  const [availableAmenities, setAvailableAmenities] = useState([]);
  const [requiredAmenities, setRequiredAmenities] = useState([]);
  const [amenityLoadMessage, setAmenityLoadMessage] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadAmenities() {
      try {
        const rooms = await roomsService.getRooms();
        const amenities = [...new Set(rooms.flatMap((room) => room.amenities || []))];
        setAvailableAmenities(amenities.sort());
      } catch {
        setAmenityLoadMessage("Room amenities could not be loaded.");
      }
    }

    loadAmenities();
  }, []);

  function toggleAmenity(amenity) {
    setRequiredAmenities((currentAmenities) => {
      if (currentAmenities.includes(amenity)) {
        return currentAmenities.filter((item) => item !== amenity);
      }
      return [...currentAmenities, amenity];
    });
  }

  function validateSearch() {
    const timeError = validateTimeWindow({
      date: meetingDate,
      startTime,
      endTime,
    });
    if (timeError) {
      return timeError.replace("booking", "search").replace("Bookings", "Search");
    }

    if (minimumCapacity && (!Number.isInteger(Number(minimumCapacity)) || Number(minimumCapacity) < 1)) {
      return "Minimum capacity must be a whole number greater than zero.";
    }

    return "";
  }

  async function handleSearch(event) {
    event.preventDefault();
    setErrorMessage("");
    setHasSearched(false);

    const validationMessage = validateSearch();
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    const start = combineLocalDateAndTime(meetingDate, startTime);
    const end = combineLocalDateAndTime(meetingDate, endTime);
    setIsLoading(true);

    try {
      const rooms = await roomPlanningService.searchAvailability({
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        minimumCapacity: minimumCapacity ? Number(minimumCapacity) : null,
        requiredAmenities,
      });
      setResults(rooms);
      setHasSearched(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not search availability. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Find an Available Room
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Choose a time window and room requirements to find rooms that are free for the whole meeting.
        </p>
      </header>

      <form
        onSubmit={handleSearch}
        noValidate
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        {errorMessage && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="availability-date" className="block text-sm font-semibold text-slate-700">
              Date
            </label>
            <input
              id="availability-date"
              type="date"
              value={meetingDate}
              onChange={(event) => setMeetingDate(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="availability-start" className="block text-sm font-semibold text-slate-700">
              Start time
            </label>
            <input
              id="availability-start"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="availability-end" className="block text-sm font-semibold text-slate-700">
              End time
            </label>
            <input
              id="availability-end"
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-[minmax(0,220px)_1fr]">
          <div className="space-y-2">
            <label htmlFor="minimum-capacity" className="block text-sm font-semibold text-slate-700">
              Minimum capacity (optional)
            </label>
            <input
              id="minimum-capacity"
              type="number"
              min="1"
              step="1"
              value={minimumCapacity}
              onChange={(event) => setMinimumCapacity(event.target.value)}
              placeholder="Any capacity"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-slate-700">
              Required amenities (optional)
            </legend>
            {amenityLoadMessage ? (
              <p className="text-sm text-amber-700">{amenityLoadMessage}</p>
            ) : availableAmenities.length === 0 ? (
              <p className="text-sm text-slate-500">No amenity filters are available.</p>
            ) : (
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="inline-flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={requiredAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="size-4 accent-violet-600"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        </div>

        <p className="text-xs text-slate-500">
          The time window must be at least 15 minutes and no longer than 4 hours. Times are sent to the API in UTC.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700 disabled:cursor-wait disabled:opacity-60"
        >
          {isLoading ? "Searching..." : "Search availability"}
        </button>
      </form>

      {isLoading && (
        <p role="status" className="text-sm text-slate-500">
          Checking room availability...
        </p>
      )}

      {hasSearched && !isLoading && results.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No rooms are available for the full time window. Try changing the time or requirements.
        </p>
      )}

      {hasSearched && results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {results.length} {results.length === 1 ? "room" : "rooms"} available
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {results.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default Availability;
