import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Plane, User as UserIcon, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { auth } from '../firebaseConfig';

export function Layout() {
  const { user, setUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };


  const pathsWithBackground = ['/'];
  const hasBackground = pathsWithBackground.includes(location.pathname);
  
  return (
    
    <div className={`min-h-screen ${hasBackground ? 'bg-home bg-cover bg-center' : 'bg-white-100 ' }`}>
      <nav className="inset-0 bg-white/50 shadow-sm ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <Plane className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">TravelPlanner</span>
              </Link>
              {user && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/dashboard'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/trips/new"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/trips/new'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    New Trip
                  </Link>
                  <Link
                    to="/weather"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/weather'
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Weather Forecast
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">{user.email}</span>
                  <button
                    className="p-2 text-gray-500 hover:text-gray-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" onClick={
                      () => {
                        auth.signOut();
                        navigate('/')
                    }
                    }/>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <Outlet />
      </main>
    </div>
  );
}