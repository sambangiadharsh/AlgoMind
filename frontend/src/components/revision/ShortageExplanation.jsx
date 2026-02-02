// import React, { useState } from 'react';
// import { AlertCircle, Filter, Tag, Building } from 'lucide-react';

// const ShortageExplanation = ({ 
//     settings = {}, 
//     allProblems = [], 
//     revisionProblems = [], 
//     requestedCount,
//     isSessionCompleted 
// }) => {
//     const [showDetails, setShowDetails] = useState(false);
    
//     // Calculate shortage by difficulty
//     const shortageByDifficulty = {
//         Easy: Math.max(0, (settings.difficultyDistribution?.easy || 0) - 
//             revisionProblems.filter(p => p.problem?.difficulty === 'Easy' || p.difficulty === 'Easy').length),
//         Medium: Math.max(0, (settings.difficultyDistribution?.medium || 0) - 
//             revisionProblems.filter(p => p.problem?.difficulty === 'Medium' || p.difficulty === 'Medium').length),
//         Hard: Math.max(0, (settings.difficultyDistribution?.hard || 0) - 
//             revisionProblems.filter(p => p.problem?.difficulty === 'Hard' || p.difficulty === 'Hard').length)
//     };
    
//     // Calculate available problems by difficulty
//     const availableByDifficulty = {
//         Easy: allProblems.filter(p => p.difficulty === 'Easy' && p.status !== 'Mastered' && !p.isArchived).length,
//         Medium: allProblems.filter(p => p.difficulty === 'Medium' && p.status !== 'Mastered' && !p.isArchived).length,
//         Hard: allProblems.filter(p => p.difficulty === 'Hard' && p.status !== 'Mastered' && !p.isArchived).length
//     };
    
//     // Get the actual selected tags/companies from settings
//     const selectedTags = settings.customRevisionTopics || [];
//     const selectedCompanies = settings.customRevisionCompanies || [];

//     return (
//         <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
//             <div className="flex items-start gap-3">
//                 <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
//                 <div className="flex-1">
//                     <h3 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
//                         Fewer problems than requested in your settings
//                     </h3>
                    
//                     {isSessionCompleted ? (
//                         <div className="text-yellow-700 dark:text-yellow-300 text-sm">
//                             <p className="mb-2">
//                                 You've already completed today's revision session. Changes to your settings 
//                                 will only affect future revision sessions, not today's completed session.
//                             </p>
//                             <p>
//                                 Today's session had {revisionProblems.length} problems out of {requestedCount} requested.
//                             </p>
//                         </div>
//                     ) : (
//                         <>
//                             <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
//                                 You requested {requestedCount} problems but only {revisionProblems.length} are available 
//                                 based on your current settings.
//                             </p>
                            
//                             <button 
//                                 onClick={() => setShowDetails(!showDetails)}
//                                 className="text-yellow-700 dark:text-yellow-300 text-sm font-medium hover:underline mb-2"
//                             >
//                                 {showDetails ? 'Hide details' : 'Show details and suggestions'}
//                             </button>
                            
//                             {showDetails && (
//                                 <div className="mt-3 space-y-4">
//                                     {/* Difficulty Shortage */}
//                                     <div>
//                                         <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2 flex items-center gap-2">
//                                             <Filter size={16} />
//                                             By Difficulty:
//                                         </h4>
//                                         <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
//                                             {['Easy', 'Medium', 'Hard'].map(difficulty => (
//                                                 <div key={difficulty} className="bg-white dark:bg-gray-800 p-2 rounded">
//                                                     <div className="font-medium">{difficulty}:</div>
//                                                     <div className="text-yellow-700 dark:text-yellow-300">
//                                                         Requested: {settings.difficultyDistribution?.[difficulty.toLowerCase()] || 0}
//                                                     </div>
//                                                     <div className="text-yellow-700 dark:text-yellow-300">
//                                                         Available: {availableByDifficulty[difficulty]}
//                                                     </div>
//                                                     {shortageByDifficulty[difficulty] > 0 && (
//                                                         <div className="text-red-600 dark:text-red-400 font-medium">
//                                                             Shortage: {shortageByDifficulty[difficulty]}
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
                                    
