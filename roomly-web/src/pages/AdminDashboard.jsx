import { Link } from "react-router-dom";
const adminLinks = [
    {
        title: "Manage rooms",
        description: "Create rooms, update their details, and manage active status and amenities.",
        path: "/admin/rooms",
    },
    {
        title: "Manage amenities",
        description: "Maintain the shared amenity list and descriptions.",
        path: "/admin/amenities",
    },
    {
        title: "Room utilization",
        description: "Review booked hours and booking counts by date range.",
        path: "/admin/reports",
    },
];
function AdminDashboard({ currentUser }) {
    return (<section className="space-y-7">
      <header>
        <p className="text-sm font-semibold text-violet-700">Roomly Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Signed in as {currentUser.name || currentUser.email}.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {adminLinks.map((link) => (<article key={link.path} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{link.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{link.description}</p>
            <Link to={link.path} className="mt-5 inline-flex font-semibold text-violet-700 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-700">
              Open
            </Link>
          </article>))}
      </div>
    </section>);
}
export default AdminDashboard;
