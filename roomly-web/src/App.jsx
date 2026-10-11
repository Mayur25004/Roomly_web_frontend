import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Availability from "./pages/Availability.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Rooms from "./pages/Rooms.jsx";
import RoomSchedule from "./pages/RoomSchedule.jsx";

function Login() {
  return <h1>Roomly Login</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<MainLayout />}>
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/rooms/:roomId/schedule" element={<RoomSchedule />} />
          <Route path="/bookings/new/:roomId" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
