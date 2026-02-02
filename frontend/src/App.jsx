import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import PrivateRoute from './components/routing/PrivateRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProblemsPage from './pages/ProblemsPage.jsx';
import AddProblemPage from './pages/AddProblemPage.jsx';
import EditProblemPage from './pages/EditProblemPage.jsx';
import RevisionPage from './pages/RevisionPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

import ProfilePage from './pages/ProfilePage.jsx';
import { useTheme } from "./context/ThemeContext";

function App() {
     const location = useLocation();
     const isAuthPage = ['/login', '/register'].some(path => 
     location.pathname.includes(path)
     );
     const { theme } = useTheme();

     return (
     <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
          <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
               duration: 3000,
               style: {
               background: theme === "dark" ? "#1a1a1a" : "#fff", 
               color: theme === "dark" ? "#fff" : "#000",
               },
          }}
          />
          <Navbar />
          <main className={`flex-grow flex ${isAuthPage ? 'items-center justify-center py-4' : ''}`}>
          <div className={`${isAuthPage ? 'w-full flex items-center justify-center' : 'container mx-auto px-4 sm:px-6 lg:px-8 py-4'}`}>
               <Routes>
               <Route path="/" element={<LandingPage />} />
               <Route path="/login" element={<LoginPage />} />
               <Route path="/register" element={<RegisterPage />} />
               
               <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
               <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
               <Route path="/problems" element={<PrivateRoute><ProblemsPage /></PrivateRoute>} />
               <Route path="/add-problem" element={<PrivateRoute><AddProblemPage /></PrivateRoute>} />
               <Route path="/problem/:id/edit" element={<PrivateRoute><EditProblemPage /></PrivateRoute>} />
               <Route path="/revision" element={<PrivateRoute><RevisionPage /></PrivateRoute>} />
               <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
              
               </Routes>
          </div>
          </main>
          {!isAuthPage && <Footer />}
     </div>
     );
}

export default App;