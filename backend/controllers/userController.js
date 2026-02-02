import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Problem from '../models/problemModel.js';
import UserSettings from '../models/userSettingsModel.js';
import generateToken from '../utils/generateToken.js';

/* ============================
   REGISTER (INSTANT ACCESS)
============================ */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });

  // Create settings safely (non-blocking)
  try {
    await UserSettings.create({ user: user._id });
  } catch (err) {
    console.error('UserSettings creation failed:', err);
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

/* ============================
   LOGIN
============================ */
export const loginUser = asyncHandler(async (req, res) => {
     const { email, password } = req.body;
   
     const user = await User.findOne({ email });
   
     if (!user) {
       res.status(401);
       throw new Error('User is not registered');
     }
   
     const isMatch = await user.matchPassword(password);
   
     if (!isMatch) {
       res.status(401);
       throw new Error('Incorrect password');
     }
   
     res.json({
       _id: user._id,
       name: user.name,
       email: user.email,
       token: generateToken(user._id),
     });
   });

/* ============================
   PROFILE
============================ */
export const getUserProfile = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    token: generateToken(updatedUser._id),
  });
});

/* ============================
   CHANGE PASSWORD
============================ */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user || !(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Incorrect current password');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true });
});

/* ============================
   DELETE ACCOUNT
============================ */
export const deleteUserAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await Problem.deleteMany({ user: userId });
  await User.findByIdAndDelete(userId);

  res.json({ success: true });
});
