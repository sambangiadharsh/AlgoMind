// // // import React, { useState, useEffect } from 'react';
// // // import { Link, useNavigate } from 'react-router-dom';
// // // import { useDispatch, useSelector } from 'react-redux';
// // // import { register, reset } from '../features/auth/authSlice.js';
// // // import Button from '../components/common/Button.jsx';
// // // import Input from '../components/common/Input.jsx';
// // // import Spinner from '../components/common/Spinner.jsx';
// // // import { toast } from 'react-hot-toast';
// // // import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// // // const RegisterPage = () => {
// // //      const [formData, setFormData] = useState({ name: '', email: '', password: '', password2: '' });
// // //      const [showPassword, setShowPassword] = useState(false);
// // //      const [showPassword2, setShowPassword2] = useState(false);
// // //      const { name, email, password, password2 } = formData;
// // //      const navigate = useNavigate();
// // //      const dispatch = useDispatch();
// // //      const { isLoading, isSuccess } = useSelector((state) => state.auth);
     
// // //      const passwordMismatch = password && password2 && password !== password2;

// // //      // useEffect(() => {
// // //      // if (isSuccess) {
// // //      //      navigate('/login');
// // //      // }
// // //      // return () => { dispatch(reset()); }
// // //      // }, [isSuccess, navigate, dispatch]);

// // //      // src/pages/RegisterPage.jsx
// // //           // src/pages/RegisterPage.jsx

// // // useEffect(() => {
// // //     // If userInfo exists (even the local temporary one), redirect immediately
// // //     if (userInfo || isSuccess) {
// // //         navigate('/dashboard');
// // //     }
// // //     return () => { dispatch(reset()); }
// // // }, [userInfo, isSuccess, navigate, dispatch]);

// // //      const onChange = (e) => {
// // //      setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
// // //      };

// // //      const onSubmit = (e) => {
// // //      e.preventDefault();
// // //      if (passwordMismatch) {
// // //           toast.error('Passwords do not match');
// // //      } else {
// // //           dispatch(register({ name, email, password }));
// // //      }
// // //      };

// // //      return (
// // //      <div className="flex items-center justify-center p-4 w-full h-full">
// // //           <div className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mx-auto my-auto">
// // //           {/* Spinner overlay - positioned only over the form content with blur effect */}
// // //           {isLoading && (
// // //                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl">
// // //                <Spinner size="lg" />
// // //                </div>
// // //           )}

// // //           <div className="text-center mb-6">
// // //                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create Your Account</h1>
// // //                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Start your DSA mastery journey today.</p>
// // //           </div>

// // //           <form onSubmit={onSubmit} className="space-y-3">
// // //                <div className="relative">
// // //                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// // //                <Input type="text" id="name" name="name" value={name} placeholder="Full Name" onChange={onChange} required autoComplete="name" className="pl-10 py-2" />
// // //                </div>

// // //                <div className="relative">
// // //                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// // //                <Input type="email" id="email" name="email" value={email} placeholder="Email Address" onChange={onChange} required autoComplete="email" className="pl-10 py-2" />
// // //                </div>

// // //                <div className="relative">
// // //                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// // //                <Input type={showPassword ? 'text' : 'password'} id="password" name="password" value={password} placeholder="New Password" onChange={onChange} required autoComplete="new-password" className="pl-10 pr-10 py-2" />
// // //                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
// // //                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
// // //                </button>
// // //                </div>

// // //                <div className="relative">
// // //                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// // //                <Input type={showPassword2 ? 'text' : 'password'} id="password2" name="password2" value={password2} placeholder="Confirm New Password" onChange={onChange} required autoComplete="new-password" className={`pl-10 pr-10 py-2 ${passwordMismatch ? 'border-red-500 focus:ring-red-500' : ''}`} />
// // //                <button type="button" onClick={() => setShowPassword2(!showPassword2)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
// // //                {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
// // //                </button>
// // //                </div>

// // //                {passwordMismatch && <p className="text-xs text-red-500">Passwords do not match.</p>}

// // //                <Button
// // //                type="submit"
// // //                variant="primary"
// // //                className="w-full !py-2 !mt-4"
// // //                disabled={isLoading}
// // //                >
// // //                {isLoading ? 'Creating Account...' : 'Sign Up'}
// // //                </Button>
// // //           </form>

// // //           <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
// // //                Already have an account?{' '}
// // //                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
// // //                Login
// // //                </Link>
// // //           </p>
// // //           </div>
// // //      </div>
// // //      );
// // // };

// // // export default RegisterPage;


// // import React, { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { register, reset } from '../features/auth/authSlice.js';
// // import Button from '../components/common/Button.jsx';
// // import Input from '../components/common/Input.jsx';
// // import Spinner from '../components/common/Spinner.jsx';
// // import { toast } from 'react-hot-toast';
// // import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// // const RegisterPage = () => {
// //      const [formData, setFormData] = useState({ name: '', email: '', password: '', password2: '' });
// //      const [showPassword, setShowPassword] = useState(false);
// //      const [showPassword2, setShowPassword2] = useState(false);
// //      const { name, email, password, password2 } = formData;
     
// //      const navigate = useNavigate();
// //      const dispatch = useDispatch();

// //      // Correctly pull userInfo from the auth state
// //      const { userInfo, isLoading, isSuccess } = useSelector((state) => state.auth);
     
// //      const passwordMismatch = password && password2 && password !== password2;

// //      useEffect(() => {
// //           // SEAMLESS FLOW: If userInfo exists (local or server-synced), 
// //           // move to dashboard immediately.
// //           if (userInfo || isSuccess) {
// //                navigate('/dashboard');
// //           }

// //           return () => { 
// //                dispatch(reset()); 
// //           };
// //      }, [userInfo, isSuccess, navigate, dispatch]);

