import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import statsService from '../../services/statsService.js';

const initialState = {
  stats: null, isError: false, isSuccess: false, isLoading: false, message: '',
};

export const getStats = createAsyncThunk('stats/get', async (_, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.userInfo.token; return await statsService.getStats(token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStats.pending, (state) => { state.isLoading = true; })
      .addCase(getStats.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.stats = action.payload; })
      .addCase(getStats.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; });
  },
});
export const { reset } = statsSlice.actions;
export default statsSlice.reducer;