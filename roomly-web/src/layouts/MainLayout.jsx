
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <div className="ml-62.5 min-h-screen min-w-0 max-sm:ml-19">
        <main className="w-full min-w-0 p-8 max-sm:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
