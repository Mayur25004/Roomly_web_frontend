import { useState } from "react";
import { Search } from "lucide-react";
import RoomCard from "../components/RoomCard.jsx";
import { mockRooms } from "../data/mockRooms.js";

const amenities = [...new Set(mockRooms.flatMap((room) => room.amenities))].sort();

function Rooms() {
  const [search, setSearch] = useState("");
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const filteredRooms = mockRooms.filter((room) => {
    const matchesSearch = `${room.name} ${room.location}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesAmenity =
      !selectedAmenity || room.amenities.includes(selectedAmenity);

    return matchesSearch && matchesAmenity;
  });

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

      <div className="flex max-w-3xl flex-col gap-4 sm:flex-row">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Search size={19} className="text-slate-400" aria-hidden="true" />
          <label className="sr-only" htmlFor="room-search">
            Search by room name or floor
          </label>
          <input
            id="room-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search meeting rooms..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-col gap-2 sm:w-60">
          <label
            htmlFor="amenity-filter"
            className="text-sm font-semibold text-slate-700"
          >
            Filter by amenity
          </label>
          <select
            id="amenity-filter"
            value={selectedAmenity}
            onChange={(event) => setSelectedAmenity(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 shadow-sm focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-100"
          >
            <option value="">All amenities</option>
            {amenities.map((amenity) => (
              <option key={amenity} value={amenity}>
                {amenity}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredRooms.length === 0 ? (
        <p className="text-sm text-slate-500">
          No rooms match those filters. Try a different search or amenity.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Rooms;
