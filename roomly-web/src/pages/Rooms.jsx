import { useState } from "react";
import { Search, Users, MapPin, DoorOpen } from "lucide-react";

import RoomCard from "../components/RoomCard.jsx";

const rooms = [
  {
    id: 1,
    name: "Conference Room A",
    location: "Floor 1",
    capacity: 8,
    status: "Available",
  },
  {
    id: 2,
    name: "Meeting Room B",
    location: "Floor 2",
    capacity: 6,
    status: "Available",
  },
  {
    id: 3,
    name: "Board Room",
    location: "Floor 3",
    capacity: 12,
    status: "Booked",
  },
];


function Rooms() {
const [search, setSearch] = useState("");
const filteredRooms = rooms.filter((room) =>
  `${room.name} ${room.location}`
    .toLowerCase()
    .includes(search.toLowerCase())
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
        <Search size={19} className="text-slate-400" />
        <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search meeting rooms..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
      </div>
      
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredRooms.map((room) => (  
            
          <article
            key={room.id}
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                <DoorOpen size={24} />
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  room.status === "Available"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {room.status}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              {room.name}
            </h2>

            <div className="mt-4 space-y-3 text-sm text-slate-500">
              <p className="flex items-center gap-2">
                <MapPin size={17} />
                {room.location}
              </p>

              <p className="flex items-center gap-2">
                <Users size={17} />
                Capacity: {room.capacity} people
              </p>
            </div>

            <button
              type="button"
              disabled={room.status !== "Available"}
              className="mt-6 w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              {room.status === "Available" ? "Book Room" : "Unavailable"}
            </button>
          </article>
        ))}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
            ))}
        </div>
      </div>
      {filteredRooms.length === 0 && (
        <p className="text-sm text-slate-500">
            No rooms found. Try another search.
        </p>
)}
    </section>
  );
}

export default Rooms;
