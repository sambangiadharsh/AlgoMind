import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import revisionService from '../../services/revisionService.js';

const initialState = {
  problems: [], 
  sessionId: null,
  currentProblemIndex: 0, 
  isError: false, 
  isSuccess: false, 
  isLoading: false, 
  message: '',
};

export const getTodaysRevision = createAsyncThunk('revision/getToday', async (_, thunkAPI) => {
    try { 
        const token = thunkAPI.getState().auth.userInfo.token; 
        const response = await revisionService.getTodaysRevision(token);
        return response;
    } catch (error) { 
        const message = (error.response?.data?.message) || error.message; 
        return thunkAPI.rejectWithValue(message); 
    }
});

export const markProblemAsReviewed = createAsyncThunk('revision/review', async (data, thunkAPI) => {
    try { 
        const token = thunkAPI.getState().auth.userInfo.token; 
        return await revisionService.markProblemAsReviewed(data.id, data.reviewData, token); 
    } catch (error) { 
        const message = (error.response?.data?.message) || error.message; 
        return thunkAPI.rejectWithValue(message); 
    }
});


export const revisionSlice = createSlice({
  name: 'revision',
  initialState,
     reducers: {
     reset: (state) => initialState,
     goToNextProblem: (state) => { state.currentProblemIndex += 1; },
     // Removed resetReviewStatus action
     filterInvalidProblems: (state) => {
          state.problems = state.problems.filter(problem => 
          problem && (problem.problem || problem._id)
          );
     },
     updateSessionFromProblem: (state, action) => {
      const { session } = action.payload;
      state.problems = session.problems || [];
      state.sessionId = session._id;
      // Keep the current problem index if possible
      if (state.currentProblemIndex >= state.problems.length) {
        state.currentProblemIndex = Math.max(0, state.problems.length - 1);
      }
    }
     },
     extraReducers: (builder) => {
     builder
          .addCase(getTodaysRevision.pending, (state) => { 
               state.isLoading = true; 
          })
          .addCase(getTodaysRevision.fulfilled, (state, action) => { 
               state.isLoading = false; 
               state.isSuccess = true; 
               state.problems = action.payload.problems || [];
               state.sessionId = action.payload.sessionId;
               state.currentProblemIndex = 0;
          })
          .addCase(getTodaysRevision.rejected, (state, action) => { 
               state.isLoading = false; 
               state.isError = true; 
               state.message = action.payload; 
          })
          .addCase(markProblemAsReviewed.pending, (state) => {
               state.isLoading = true;
          })
          .addCase(markProblemAsReviewed.fulfilled, (state, action) => {
               state.isLoading = false;
               state.isSuccess = true;
               
               // Handle different response structures
               const updatedProblem = action.payload.updatedProblem || action.payload;
               const problemId = updatedProblem._id || updatedProblem.problem?._id;
               
               if (problemId) {
               state.problems = state.problems.map(problem => {
               const currentProblemId = problem._id || problem.problem?._id;
               return currentProblemId === problemId ? updatedProblem : problem;
               });
               }
          })
          .addCase(markProblemAsReviewed.rejected, (state, action) => {
               state.isLoading = false;
               state.isError = true;
               state.message = action.payload;
          });
     },
});

export const { reset, goToNextProblem, filterInvalidProblems, updateSessionFromProblem } = revisionSlice.actions;
export default revisionSlice.reducer;