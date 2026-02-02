import React, { useState } from 'react';
import RevisionCard from './RevisionCard';
import { Filter, Search, Grid, List, ChevronDown, ChevronUp } from 'lucide-react';

const RevisionTable = ({ problems = [], onReview, sessionId }) => {
    const validProblems = Array.isArray(problems) ? problems : [];
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Filter and sort problems
    const filteredAndSortedProblems = validProblems
        .filter(problem => {
            const p = problem.problem || problem;
            const matchesStatus = filterStatus === 'ALL' || 
                                (filterStatus === 'COMPLETED' && problem.confidence !== null) ||
                                (filterStatus === 'PENDING' && problem.confidence === null);
            
            const matchesSearch = p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 p.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                 p.companyTags?.some(company => company.toLowerCase().includes(searchTerm.toLowerCase()));
            
            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            if (!sortConfig.key) return 0;
            
            const aValue = sortConfig.key === 'confidence' ? a[sortConfig.key] : (a.problem || a)[sortConfig.key];
            const bValue = sortConfig.key === 'confidence' ? b[sortConfig.key] : (b.problem || b)[sortConfig.key];
            
            if (aValue === bValue) return 0;
            
            if (sortConfig.direction === 'ascending') {
                return aValue < bValue ? -1 : 1;
            } else {
                return aValue > bValue ? -1 : 1;
            }
        });

    const statusCounts = {
        ALL: validProblems.length,
        COMPLETED: validProblems.filter(p => p.confidence !== null).length,
        PENDING: validProblems.filter(p => p.confidence === null).length
    };

    const confidenceCounts = {
        MASTERED: validProblems.filter(p => p.confidence === 'MASTERED').length,
        LESS_CONFIDENT: validProblems.filter(p => p.confidence === 'LESS_CONFIDENT').length,
        FORGOT: validProblems.filter(p => p.confidence === 'FORGOT').length
    };

    const completionPercentage = validProblems.length > 0 
        ? Math.round((statusCounts.COMPLETED / validProblems.length) * 100) 
        : 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            {/* Header with Stats and Controls */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Progress Stats */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Today's Revision
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-16 relative">
                                    <svg className="w-full h-full" viewBox="0 0 36 36">
                                        <path
                                            d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#E5E7EB"
                                            strokeWidth="3"
                                        />
                                        <path
                                            d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="#4F46E5"
                                            strokeWidth="3"
                                            strokeDasharray={`${completionPercentage}, 100`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-sm font-bold text-gray-800 dark:text-white">
                                            {completionPercentage}%
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                        {statusCounts.COMPLETED}/{validProblems.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search problems..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                         bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64"
                            />
                        </div>
                        
                        {/* View Toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'grid'
                                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                                title="Grid view"
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === 'list'
                                        ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                                title="List view"
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="mt-6">
                    <button
                        onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    >
                        <Filter size={16} />
                        <span>Filters</span>
                        {isFiltersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {isFiltersOpen && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Status Filter */}
                                <div>
                                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">Status</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['ALL', 'COMPLETED', 'PENDING'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setFilterStatus(status)}
                                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                                    filterStatus === status
                                                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                                                }`}
                                            >
                                                {status} ({statusCounts[status]})
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Confidence Level Stats */}
                                <div>
                                    <h3 className="font-medium text-gray-800 dark:text-white mb-3">Confidence Levels</h3>
                                    <div className="space-y-2">
                                        {Object.entries(confidenceCounts).map(([level, count]) => (
                                            <div key={level} className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                                    {level.toLowerCase().replace('_', ' ')}:
                                                </span>
                                                <span className="text-sm font-medium text-gray-800 dark:text-white">
                                                    {count}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Problems Grid/List */}
            <div className="p-6">
                {filteredAndSortedProblems.length > 0 ? (
                    <div className={viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                        : "space-y-4"
                    }>
                        {filteredAndSortedProblems.map(problem => (
                            <RevisionCard
                                key={problem._id || problem.problem?._id}
                                problem={problem.problem || problem}
                                onReview={onReview}
                                reviewStatus={problem.confidence}
                                sessionId={sessionId}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <Search size={48} className="mb-4 opacity-50" />
                            <p className="text-lg font-medium mb-2">No problems found</p>
                            <p className="text-sm">
                                {searchTerm || filterStatus !== 'ALL' 
                                    ? 'Try adjusting your search or filters'
                                    : 'No problems available for revision'
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            {filteredAndSortedProblems.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                            Showing {filteredAndSortedProblems.length} of {validProblems.length} problems
                        </div>
                        <div className="flex items-center gap-4">
                            {filterStatus !== 'ALL' && (
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-full text-xs">
                                    {filterStatus}
                                </span>
                            )}
                            {searchTerm && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                                    Search: "{searchTerm}"
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevisionTable;