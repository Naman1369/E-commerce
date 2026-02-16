import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const email = useSelector((state) => state.user.email);
  const navigate = useNavigate();

  const links = [
    { name: "Home", path: "/" },
    { name: "My Products", path: "/my-products" },
    { name: "Add Product", path: "/create-product" },
    { name: "Cart", path: "/cart" },
    { name: "Orders", path: "/myorders" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">ShopNest</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                    ? "gradient-primary text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Auth / User */}
          <div className="hidden md:flex items-center gap-3">
            {email ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-600/30">
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white">
                  {email.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-slate-300 max-w-[120px] truncate">
                  {email}
                </span>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="btn-primary text-sm !px-4 !py-2"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-slate-700/50 animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                    ? "gradient-primary text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            {!email && (
              <NavLink
                to="/login"
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-indigo-400 hover:bg-indigo-500/10 transition-all"
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
