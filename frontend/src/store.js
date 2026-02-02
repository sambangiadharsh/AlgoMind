// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './features/auth/authSlice';
// import {statsReducer} from './features/stats/statsSlice';
// import {problemReducer} from './features/problems/problemSlice';
// import {revisionReducer} from './features/revision/revisionSlice';
// import {settingsReducer} from './features/settings/settingsSlice'; // Import

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     stats: statsReducer,
//     problems: problemReducer,
//     revision: revisionReducer,
//     settings: settingsReducer, // Add reducer
//   },
// });

// export default store;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice.js';
import statsReducer from './features/stats/statsSlice.js';
import problemReducer from './features/problems/problemSlice.js';
import revisionReducer from './features/revision/revisionSlice.js';
import settingsReducer from './features/settings/settingsSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    stats: statsReducer,
    problems: problemReducer,
    revision: revisionReducer,
    settings: settingsReducer,
  },
});

export default store;