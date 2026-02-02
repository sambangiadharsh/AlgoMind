import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { toast } from 'react-hot-toast';

const userInfoFromStorage = JSON.parse(localStorage.getItem('userInfo'));

const initialState = {
  userInfo: userInfoFromStorage || null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

/* ============================
   REGISTER
============================ */
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const data = await authService.register(userData);
      toast.success('Registration successful');
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ============================
   LOGIN
============================ */
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ============================
   UPDATE PROFILE
============================ */
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const data = await authService.updateUser(userData, token);
      toast.success('Profile updated');
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Update failed';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ============================
   CHANGE PASSWORD
============================ */
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const data = await authService.changePassword(passwordData, token);
      toast.success('Password changed successfully');
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ============================
   DELETE ACCOUNT
============================ */
export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userInfo.token;
      const data = await authService.deleteUser(token);
      toast.success('Account deleted');
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Delete account failed';
      toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/* ============================
   LOGOUT
============================ */
export const logout = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});

/* ============================
   SLICE
============================ */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.userInfo = null;
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // CHANGE PASSWORD
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // DELETE USER
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userInfo = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
