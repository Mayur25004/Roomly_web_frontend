import { Users, MapPin, DoorOpen } from "lucide-react";

function RoomCard({ room }) {
  const available = room.status === "Available";

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex size-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <DoorOpen size={24} />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            available
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

      <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <MapPin size={17} />
        {room.location}
      </p>

      <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
        <Users size={17} />
        Capacity: {room.capacity} people
      </p>

      <button
        type="button"
        disabled={!available}
        className="mt-6 w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
      >
        {available ? "Book Room" : "Unavailable"}
      </button>
    </article>
  );
}

export default RoomCard;