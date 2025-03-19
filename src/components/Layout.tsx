import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Plane, User as UserIcon, LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { auth } from '../firebaseConfig';

export function Layout() {
  const { user, setUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    navigate('/');
  };

  const pathsWithBackground = ['/'];
  const hasBackground = pathsWithBackground.includes(location.pathname);

  return (
    <div className={`min-h-screen ${hasBackground ? 'bg-home bg-cover bg-center' : 'bg-gray-100'}`}>
      <nav className="bg-white/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Plane className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">TravelPlanner</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {user && (
                <>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/trips/new">New Trip</NavLink>
                  <NavLink to="/weather">Weather Forecast</NavLink>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* User Authentication Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm text-gray-700">{user.email}</span>
                  <button className="p-2 text-gray-500 hover:text-gray-700" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user && (
                <>
                  <NavLink to="/dashboard" mobile>Dashboard</NavLink>
                  <NavLink to="/trips/new" mobile>New Trip</NavLink>
                  <NavLink to="/weather" mobile>Weather Forecast</NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}

// Navigation Link Component for consistency
function NavLink({ to, children, mobile = false }: { to: string; children: React.ReactNode; mobile?: boolean }) {
  const location = useLocation();
  
  return (
    <Link
      to={to}
      className={`block px-3 py-2 text-sm font-medium ${
        location.pathname === to
          ? 'text-blue-600 border-b-2 border-blue-500'
          : 'text-gray-700 hover:text-gray-900'
      } ${mobile ? 'w-full block' : ''}`}
    >
      {children}
    </Link>
  );

}
