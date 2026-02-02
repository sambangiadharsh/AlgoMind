import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, changePassword, deleteUser, logout } from '../features/auth/authSlice.js';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/common/Modal.jsx';
import { User, Mail, Lock, Eye, EyeOff, LogOut } from 'lucide-react';

const ProfilePage = () => {
     const dispatch = useDispatch();
     const navigate = useNavigate();
     const { userInfo, isLoading } = useSelector((state) => state.auth);

     const [name, setName] = useState(userInfo?.name || '');
     const [passwordData, setPasswordData] = useState({
     currentPassword: '',
     newPassword: '',
     password2: '',
     });
     const [showCurrent, setShowCurrent] = useState(false);
     const [showNew, setShowNew] = useState(false);
     const [showConfirm, setShowConfirm] = useState(false);
     const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
     const [isDeleting, setIsDeleting] = useState(false);

     const { currentPassword, newPassword, password2 } = passwordData;
     const passwordMismatch = newPassword && password2 && newPassword !== password2;

     // ✅ Update Name
     const handleNameUpdate = async (e) => {
     e.preventDefault();
     if (name === userInfo.name) {
          toast.error("You haven't changed your name.");
          return;
     }
     try {
          await dispatch(updateUser({ name })).unwrap();
          toast.success('Name updated successfully!');
     } catch (err) {
          toast.error(err.message || 'Failed to update name.');
     }
     };

     // ✅ Update Password
     const handlePasswordChange = (e) => {
     setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
     };

     const handlePasswordUpdate = async (e) => {
     e.preventDefault();
     if (passwordMismatch) {
          toast.error('New passwords do not match.');
          return;
     }
     if (newPassword.length < 6) {
          toast.error('New password must be at least 6 characters long.');
          return;
     }
     try {
          await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
          toast.success('Password changed successfully!');
          setPasswordData({ currentPassword: '', newPassword: '', password2: '' });
     } catch (err) {
          const errorMessage =
          typeof err === 'string' ? err : err.message || 'Failed to change password.';
          toast.error(errorMessage);
     }
     };

     // ✅ Delete Account
     const handleDeleteAccount = async () => {
     try {
          setIsDeleting(true);
          await dispatch(deleteUser()).unwrap();
          dispatch(logout());
          navigate('/register');
          toast.success('Account deleted successfully!');
     } catch (err) {
          toast.error(err.message || 'Failed to delete account.');
     } finally {
          setIsDeleting(false);
          setDeleteModalOpen(false);
     }
     };

     // ✅ Logout
     const handleLogout = () => {
     dispatch(logout());
     navigate('/');
     toast.success('Logged out successfully!');
     };

     return (
     <>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Info Card */}
          <div className="lg:col-span-1">
               <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center h-full flex flex-col">
               <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900 rounded-full mx-auto flex items-center justify-center mb-4">
               <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-300">
                    {name.charAt(0).toUpperCase()}
               </span>
               </div>
               <h2 className="text-2xl font-bold">{name}</h2>
               <p className="text-gray-500 dark:text-gray-400">{userInfo.email}</p>
               {userInfo.createdAt && (
               <p className="text-xs text-gray-400 mt-4">
                    Member since {new Date(userInfo.createdAt).toLocaleDateString()}
               </p>
               )}
               <div className="mt-auto pt-6">
               <Button
                    onClick={handleLogout}
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2"
               >
                    <LogOut size={16} />
                    <span>Logout</span>
               </Button>
               </div>
               </div>
          </div>

          {/* Right Column: Forms */}
          <div className="lg:col-span-2 space-y-8">
               {/* Update Name Form */}
               <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
               <h3 className="text-xl font-semibold mb-4">Update Information</h3>
               <form onSubmit={handleNameUpdate} className="space-y-6">
               <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                    </label>
                    <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                         type="text"
                         name="name"
                         id="name"
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         required
                         className="pl-10"
                    />
                    </div>
               </div>
               <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                    </label>
                    <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                         type="email"
                         name="email"
                         id="email"
                         value={userInfo.email}
                         readOnly
                         className="pl-10 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    />
                    </div>
               </div>
               <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Name'}
               </Button>
               </form>
               </div>

               {/* Change Password Form */}
               <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
               <h3 className="text-xl font-semibold mb-4">Change Password</h3>
               <form onSubmit={handlePasswordUpdate} className="space-y-6">
               <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                    type={showCurrent ? 'text' : 'password'}
                    name="currentPassword"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="pl-10"
                    />
                    <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                    {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
               </div>
               <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                    type={showNew ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="pl-10"
                    />
                    <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                    {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
               </div>
               <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                    type={showConfirm ? 'text' : 'password'}
                    name="password2"
                    placeholder="Confirm New Password"
                    value={password2}
                    onChange={handlePasswordChange}
                    required
                    className={`pl-10 ${
                         passwordMismatch ? 'border-red-500 focus:ring-red-500' : ''
                    }`}
                    />
                    <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
               </div>
               {passwordMismatch && (
                    <p className="text-xs text-red-500 -mt-4">
                    New passwords do not match.
                    </p>
               )}
               <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button type="submit" variant="secondary" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                    <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                    Forgot Password?
                    </Link>
               </div>
               </form>
               </div>

               {/* Delete Account Section */}
               <div className="bg-red-50 dark:bg-gray-800 border border-red-200 dark:border-red-700 p-8 rounded-lg shadow-lg">
               <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-4">
               Danger Zone
               </h3>
               <p className="text-red-700 dark:text-red-400 mb-4">
               Once you delete your account, there is no going back. Please be
               certain.
               </p>
               <Button
               variant="danger"
               onClick={() => setDeleteModalOpen(true)}
               disabled={isDeleting}
               >
               {isDeleting ? 'Deleting...' : 'Delete My Account'}
               </Button>
               </div>
          </div>
          </div>

          {/* Confirm Delete Modal */}
          <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteAccount}
          title="Are you absolutely sure?"
          >
          This action cannot be undone. This will permanently delete your account
          and remove your data from our servers.
          </Modal>
     </>
     );
};

export default ProfilePage;