// //      const onChange = (e) => {
// //           setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
// //      };

// //      const onSubmit = (e) => {
// //           e.preventDefault();
// //           if (passwordMismatch) {
// //                toast.error('Passwords do not match');
// //           } else {
// //                dispatch(register({ name, email, password }));
// //           }
// //      };

// //      return (
// //           <div className="flex items-center justify-center p-4 w-full h-full">
// //                <div className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mx-auto my-auto">
                    
// //                     {/* Spinner overlay for background sync feel */}
// //                     {isLoading && (
// //                          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl">
// //                               <Spinner size="lg" />
// //                          </div>
// //                     )}

// //                     <div className="text-center mb-6">
// //                          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Create Your Account</h1>
// //                          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Start your DSA mastery journey today.</p>
// //                     </div>

// //                     <form onSubmit={onSubmit} className="space-y-3">
// //                          <div className="relative">
// //                               <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// //                               <Input type="text" id="name" name="name" value={name} placeholder="Full Name" onChange={onChange} required autoComplete="name" className="pl-10 py-2" />
// //                          </div>

// //                          <div className="relative">
// //                               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// //                               <Input type="email" id="email" name="email" value={email} placeholder="Email Address" onChange={onChange} required autoComplete="email" className="pl-10 py-2" />
// //                          </div>

// //                          <div className="relative">
// //                               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// //                               <Input type={showPassword ? 'text' : 'password'} id="password" name="password" value={password} placeholder="New Password" onChange={onChange} required autoComplete="new-password" className="pl-10 pr-10 py-2" />
// //                               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
// //                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
// //                               </button>
// //                          </div>

// //                          <div className="relative">
// //                               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
// //                               <Input type={showPassword2 ? 'text' : 'password'} id="password2" name="password2" value={password2} placeholder="Confirm New Password" onChange={onChange} required autoComplete="new-password" className={`pl-10 pr-10 py-2 ${passwordMismatch ? 'border-red-500 focus:ring-red-500' : ''}`} />
// //                               <button type="button" onClick={() => setShowPassword2(!showPassword2)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
// //                                    {showPassword2 ? <EyeOff size={18} /> : <Eye size={18} />}
// //                               </button>
// //                          </div>

// //                          {passwordMismatch && <p className="text-xs text-red-500">Passwords do not match.</p>}

// //                          <Button
// //                               type="submit"
// //                               variant="primary"
// //                               className="w-full !py-2 !mt-4"
// //                               disabled={isLoading}
// //                          >
// //                               {isLoading ? 'Creating Account...' : 'Sign Up'}
// //                          </Button>
// //                     </form>

// //                     <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
// //                          Already have an account?{' '}
// //                          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
// //                               Login
// //                          </Link>
// //                     </p>
// //                </div>
// //           </div>
// //      );
// // };

// // export default RegisterPage;


// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { register, reset } from '../features/auth/authSlice';
// import Button from '../components/common/Button';
// import Input from '../components/common/Input';
// import Spinner from '../components/common/Spinner';
// import { toast } from 'react-hot-toast';
// import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     password2: '',
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showPassword2, setShowPassword2] = useState(false);

//   const { name, email, password, password2 } = formData;

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { userInfo, isLoading } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (userInfo?.token) {
//       navigate('/dashboard');
//     }
//     return () => dispatch(reset());
//   }, [userInfo, navigate, dispatch]);

//   const onSubmit = (e) => {
//     e.preventDefault();

//     if (password !== password2) {
//       toast.error('Passwords do not match');
//       return;
//     }

//     dispatch(register({ name, email, password }));
//   };

//   return (
//     <div className="flex items-center justify-center h-full p-4">
//       <div className="relative w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
//         {isLoading && (
//           <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-800/70">
//             <Spinner />
//           </div>
//         )}

//         <h1 className="text-2xl font-bold text-center mb-4">
//           Create Account
//         </h1>

//         <form onSubmit={onSubmit} className="space-y-3">
//           <Input
//             icon={User}
//             name="name"
//             placeholder="Name"
//             value={name}
//             onChange={(e) =>
//               setFormData({ ...formData, name: e.target.value })
//             }
//             required
//           />

//           <Input
//             icon={Mail}
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) =>
//               setFormData({ ...formData, email: e.target.value })
//             }
//             required
//           />

//           <Input
//             icon={Lock}
//             type={showPassword ? 'text' : 'password'}
//             name="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) =>
//               setFormData({ ...formData, password: e.target.value })
//             }
//             toggleIcon
//             onToggle={() => setShowPassword(!showPassword)}
//             required
//           />

//           <Input
//             icon={Lock}
//             type={showPassword2 ? 'text' : 'password'}
//             name="password2"
//             placeholder="Confirm Password"
//             value={password2}
//             onChange={(e) =>
//               setFormData({ ...formData, password2: e.target.value })
//             }
//             toggleIcon
//             onToggle={() => setShowPassword2(!showPassword2)}
//             required
//           />

//           <Button type="submit" className="w-full">
//             Sign Up
//           </Button>
//         </form>

//         <p className="text-center mt-4 text-sm">
//           Already have an account?{' '}
//           <Link to="/login" className="text-indigo-600">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;



import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../features/auth/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo?.token) {
      navigate('/dashboard');
    }
  }, [userInfo, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }

    dispatch(register({ name, email, password }));
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-800/70">
            <Spinner />
          </div>
        )}

        <h1 className="text-2xl font-bold text-center mb-4">
          Create Account
        </h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <Input
            icon={User}
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <Input
            icon={Mail}
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <Input
            icon={Lock}
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <Input
            icon={Lock}
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) =>
              setFormData({ ...formData, password2: e.target.value })
            }
            required
          />

          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
