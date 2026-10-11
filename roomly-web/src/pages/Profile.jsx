import { useCallback, useEffect, useState } from "react";
import { CalendarDays, Clock3, Mail, UserRound } from "lucide-react";
import { ApiError } from "../api/apiClient.js";
import { myBookingsService } from "../services/myBookingsService.js";
import { getProfileBookingCounts, getUserInitials } from "../utils/profileSummary.js";

function getErrorMessage(error) {
    if (error instanceof ApiError || error instanceof Error) {
        return error.message;
    }
    return "Something went wrong. Please try again.";
}

function Profile({ currentUser }) {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const loadBookings = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const results = await myBookingsService.getMyBookings();
            setBookings(results);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadBookings();
    }, [loadBookings]);

    const displayName = currentUser.name?.trim() || "Name not provided";
    const roleName = currentUser.role === "admin" ? "Admin" : "Employee";
    const counts = getProfileBookingCounts(bookings);

    return (
        <section className="mx-auto max-w-4xl space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Profile</h1>
                <p className="mt-2 text-sm text-slate-500">Your account details and booking activity.</p>
            </header>

            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                    <div aria-label={`${getUserInitials(currentUser)} profile avatar`} className="flex p-3 h-24 w-24 shrink-0 items-center justify-center rounded-full bg-violet-100 text-3xl font-bold text-violet-700 ring-4 ring-violet-50">
                        {getUserInitials(currentUser)}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-2xl font-semibold text-slate-900">{displayName}</h2>
                        <p className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-600 sm:justify-start">
                            <Mail size={16} aria-hidden="true" />
                            <span className="break-all">{currentUser.email}</span>
                        </p>
                        <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                            <UserRound size={18} aria-hidden="true" />
                            {roleName}
                        </p>
                    </div>
                </div>
            </article>

            <section aria-labelledby="booking-summary-title" className="space-y-4">
                <div>
                    <h2 id="booking-summary-title" className="text-xl font-semibold text-slate-900">Booking activity</h2>
                    <p className="mt-1 text-sm text-slate-500">A summary of your booking history.</p>
                </div>

                {errorMessage && (
                    <div role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                        <p>{errorMessage}</p>
                        <button type="button" onClick={loadBookings} className="mt-2 font-semibold underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                            Try again
                        </button>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 text-violet-700">
                            <CalendarDays size={20} aria-hidden="true" />
                            <h3 className="text-sm font-semibold">Total bookings</h3>
                        </div>
                        <p aria-live="polite" className="mt-4 text-4xl font-bold text-slate-900">
                            {isLoading ? "—" : errorMessage ? "—" : counts.total}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">Including past and cancelled bookings</p>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 text-violet-700">
                            <Clock3 size={20} aria-hidden="true" />
                            <h3 className="text-sm font-semibold">Upcoming bookings</h3>
                        </div>
                        <p aria-live="polite" className="mt-4 text-4xl font-bold text-slate-900">
                            {isLoading ? "—" : errorMessage ? "—" : counts.upcoming}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">Confirmed and in-progress bookings</p>
                    </article>
                </div>
                {isLoading && <p role="status" className="text-sm text-slate-500">Loading your booking activity...</p>}
            </section>
        </section>
    );
}

export default Profile;
