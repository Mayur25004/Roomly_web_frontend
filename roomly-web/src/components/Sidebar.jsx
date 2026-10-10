
import { NavLink, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  LayoutGrid,
  UserRound,
  LogOut,
} from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();

  const links = [
    { name: "Browse Rooms", path: "/rooms", icon: LayoutGrid },
    { name: "My Bookings", path: "/my-bookings", icon: CalendarDays },
    { name: "Profile", path: "/profile", icon: UserRound },
  ];

  function handleLogout() {
    navigate("/login");
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex w-62.5 flex-col bg-[#17152b] px-4.5 pt-7 pb-5 text-[#f8fafc] max-sm:w-19 max-sm:px-2.5">
      <div className="flex items-center gap-2.75 px-2.5 text-2xl font-[750] text-[#c6bbff] max-sm:justify-center max-sm:px-0">
        <CalendarDays size={26} />
        <span className="max-sm:hidden">Roomly</span>
      </div>

      <p className="mb-3.5 ml-2.5 mt-9.5 text-[11px] font-bold tracking-[1.2px] text-[#a9a5be] max-sm:hidden">
        WORKSPACE
      </p>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-[9px] px-3 py-3.25 text-sm no-underline transition-colors hover:bg-[#302b45] max-sm:justify-center max-sm:px-2 ${
                  isActive
                    ? "bg-[#393253] text-[#c6bbff]"
                    : "text-[#d8d5e4]"
                }`
              }
            >
              <Icon size={19} />
              <span className="max-sm:hidden">{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-auto flex w-full items-center gap-3 rounded-[9px] border-0 bg-transparent px-3 py-3.25 text-sm text-[#fca5a5] transition-colors hover:bg-[#302b45] max-sm:justify-center max-sm:px-2"
      >
        <LogOut size={19} />
        <span className="max-sm:hidden">Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;
