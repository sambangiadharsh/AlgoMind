import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/auth/authSlice.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Spinner from '../components/common/Spinner.jsx';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
     const [formData, setFormData] = useState({ email: '', password: '' });
     const [showPassword, setShowPassword] = useState(false);
     const { email, password } = formData;
     const navigate = useNavigate();
     const dispatch = useDispatch();
     const { userInfo, isLoading, isSuccess } = useSelector((state) => state.auth);

     useEffect(() => {
     if (isSuccess || userInfo) {
          navigate('/dashboard');
     }
     return () => {
          dispatch(reset());
     };
     }, [userInfo, isSuccess, navigate, dispatch]);

     const onChange = (e) => {
     setFormData((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
     }));
     };

     const onSubmit = (e) => {
     e.preventDefault();
     dispatch(login({ email, password }));
     };

     return (
     <div className="flex items-center justify-center p-4 w-full h-full">
          {/* Form container */}
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mx-auto my-auto">
          {/* Spinner overlay - covers only the form content with blur effect */}
          {isLoading && (
               <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl">
               <Spinner size="lg" />
               </div>
          )}

          <div className="text-center mb-6">
               <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
               Welcome Back!
               </h1>
               <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
               Sign in to continue your journey.
               </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
               <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
               <Input
               type="email"
               id="email"
               name="email"
               value={email}
               placeholder="Email Address"
               onChange={onChange}
               required
               autoComplete="email"
               className="pl-10 py-2"
               />
               </div>

               <div className="relative">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
               <Input
               type={showPassword ? 'text' : 'password'}
               id="password"
               name="password"
               value={password}
               placeholder="Password"
               onChange={onChange}
               required
               autoComplete="current-password"
               className="pl-10 pr-10 py-2"
               />
               <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
               >
               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
               </div>

               <div className="text-right text-sm">
               <Link
               to="/forgot-password"
               className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
               >
               Forgot Password?
               </Link>
               </div>

               <Button
               type="submit"
               variant="primary"
               className="w-full !py-2"
               disabled={isLoading}
               >
               {isLoading ? 'Logging in...' : 'Login'}
               </Button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
               Don't have an account?{' '}
               <Link
               to="/register"
               className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
               >
               Sign up
               </Link>
          </p>
          </div>
     </div>
     );
};

export default LoginPage;