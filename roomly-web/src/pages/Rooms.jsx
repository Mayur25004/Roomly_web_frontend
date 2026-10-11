import { useState } from "react";
import { Search } from "lucide-react";
import RoomCard from "../components/RoomCard.jsx";
import { mockRooms } from "../data/mockRooms.js";

function Rooms() {
  const [search, setSearch] = useState("");
  const filteredRooms = mockRooms.filter((room) =>
    `${room.name} ${room.location}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

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

      <div className="flex max-w-lg items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
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

      {filteredRooms.length === 0 ? (
        <p className="text-sm text-slate-500">
          No rooms found. Try another search.
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
