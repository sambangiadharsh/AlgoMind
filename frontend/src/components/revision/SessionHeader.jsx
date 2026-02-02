import React from 'react';
import { Clock, Info, CheckCircle, PlusCircle, Settings as SettingsIcon } from 'lucide-react';
import Button from '/src/components/common/Button.jsx';
import { Link } from 'react-router-dom';

const SessionHeader = ({ 
    title, 
    completedCount, 
    totalProblems, 
    requestedCount, 
    isSessionCompleted, 
    settings = {}, 
    onShowDebug, 
    showDebugInfo,
    onNewSession
}) => {
    const hasShortage = totalProblems > 0 && totalProblems < requestedCount;
    const safeSettings = settings || {};

    return (
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                {completedCount} of {totalProblems} problems completed
                {hasShortage && ` (requested: ${requestedCount})`}
                {isSessionCompleted && " - Session Completed!"}
            </p>
            
            {/* Priority Explanation - Only show if session is not completed
            {!isSessionCompleted && (
                <div className="mt-4 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg max-w-2xl mx-auto">
                    <h3 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2 flex items-center justify-center gap-2">
                        <Info size={18} />
                        How problems are ordered:
                    </h3>
                    <ul className="text-sm text-indigo-700 dark:text-indigo-300 text-left list-disc pl-5 space-y-1">
                        <li>Older problems come first (by creation date)</li>
                        <li>New problems (Pending) get priority over revisiting problems</li>
                        <li>Revisiting problems get priority over mastered ones</li>
                        <li>Within same status, shorter intervals come first</li>
                    </ul>
                </div>
            )} */}

            {/* Session Info */}
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* <div className="flex items-center gap-2">
                        <Clock size={20} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                            {isSessionCompleted ? "Session completed" : "Active session"}
                        </span>
                    </div> */}
                    <div className="flex items-center gap-2">
                         {isSessionCompleted ? (
                         <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                         ) : (
                         <Clock size={20} className="text-blue-600 dark:text-blue-400" />
                         )}
                         <span
                         className={`text-sm font-medium ${
                              isSessionCompleted
                              ? "text-green-800 dark:text-green-300"
                              : "text-blue-800 dark:text-blue-300"
                         }`}
                         >
                         {isSessionCompleted ? "Session completed" : "Active session"}
                         </span>
                    </div>
                                             
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                        <span className="font-medium">Mode:</span> {safeSettings.mode || 'RANDOM'}
                        {safeSettings.topics?.length > 0 && (
                            <span> • {safeSettings.topics.length} topics</span>
                        )}
                        {safeSettings.companies?.length > 0 && (
                            <span> • {safeSettings.companies.length} companies</span>
                        )}
                    </div>
                </div>
            </div>

            {!isSessionCompleted && (
                <div className="mt-4 flex justify-center gap-4 flex-wrap">
                    {/* <Button 
                        onClick={onNewSession} 
                        variant="outline" 
                        className="flex items-center gap-2"
                    >
                        <RotateCcw size={16} />
                        New Session
                    </Button> */}
                    <Link to="/add-problem">
                        <Button variant="primary" className="flex items-center gap-2">
                            <PlusCircle size={16} />
                            Add Problems
                        </Button>
                    </Link>
                    <Link to="/settings">
                        <Button variant="secondary" className="flex items-center gap-2">
                            <SettingsIcon size={16} />
                            Settings
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default SessionHeader;