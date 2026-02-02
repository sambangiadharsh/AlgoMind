import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTodaysRevision, markProblemAsReviewed } from '../features/revision/revisionSlice.js';
import { getProblems } from '../features/problems/problemSlice.js';
import { getSettings } from '../features/settings/settingsSlice.js';
import Spinner from '../components/common/Spinner.jsx';
import Button from '../components/common/Button.jsx';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PlusCircle, Settings, RotateCcw } from 'lucide-react';

// Import components
import SessionHeader from '../components/revision/SessionHeader';
import ShortageExplanation from '../components/revision/ShortageExplanation';
import RevisionTable from '../components/revision/RevisionTable';
import CompletionCelebration from '../components/revision/CompletionCelebration';
import ErrorBoundary from '../components/revision/ErrorBoundary';

// Import utilities
import { getCurrentSettings } from '../utils/settingsHelpers';

const RevisionPage = () => {
     const dispatch = useDispatch();
     const { problems: revisionProblems, sessionId, isLoading, isError, message } = useSelector(state => state.revision);
     const { problems: allProblems, isLoading: problemsLoading } = useSelector(state => state.problems);
     const { settings } = useSelector(state => state.settings);
     const { user } = useSelector(state => state.auth);
     
     const [sessionStartTime, setSessionStartTime] = useState(null);
     const [showDebugInfo, setShowDebugInfo] = useState(false);
     const [hasFetchedRevision, setHasFetchedRevision] = useState(false);
     const [isInitialLoad, setIsInitialLoad] = useState(true);

     // Calculate derived values from revisionProblems
     const validRevisionProblems = revisionProblems ? revisionProblems.filter(problem => 
          problem && (problem.problem || problem._id)
     ) : [];

     const completedProblems = validRevisionProblems.filter(problem => 
          problem && problem.confidence !== null && problem.status === 'COMPLETED'
     );

     const completedCount = completedProblems.length;
     const isSessionCompleted = completedCount === validRevisionProblems.length && validRevisionProblems.length > 0;

     useEffect(() => {
          dispatch(getTodaysRevision()).then(() => {
               setHasFetchedRevision(true);
          });
          dispatch(getProblems());
          dispatch(getSettings());
     }, [dispatch]);

     useEffect(() => {
          if (validRevisionProblems.length > 0 && !sessionStartTime) {
               setSessionStartTime(new Date());
          }
     }, [validRevisionProblems, sessionStartTime]);
     
     const handleReview = (id, confidence, sessionId) => {
          dispatch(markProblemAsReviewed({ 
               id, 
               reviewData: { confidence, sessionId } 
          }))
          .unwrap()
          .then((response) => {
               toast.success(response.message || 'Progress saved!');
          })
          .catch((err) => {
               toast.error(err.message || 'Could not save progress.');
          });
     };

     const refreshRevisionList = () => {
          dispatch(getTodaysRevision());
          setSessionStartTime(new Date());
          setHasFetchedRevision(true);
     };

     const toggleDebugInfo = () => {
          setShowDebugInfo(!showDebugInfo);
     };

     // Calculate session duration
     const calculateSessionDuration = (startTime) => {
          const now = new Date();
          const diffMs = now - startTime;
          const diffMins = Math.floor(diffMs / 60000);
          const diffSecs = Math.floor((diffMs % 60000) / 1000);
          
          return `${diffMins}m ${diffSecs}s`;
     };

     // Get current settings
     const currentSettings = getCurrentSettings(settings);
     
     // Calculate requested problem count from settings
     const requestedCount = currentSettings.difficulty.easy + currentSettings.difficulty.medium + currentSettings.difficulty.hard;
     
     // Check if we have fewer problems than requested
     const hasShortage = validRevisionProblems.length > 0 && validRevisionProblems.length < requestedCount;

     // Improved logic for showing "No Problems Match Your Settings"
     const shouldShowNoMatchMessage = hasFetchedRevision && 
                                        !isLoading && 
                                        allProblems && 
                                        allProblems.length > 0 && 
                                        validRevisionProblems.length === 0;
     

     // Modify the loading logic
     useEffect(() => {
     if (isInitialLoad && hasFetchedRevision) {
          setIsInitialLoad(false);
     }
     }, [hasFetchedRevision, isInitialLoad]);

// Update the loading condition
if (isInitialLoad || isLoading) {
    return <Spinner />;
}

     if (isLoading || problemsLoading) {
          return <Spinner />;
     }
     if (!hasFetchedRevision && isLoading) {
          return <Spinner />;
     }

     if (isError) {
          return (
               <div className="text-center text-red-500 p-4">
                    <h2 className="text-xl font-semibold mb-2">Error</h2>
                    <p>{message}</p>
                    <Button onClick={refreshRevisionList} variant="secondary" className="mt-4">
                         Try Again
                    </Button>
               </div>
          );
     }

     if (allProblems && allProblems.length === 0) {
          return (
               <div className="text-center p-8">
                    <h1 className="text-3xl font-bold mb-4">Welcome to AlgoMind!</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                         You haven't added any problems yet. Add some to start your revision journey.
                    </p>
                    <Link to="/add-problem">
                         <Button variant="primary" className="flex items-center gap-2 mx-auto">
                         <PlusCircle size={20} />
                         Add Your First Problem
                         </Button>
                    </Link>
               </div>
          );
     }

     // Show "No Problems Match Your Settings" only when we've actually fetched revision data
     if (shouldShowNoMatchMessage) {
          return (
               <div className="text-center p-8">
                    <h1 className="text-3xl font-bold mb-4">No Problems Match Your Settings</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                         You have problems, but none match your current revision settings.
                    </p>
                    <p className="text-sm text-gray-500 mb-8">
                         Try adding more problems or adjusting your settings to see revision suggestions.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                         <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                         <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Current Settings</h3>
                         <div className="text-sm text-blue-700 dark:text-blue-300 text-left">
                              <p><span className="font-medium">Mode:</span> {currentSettings.mode}</p>
                              <p><span className="font-medium">Difficulty:</span> Easy: {currentSettings.difficulty.easy}, 
                                                                                Medium: {currentSettings.difficulty.medium}, 
                                                                                Hard: {currentSettings.difficulty.hard}</p>
                              {currentSettings.topics?.length > 0 && (
                                   <p><span className="font-medium">Topics:</span> {currentSettings.topics.join(', ')}</p>
                              )}
                              {currentSettings.companies?.length > 0 && (
                                   <p><span className="font-medium">Companies:</span> {currentSettings.companies.join(', ')}</p>
                              )}
                         </div>
                         </div>
                    </div>

                    <div className="space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:gap-4">
                         <Link to="/add-problem">
                         <Button variant="primary" className="flex items-center gap-2 w-full sm:w-auto">
                              <PlusCircle size={20} />
                              Add New Problems
                         </Button>
                         </Link>
                         <Link to="/settings">
                         <Button variant="secondary" className="flex items-center gap-2 w-full sm:w-auto">
                              <Settings size={20} />
                              Adjust Settings
                         </Button>
                         </Link>
                         <Button onClick={refreshRevisionList} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                         <RotateCcw size={20} />
                         Check Again
                         </Button>
                    </div>
               </div>
          );
     }

     if (validRevisionProblems.length === 0) {
          return (
               <div className="text-center p-8">
                    <h1 className="text-3xl font-bold mb-4">All Caught Up!</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                         You have no problems due for revision right now.
                    </p>
                    <p className="text-sm text-gray-500 mb-8">
                         New problems will appear when they're due for revision.
                    </p>
                    <div className="space-y-4">
                         <Button onClick={refreshRevisionList} variant="secondary" className="flex items-center gap-2 mx-auto">
                         <RotateCcw size={16} />
                         Check Again
                         </Button>
                         <Link to="/dashboard">
                         <Button variant="outline">Back to Dashboard</Button>
                         </Link>
                    </div>
               </div>
          );
     }

     return (
          <div className="p-4">
               {/* Display streak */}
               {user && (
                    <div className="text-center mb-6">
                         <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                         <span className="text-blue-800 dark:text-blue-200 font-medium">
                              🔥 Streak: {user.streak || 0} days
                         </span>
                         </div>
                    </div>
               )}
               
               <ErrorBoundary>
               <SessionHeader
                    title="Today's Revision Session"
                    completedCount={completedCount}
                    totalProblems={validRevisionProblems.length}
                    requestedCount={requestedCount}
                    isSessionCompleted={isSessionCompleted}
                    settings={currentSettings}
                    onShowDebug={toggleDebugInfo}
                    showDebugInfo={showDebugInfo}
                    onNewSession={refreshRevisionList}
               />
               </ErrorBoundary>
               
               {/* Show shortage explanation if applicable */}
               {hasShortage && (
                    <ErrorBoundary>
                    <ShortageExplanation 
                         settings={settings} 
                         allProblems={allProblems} 
                         revisionProblems={validRevisionProblems}
                         requestedCount={requestedCount}
                         isSessionCompleted={isSessionCompleted}
                    />
                    </ErrorBoundary>
               )}
               
               {/* Revision Table */}
               <ErrorBoundary>
               <RevisionTable
                    problems={validRevisionProblems}
                    onReview={handleReview}
                    sessionId={sessionId}
               />
               </ErrorBoundary>

               {/* Celebration */}
               {isSessionCompleted && (
                    <div className="mt-8">
                         <ErrorBoundary>
                         <CompletionCelebration
                         problemCount={validRevisionProblems.length}
                         problems={validRevisionProblems}
                         sessionDuration={sessionStartTime ? calculateSessionDuration(sessionStartTime) : null}
                         />
                         </ErrorBoundary>
                    </div>
               )}
          </div>
     );
};

export default RevisionPage;