import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

const pageTitles = {
  "/rooms": "Browse Rooms",
  "/availability": "Find an Available Room",
  "/my-bookings": "My Bookings",
};

function MainLayout() {
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-[250px] min-h-screen min-w-0 p-8 max-sm:ml-[76px] max-sm:p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;