import { Link } from "react-router-dom";
import { Users, MapPin, DoorOpen } from "lucide-react";

function RoomCard({ room }) {
  const active = room.active !== false;

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex size-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <DoorOpen size={24} aria-hidden="true" />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {active ? "Active" : "Inactive"}
        </span>
      </div>

      <h2 className="text-lg font-semibold text-slate-900">{room.name}</h2>

      <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <MapPin size={17} aria-hidden="true" />
        {room.location}
      </p>

      <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
        <Users size={17} aria-hidden="true" />
        Capacity: {room.capacity} people
      </p>

      <div className="mt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Amenities
        </h3>
        {(room.amenities || []).length > 0 ? (
          <ul aria-label={`${room.name} amenities`} className="mt-2 flex flex-wrap gap-2">
            {(room.amenities || []).map((amenity) => (
              <li
                key={amenity}
                className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700"
              >
                {amenity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No amenities listed</p>
        )}
      </div>

      {active ? (
        <Link
          to={`/bookings/new/${room.id}`}
          className="mt-6 flex w-full items-center justify-center rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
        >
          Book Room
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-6 w-full rounded-lg bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-500"
        >
          Unavailable
        </button>
      )}

      <Link
        to={`/rooms/${room.id}/schedule`}
        className="mt-3 flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700"
      >
        View day schedule
      </Link>
    </article>
  );
}

export default RoomCard;
