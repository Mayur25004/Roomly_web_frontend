import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

function MainLayout() {
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