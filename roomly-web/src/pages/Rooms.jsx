import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import RoomCard from "../components/RoomCard.jsx";
import { roomsService } from "../services/roomsService.ts";

const PAGE_SIZE = 6;

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minimumCapacity, setMinimumCapacity] = useState("");
  const [sortOrder, setSortOrder] = useState("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadRooms = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const results = await roomsService.getRooms();
      setRooms(results);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not load rooms. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  const locations = [...new Set(rooms.map((room) => room.location))].sort();
  const amenities = [
    ...new Set(rooms.flatMap((room) => room.amenities || [])),
  ].sort();

  const filteredRooms = rooms
    .filter((room) => {
      const matchesSearch = `${room.name} ${room.location}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesAmenity =
        !selectedAmenity || (room.amenities || []).includes(selectedAmenity);
      const matchesLocation =
        !selectedLocation || room.location === selectedLocation;
      const matchesCapacity =
        !minimumCapacity || room.capacity >= Number(minimumCapacity);

      return matchesSearch && matchesAmenity && matchesLocation && matchesCapacity;
    })
    .sort((first, second) => {
      if (sortOrder === "capacity-asc") {
        return first.capacity - second.capacity;
      }
      if (sortOrder === "capacity-desc") {
        return second.capacity - first.capacity;
      }
      return first.name.localeCompare(second.name);
    });

  const pageCount = Math.ceil(filteredRooms.length / PAGE_SIZE);
  const pageRooms = filteredRooms.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function resetPage(updateFilter) {
    updateFilter();
    setCurrentPage(1);
  }

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Browse Rooms
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Find and book the perfect space for your next meeting.
        </p>
      </header>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-3">
        <div className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
          <Search size={19} className="shrink-0 text-slate-400" aria-hidden="true" />
          <label className="sr-only" htmlFor="room-search">
            Search by room name or floor
          </label>
          <input
            id="room-search"
            type="search"
            value={search}
            onChange={(event) => resetPage(() => setSearch(event.target.value))}
            placeholder="Search rooms..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="amenity-filter" className="text-xs font-semibold text-slate-600">
            Amenity
          </label>
          <select
            id="amenity-filter"
            value={selectedAmenity}
            onChange={(event) =>
              resetPage(() => setSelectedAmenity(event.target.value))
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
          >
            <option value="">All amenities</option>
            {amenities.map((amenity) => (
              <option key={amenity} value={amenity}>
                {amenity}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="location-filter" className="text-xs font-semibold text-slate-600">
            Location
          </label>
          <select
            id="location-filter"
            value={selectedLocation}
            onChange={(event) =>
              resetPage(() => setSelectedLocation(event.target.value))
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
          >
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="minimum-capacity" className="text-xs font-semibold text-slate-600">
            Minimum capacity
          </label>
          <input
            id="minimum-capacity"
            type="number"
            min="1"
            step="1"
            value={minimumCapacity}
            onChange={(event) =>
              resetPage(() => setMinimumCapacity(event.target.value))
            }
            placeholder="Any capacity"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="room-sort" className="text-xs font-semibold text-slate-600">
            Sort rooms
          </label>
          <select
            id="room-sort"
            value={sortOrder}
            onChange={(event) => {
              setSortOrder(event.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
          >
            <option value="name">Name A to Z</option>
            <option value="capacity-asc">Capacity: smallest first</option>
            <option value="capacity-desc">Capacity: largest first</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <p role="status" className="text-sm text-slate-500">
          Loading rooms...
        </p>
      ) : errorMessage ? (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          <p>{errorMessage}</p>
          <button
            type="button"
            onClick={loadRooms}
            className="mt-2 font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Try again
          </button>
        </div>
      ) : filteredRooms.length === 0 ? (
        <p className="text-sm text-slate-500">
          No rooms match those filters. Try changing your search or filters.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pageRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          {pageCount > 1 && (
            <nav
              aria-label="Room pages"
              className="flex items-center justify-center gap-4"
            >
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <p aria-live="polite" className="text-sm text-slate-600">
                Page {currentPage} of {pageCount}
              </p>
              <button
                type="button"
                disabled={currentPage === pageCount}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
}

export default Rooms;
