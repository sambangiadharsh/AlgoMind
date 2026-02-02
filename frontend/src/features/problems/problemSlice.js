import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import problemService from '../../services/problemService.js';

const initialState = {
  problems: [], problem: {}, isError: false, isSuccess: false, isLoading: false, 
  message: '', duplicateProblem: null, // Add duplicateProblem
};


export const createProblem = createAsyncThunk('problems/create', async (problemData, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.userInfo.token; return await problemService.createProblem(problemData, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});
export const getProblems = createAsyncThunk('problems/getAll', async (filters = {}, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.userInfo.token; return await problemService.getProblems(token, filters); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});
export const getProblem = createAsyncThunk('problems/get', async (problemId, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.userInfo.token; return await problemService.getProblem(problemId, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});
export const updateProblem = createAsyncThunk('problems/update', async (data, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.userInfo.token; return await problemService.updateProblem(data.id, data.problemData, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});
export const deleteProblem = createAsyncThunk('problems/delete', async (id, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.userInfo.token; return await problemService.deleteProblem(id, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});
export const deleteMultipleProblems = createAsyncThunk('problems/deleteMultiple', async (ids, thunkAPI) => {
    try { const token = thunkAPI.getState().auth.userInfo.token; return await problemService.deleteMultipleProblems(ids, token); } catch (error) { const message = (error.response?.data?.message) || error.message; return thunkAPI.rejectWithValue(message); }
});
export const checkProblemsInTodaysRevision = createAsyncThunk('problems/checkTodaysRevision', async (problemIds, thunkAPI) => {
    try { 
        const token = thunkAPI.getState().auth.userInfo.token; 
        return await problemService.checkProblemsInTodaysRevision(problemIds, token); 
    } catch (error) { 
        const message = (error.response?.data?.message) || error.message; 
        return thunkAPI.rejectWithValue(message); 
    }
});
export const checkProblemInTodaysRevision = createAsyncThunk('problems/checkProblemInTodaysRevision', async (problemId, thunkAPI) => {
    try { 
        const token = thunkAPI.getState().auth.userInfo.token; 
        return await problemService.checkProblemInTodaysRevision(problemId, token); 
    } catch (error) { 
        const message = (error.response?.data?.message) || error.message; 
        return thunkAPI.rejectWithValue(message); 
    }
});
export const checkDuplicateProblem = createAsyncThunk('problems/checkDuplicate', async (title, thunkAPI) => {
    try { 
        const token = thunkAPI.getState().auth.userInfo.token; 
        return await problemService.checkDuplicateProblem(title, token); 
    } catch (error) { 
        const message = (error.response?.data?.message) || error.message; 
        return thunkAPI.rejectWithValue(message); 
    }
});
export const problemSlice = createSlice({
     name: 'problem',
     initialState,
     reducers: {
     reset: (state) => initialState,
     updateRevisionSession: (state, action) => {
     }
     },
     extraReducers: (builder) => {
          builder
               .addCase(createProblem.pending, (state) => { state.isLoading = true; })
               .addCase(createProblem.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
               .addCase(getProblems.pending, (state) => { state.isLoading = true; })
               .addCase(getProblems.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.problems = action.payload.problems; })
               .addCase(getProblems.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
               .addCase(getProblem.pending, (state) => { state.isLoading = true; })
               .addCase(getProblem.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.problem = action.payload; })
               .addCase(getProblem.rejected, (state, action) => { state.isLoading = false; state.isError = true; state.message = action.payload; })
               .addCase(deleteProblem.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.problems = state.problems.filter((p) => p._id !== action.meta.arg); })
               .addCase(deleteMultipleProblems.pending, (state) => { state.isLoading = true; })
               .addCase(deleteMultipleProblems.fulfilled, (state, action) => { state.isLoading = false; state.isSuccess = true; state.problems = state.problems.filter((p) => !action.meta.arg.includes(p._id)); })
               .addCase(deleteProblem.rejected, (state, action) => {
               state.isLoading = false;
               state.isError = true;
               state.message = action.payload;
               })
               .addCase(deleteMultipleProblems.rejected, (state, action) => {
               state.isLoading = false;
               state.isError = true;
               state.message = action.payload;
               })
               .addCase(updateProblem.rejected, (state, action) => {state.isLoading = false; state.isError = true; state.message = action.payload;})
               .addCase(checkDuplicateProblem.fulfilled, (state, action) => {
               state.duplicateProblem = action.payload;
               })
               .addCase(checkDuplicateProblem.rejected, (state) => {
               state.duplicateProblem = null;
               })
               .addCase(createProblem.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          
          // Check if response includes session data
          if (action.payload.session) {
               // Dispatch an action to update the revision session
               // This will be handled by the revision slice
               state.revisionSession = action.payload.session;
          } else {
               // Normal response - just add the problem
               state.problems.push(action.payload.problem || action.payload);
          }
               })
               .addCase(updateProblem.fulfilled, (state, action) => {
               state.isLoading = false;
               state.isSuccess = true;
               
               // Check if response includes session data
               if (action.payload.session) {
                    // Dispatch an action to update the revision session
                    state.revisionSession = action.payload.session;
               } else {
                    // Normal response - just update the problem
                    state.problem = action.payload.problem || action.payload;
                    const index = state.problems.findIndex(p => p._id === action.payload._id);
                    if (index !== -1) {
                    state.problems[index] = action.payload.problem || action.payload;
                    }
               }
               });
          },
});
export const { reset } = problemSlice.actions;
export default problemSlice.reducer;