//                                     {/* Mode-specific suggestions */}
//                                     {settings.revisionMode !== 'RANDOM' && (
//                                         <div>
//                                             <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2 flex items-center gap-2">
//                                                 {settings.revisionMode === 'TOPIC' || settings.revisionMode === 'COMBO' ? (
//                                                     <Tag size={16} />
//                                                 ) : (
//                                                     <Building size={16} />
//                                                 )}
//                                                 {settings.revisionMode === 'TOPIC' && 'By Topics:'}
//                                                 {settings.revisionMode === 'COMPANY' && 'By Companies:'}
//                                                 {settings.revisionMode === 'COMBO' && 'By Topics & Companies:'}
//                                             </h4>
//                                             <div className="text-sm text-yellow-700 dark:text-yellow-300">
//                                                 {/* Show topics for TOPIC or COMBO mode */}
//                                                 {(settings.revisionMode === 'TOPIC' || settings.revisionMode === 'COMBO') && selectedTags.length > 0 && (
//                                                     <>
//                                                         <p className="mb-2">You've filtered by these topics:</p>
//                                                         <div className="flex flex-wrap gap-2 mb-3">
//                                                             {selectedTags.map(tag => (
//                                                                 <span key={tag} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">
//                                                                     {tag}
//                                                                 </span>
//                                                             ))}
//                                                         </div>
//                                                         <p>Only problems with these tags are included in your revision.</p>
//                                                     </>
//                                                 )}
                                                
//                                                 {/* Show companies for COMPANY or COMBO mode */}
//                                                 {(settings.revisionMode === 'COMPANY' || settings.revisionMode === 'COMBO') && selectedCompanies.length > 0 && (
//                                                     <>
//                                                         <p className="mt-3 mb-2">You've filtered by these companies:</p>
//                                                         <div className="flex flex-wrap gap-2 mb-3">
//                                                             {selectedCompanies.map(company => (
//                                                                 <span key={company} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">
//                                                                     {company}
//                                                                 </span>
//                                                             ))}
//                                                         </div>
//                                                         <p>Only problems from these companies are included in your revision.</p>
//                                                     </>
//                                                 )}
                                                
//                                                 {/* Show message if no filters are selected in COMBO mode */}
//                                                 {settings.revisionMode === 'COMBO' && selectedTags.length === 0 && selectedCompanies.length === 0 && (
//                                                     <p>COMBO mode is selected but no topics or companies are filtered.</p>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     )}
                                    
//                                     {/* Suggestions */}
//                                     <div>
//                                         <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
//                                             Suggestions:
//                                         </h4>
//                                         <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc pl-5">
//                                             <li>Add more problems with the specific criteria you've set</li>
//                                             <li>Adjust your difficulty distribution in settings</li>
//                                             <li>Change your revision mode to include more problems</li>
//                                             {/* <li>Mark some mastered problems as needing revision</li> */}
//                                             {settings.revisionMode === 'COMBO' && (
//                                                 <li>Try using only TOPIC or only COMPANY mode instead of COMBO</li>
//                                             )}
//                                         </ul>
//                                     </div>
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ShortageExplanation;


import React, { useState } from 'react';
import { AlertCircle, Filter, Tag, Building } from 'lucide-react';

