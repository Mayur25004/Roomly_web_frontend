import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
const pageTitles = {
    "/rooms": "Browse Rooms",
    "/availability": "Find an Available Room",
    "/my-bookings": "My Bookings",
    "/profile": "My Profile",
    "/admin": "Admin Dashboard",
    "/admin/rooms": "Manage Rooms",
    "/admin/amenities": "Manage Amenities",
    "/admin/reports": "Room Utilization",
};
function MainLayout({ currentUser, onLogout, }) {
    const location = useLocation();
    useEffect(() => {
        const isBookingPage = location.pathname.startsWith("/bookings/new/");
        const isRoomSchedulePage = location.pathname.startsWith("/rooms/") &&
            location.pathname.endsWith("/schedule");
        const pageName = isBookingPage
            ? "Create Booking"
            : isRoomSchedulePage
                ? "Room Schedule"
                : pageTitles[location.pathname] || "Rooms";
        document.title = `Roomly - ${pageName}`;
    }, [location.pathname]);
    return (<div className="flex min-h-screen bg-slate-50">
      {currentUser && <Sidebar currentUser={currentUser} onLogout={onLogout}/>}

      <main className="min-h-screen min-w-0 flex-1 p-8 max-sm:p-4">
        <Outlet />
      </main>
    </div>);
}
export default MainLayout;
