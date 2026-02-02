import React, { useEffect, useState } from 'react';
import { Trophy, Star, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const CompletionCelebration = ({ problemCount, problems = [], sessionDuration }) => {
    const [stats, setStats] = useState(null);

    // Safely filter problems
    const validProblems = Array.isArray(problems) ? problems : [];
    
    // Calculate stats
    useEffect(() => {
        const easyCount = validProblems.filter(p => p.problem?.difficulty === 'Easy' || p.difficulty === 'Easy').length;
        const mediumCount = validProblems.filter(p => p.problem?.difficulty === 'Medium' || p.difficulty === 'Medium').length;
        const hardCount = validProblems.filter(p => p.problem?.difficulty === 'Hard' || p.difficulty === 'Hard').length;
        
        const masteredCount = validProblems.filter(p => p.confidence === 'MASTERED').length;
        const shakyCount = validProblems.filter(p => p.confidence === 'LESS_CONFIDENT').length;
        const forgotCount = validProblems.filter(p => p.confidence === 'FORGOT').length;

        setStats({
            easy: easyCount,
            medium: mediumCount,
            hard: hardCount,
            mastered: masteredCount,
            shaky: shakyCount,
            forgot: forgotCount
        });
    }, [problems]);

    if (!stats) return null;

    return (
        <div className="relative overflow-hidden">
            <div className="relative z-10 text-center p-8 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-green-200 dark:border-green-700/50">
                {/* Main celebration content */}
                <div className="relative">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg mb-6">
                        <div className="p-4 bg-white dark:bg-gray-900 rounded-full">
                            <Trophy className="h-16 w-16 text-yellow-500" />
                        </div>
                    </div>
                    
                    <div className="mb-2">
                        <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full mb-4">
                            <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                            <span className="text-green-800 dark:text-green-300 font-medium">Session Completed!</span>
                        </div>
                    </div>

                    <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
                        Amazing Work!
                    </h3>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        You've successfully completed all {problemCount} problems in today's revision session. 
                        Keep up the great momentum!
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
                        {/* Difficulty Stats */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <TrendingUp size={18} />
                                Difficulty Breakdown
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-green-600 dark:text-green-400 font-medium">Easy</span>
                                    <span className="text-2xl font-bold text-gray-800 dark:text-white">{stats.easy}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full" 
                                        style={{ width: `${(stats.easy / problemCount) * 100}%` }}
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">Medium</span>
                                    <span className="text-2xl font-bold text-gray-800 dark:text-white">{stats.medium}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-yellow-500 h-2 rounded-full" 
                                        style={{ width: `${(stats.medium / problemCount) * 100}%` }}
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-red-600 dark:text-red-400 font-medium">Hard</span>
                                    <span className="text-2xl font-bold text-gray-800 dark:text-white">{stats.hard}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-red-500 h-2 rounded-full" 
                                        style={{ width: `${(stats.hard / problemCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Confidence Stats */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <Star size={18} />
                                Confidence Levels
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-green-600 dark:text-green-400 font-medium">Mastered</span>
                                    <span className="text-2xl font-bold text-gray-800 dark:text-white">{stats.mastered}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full" 
                                        style={{ width: `${(stats.mastered / problemCount) * 100}%` }}
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">Shaky</span>
                                    <span className="text-2xl font-bold text-gray-800 dark:text-white">{stats.shaky}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-yellow-500 h-2 rounded-full" 
                                        style={{ width: `${(stats.shaky / problemCount) * 100}%` }}
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-red-600 dark:text-red-400 font-medium">Forgot</span>
                                    <span className="text-2xl font-bold text-gray-800 dark:text-white">{stats.forgot}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className="bg-red-500 h-2 rounded-full" 
                                        style={{ width: `${(stats.forgot / problemCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Session Duration */}
                    {/* {sessionDuration && (
                        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-6">
                            <Clock size={18} />
                            <span>Session duration: {sessionDuration}</span>
                        </div>
                    )} */}

                    {/* Motivational quote */}
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic text-center">
                            "Consistency is the key to mastery. Every problem solved brings you one step closer to your goals."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletionCelebration;