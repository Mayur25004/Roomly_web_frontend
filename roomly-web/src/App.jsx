import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import AdminAmenities from "./pages/AdminAmenities.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminRooms from "./pages/AdminRooms.jsx";
import AdminUtilization from "./pages/AdminUtilization.jsx";
import Availability from "./pages/Availability.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import Login from "./pages/Login.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Register from "./pages/Register.jsx";
import Rooms from "./pages/Rooms.jsx";
import RoomSchedule from "./pages/RoomSchedule.jsx";
import {
  clearSavedUser,
  logout,
  restoreSession,
} from "./services/authService.ts";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  useEffect(() => {
    function handleUnauthorized() {
      clearSavedUser();
      setCurrentUser(null);
    }

    window.addEventListener("roomly:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("roomly:unauthorized", handleUnauthorized);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const user = await restoreSession();
        if (isMounted) {
          setCurrentUser(user);
        }
      } catch {
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setIsRestoringSession(false);
        }
      }
    }

    loadSession();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Clear the local session even if the API logout request fails.
    }
    setCurrentUser(null);
  }

  if (isRestoringSession) {
    return (
      <p role="status" className="p-6 text-sm text-slate-600">
        Restoring your Roomly session...
      </p>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={currentUser ? "/rooms" : "/login"} replace />} />
        <Route path="/login" element={<Login currentUser={currentUser} onLogin={setCurrentUser} />} />
        <Route path="/register" element={<Register currentUser={currentUser} onRegister={setCurrentUser} />} />
        <Route element={<ProtectedRoute user={currentUser} />}>
          <Route element={<MainLayout currentUser={currentUser} onLogout={handleLogout} />}>
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/availability" element={<Availability />} />
            <Route path="/rooms/:roomId/schedule" element={<RoomSchedule />} />
            <Route path="/bookings/new/:roomId" element={<BookingForm />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route element={<ProtectedRoute user={currentUser} requiredRole="admin" />}>
              <Route path="/admin" element={<AdminDashboard currentUser={currentUser} />} />
              <Route path="/admin/rooms" element={<AdminRooms />} />
              <Route path="/admin/amenities" element={<AdminAmenities />} />
              <Route path="/admin/reports" element={<AdminUtilization />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={currentUser ? "/rooms" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
