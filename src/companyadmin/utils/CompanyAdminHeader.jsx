import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompanyAdminHeader = ({ title, setIsOpen, user }) => {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            {title}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search - Hidden on mobile */}
          {/* <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-48"
            />
          </div> */}

          {/* Notifications */}
          {/* <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button> */}

          {/* User Menu - Hidden on small mobile */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.removeItem("admin");
              localStorage.removeItem("admintoken");
              localStorage.clear();

              navigate("/company-admin-login");
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default CompanyAdminHeader;