const ShortageExplanation = ({ 
  settings,
  allProblems = [], 
  revisionProblems = [], 
  requestedCount,
  isSessionCompleted 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // ✅ Safe fallback for null/undefined settings
  const safeSettings = settings || {};
  const difficultyDistribution = safeSettings.difficultyDistribution || { easy: 0, medium: 0, hard: 0 };
  const revisionMode = safeSettings.revisionMode || 'RANDOM';
  const selectedTags = safeSettings.customRevisionTopics || [];
  const selectedCompanies = safeSettings.customRevisionCompanies || [];

  // ✅ Calculate shortage by difficulty
  const shortageByDifficulty = {
    Easy: Math.max(0, (difficultyDistribution.easy || 0) -
      revisionProblems.filter(p => p.problem?.difficulty === 'Easy' || p.difficulty === 'Easy').length),
    Medium: Math.max(0, (difficultyDistribution.medium || 0) -
      revisionProblems.filter(p => p.problem?.difficulty === 'Medium' || p.difficulty === 'Medium').length),
    Hard: Math.max(0, (difficultyDistribution.hard || 0) -
      revisionProblems.filter(p => p.problem?.difficulty === 'Hard' || p.difficulty === 'Hard').length)
  };

  // ✅ Calculate available problems
  const availableByDifficulty = {
    Easy: allProblems.filter(p => p.difficulty === 'Easy' && p.status !== 'Mastered' && !p.isArchived).length,
    Medium: allProblems.filter(p => p.difficulty === 'Medium' && p.status !== 'Mastered' && !p.isArchived).length,
    Hard: allProblems.filter(p => p.difficulty === 'Hard' && p.status !== 'Mastered' && !p.isArchived).length
  };

  // ✅ If no shortage and session not completed → hide
  const totalShortage = Object.values(shortageByDifficulty).reduce((sum, val) => sum + val, 0);
  if (totalShortage === 0 && !isSessionCompleted) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">
            Fewer problems than requested in your settings
          </h3>

          {isSessionCompleted ? (
            <div className="text-yellow-700 dark:text-yellow-300 text-sm">
              <p className="mb-2">
                You've already completed today's revision session. Changes to your settings 
                will only affect future revision sessions, not today's completed session.
              </p>
              <p>
                Today's session had {revisionProblems.length} problems out of {requestedCount} requested.
              </p>
            </div>
          ) : (
            <>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
                You requested {requestedCount} problems but only {revisionProblems.length} are available 
                based on your current settings.
              </p>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-yellow-700 dark:text-yellow-300 text-sm font-medium hover:underline mb-2"
              >
                {showDetails ? 'Hide details' : 'Show details and suggestions'}
              </button>

              {showDetails && (
                <div className="mt-3 space-y-4">
                  {/* Difficulty shortage */}
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2 flex items-center gap-2">
                      <Filter size={16} />
                      By Difficulty:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      {['Easy', 'Medium', 'Hard'].map(difficulty => (
                        <div key={difficulty} className="bg-white dark:bg-gray-800 p-2 rounded">
                          <div className="font-medium">{difficulty}:</div>
                          <div className="text-yellow-700 dark:text-yellow-300">
                            Requested: {difficultyDistribution[difficulty.toLowerCase()] || 0}
                          </div>
                          <div className="text-yellow-700 dark:text-yellow-300">
                            Available: {availableByDifficulty[difficulty]}
                          </div>
                          {shortageByDifficulty[difficulty] > 0 && (
                            <div className="text-red-600 dark:text-red-400 font-medium">
                              Shortage: {shortageByDifficulty[difficulty]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mode-specific filters */}
                  {revisionMode !== 'RANDOM' && (
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2 flex items-center gap-2">
                        {revisionMode === 'TOPIC' || revisionMode === 'COMBO' ? <Tag size={16} /> : <Building size={16} />}
                        {revisionMode === 'TOPIC' && 'By Topics:'}
                        {revisionMode === 'COMPANY' && 'By Companies:'}
                        {revisionMode === 'COMBO' && 'By Topics & Companies:'}
                      </h4>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        {(revisionMode === 'TOPIC' || revisionMode === 'COMBO') && selectedTags.length > 0 && (
                          <>
                            <p className="mb-2">You've filtered by these topics:</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {selectedTags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p>Only problems with these tags are included in your revision.</p>
                          </>
                        )}

                        {(revisionMode === 'COMPANY' || revisionMode === 'COMBO') && selectedCompanies.length > 0 && (
                          <>
                            <p className="mt-3 mb-2">You've filtered by these companies:</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {selectedCompanies.map(company => (
                                <span key={company} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">
                                  {company}
                                </span>
                              ))}
                            </div>
                            <p>Only problems from these companies are included in your revision.</p>
                          </>
                        )}

                        {revisionMode === 'COMBO' && selectedTags.length === 0 && selectedCompanies.length === 0 && (
                          <p>COMBO mode is selected but no topics or companies are filtered.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">Suggestions:</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc pl-5">
                      <li>Add more problems with the specific criteria you've set</li>
                      <li>Adjust your difficulty distribution in settings</li>
                      <li>Change your revision mode to include more problems</li>
                      {revisionMode === 'COMBO' && <li>Try using only TOPIC or only COMPANY mode instead of COMBO</li>}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShortageExplanation;
