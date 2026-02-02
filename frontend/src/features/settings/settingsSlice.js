import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import settingsService from '../../services/settingsService.js';

const initialState = {
  settings: null, isError: false, isSuccess: false, isLoading: false, message: '',
};

export const getSettings = createAsyncThunk('settings/get', async (_, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.userInfo.token; return await settingsService.getSettings(token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});
export const updateSettings = createAsyncThunk('settings/update', async (settingsData, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.userInfo.token; return await settingsService.updateSettings(settingsData, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSettings.pending, (state) => { state.isLoading = true; })
      .addCase(getSettings.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.settings = action.payload; })
      .addCase(getSettings.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
      .addCase(updateSettings.pending, (state) => { state.isLoading = true; })
      .addCase(updateSettings.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.settings = action.payload; })
      .addCase(updateSettings.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; });
  },
});
export const { reset } = settingsSlice.actions;
export default settingsSlice.reducer;