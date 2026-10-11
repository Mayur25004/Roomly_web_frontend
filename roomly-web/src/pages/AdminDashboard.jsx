function AdminDashboard({ currentUser }) {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm font-semibold text-violet-700">Roomly Admin</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Signed in as {currentUser.name || currentUser.email}.
        </p>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Administration</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Room management, amenity management, and utilization reports are the next admin features. Those actions will be added here as their backend contracts are agreed.
        </p>
      </div>
    </section>
  );
}

export default AdminDashboard;
