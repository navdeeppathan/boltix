import { Bell, LogOut, Menu, Search } from "lucide-react";
import { FaUser } from "react-icons/fa";
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

          {/* User Menu - Hidden on small mobile */}

          {/* Logout */}
          {/* <button
            onClick={() => {
              localStorage.removeItem("admin");
              localStorage.removeItem("admintoken");
              localStorage.clear();

              navigate("/login");
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <LogOut size={20} />
          </button> */}
          <div className="relative group inline-block">
            <button
              onClick={() => navigate("/company-admin/dashboard/profile")}
              className="px-3 text-[#212529] cursor-pointer md:text-[16px] bg-gray-200 p-2 hover:text-[#0088FF] font-medium rounded-lg text-sm"
            >
              <FaUser size={20} />
            </button>

            {/* Tooltip */}
            <span
              className="absolute left-1/2 -translate-x-1/2 top-10 whitespace-nowrap 
  bg-black text-white text-xs px-2 py-1 rounded-md shadow
  opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none"
            >
              Profile
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CompanyAdminHeader;
