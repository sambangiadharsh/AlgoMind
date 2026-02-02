
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Sun, Moon, LogOut, Brain,Code, User, Settings, BookOpen, BarChart2, Menu, X, Repeat } from 'lucide-react';
import Button from '../common/Button.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };
  
  const activeLinkStyle = {
    color: theme === 'dark' ? '#a5b4fc' : '#4f46e5',
    fontWeight: '600'
  };

  const MobileNavLink = ({ to, children, icon }) => (
    <NavLink
      to={to}
      style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
      className="flex items-center gap-3 py-3 px-3 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
      onClick={() => setMobileMenuOpen(false)}
    >
      {icon}
      {children}
    </NavLink>
  );

  return (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <Brain className="h-8 w-8 text-indigo-500" />
              <span className="text-xl font-bold text-gray-800 dark:text-white">AlgoMind</span>
            </Link>
          </div>
          
          {/* Center Section: Desktop Navigation */}
          {userInfo && (
            <div className="hidden md:flex flex-1 justify-center items-center space-x-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-full">
                <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors rounded-full flex items-center gap-2"><BarChart2 size={16}/>Dashboard</NavLink>
                <NavLink to="/problems" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors rounded-full flex items-center gap-2"><BookOpen size={16}/>Problems</NavLink>
                <NavLink to="/revision" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors rounded-full flex items-center gap-2"><Repeat size={16}/>Revision</NavLink>
            </div>
          )}

          {/* Right Section */}
          <div className="flex-1 flex items-center justify-end space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {userInfo ? (
              // Profile Dropdown
              <div className="relative hidden md:block" ref={profileMenuRef}>
                <button onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-indigo-500 font-bold">
                  {userInfo.name.charAt(0).toUpperCase()}
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-800">
                    <NavLink to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setProfileMenuOpen(false)}><User size={14}/>Profile</NavLink>
                    <NavLink to="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setProfileMenuOpen(false)}><Settings size={14}/>Settings</NavLink>
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"><LogOut size={14}/>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login"><Button variant="secondary">Login</Button></Link>
                <Link to="/register"><Button variant="primary">Sign Up</Button></Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {userInfo ? (
                        <>
                            <MobileNavLink to="/dashboard" icon={<BarChart2 size={20}/>}>Dashboard</MobileNavLink>
                            <MobileNavLink to="/problems" icon={<BookOpen size={20}/>}>Problems</MobileNavLink>
                            <MobileNavLink to="/revision" icon={<Repeat size={20}/>}>Revision</MobileNavLink>
                            <MobileNavLink to="/settings" icon={<Settings size={20}/>}>Settings</MobileNavLink>
                            <MobileNavLink to="/profile" icon={<User size={20}/>}>Profile</MobileNavLink>
                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                                <Button onClick={handleLogout} variant="secondary" className="w-full flex items-center justify-center gap-2"><LogOut size={16}/>Logout</Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                                <Link to="/login" className="w-full"><Button variant="secondary" className="w-full">Login</Button></Link>
                                <Link to="/register" className="w-full"><Button variant="primary" className="w-full">Sign Up</Button></Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        )}
      </nav>
    </header>
  );
};
export default Navbar;
