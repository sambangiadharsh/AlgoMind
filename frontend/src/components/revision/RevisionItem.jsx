import React, { useState } from 'react';
import { Check, X, Edit, Calendar, Info, Notebook, ExternalLink } from 'lucide-react';
import Button from '/src/components/common/Button.jsx';
import NotesModal from './NotesModal';
import { getStatusInfo, formatDate, getDifficultyColor, getDifficultyBgColor } from '/src/utils/helpers';

const RevisionItem = ({ problem, onReview, reviewStatus, sessionId }) => {
    const [showConfidence, setShowConfidence] = useState(false);
    const [isNotesModalOpen, setNotesModalOpen] = useState(false);
    const isReviewed = reviewStatus !== null;

    // Check if problem is valid
    if (!problem) {
        return (
            <tr className="bg-red-50 dark:bg-red-900/20">
                <td colSpan="5" className="p-4 text-center text-red-500">
                    Problem data is missing or was deleted
                </td>
            </tr>
        );
    }

    const handleConfidenceClick = (confidence) => {
        onReview(problem._id, confidence, sessionId);
        setShowConfidence(false);
    };

    const handleEditClick = () => {
        setShowConfidence(true);
    };

    const getStatusBadge = () => {
        switch (reviewStatus) {
            case 'MASTERED':
                return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-300">Mastered</span>;
            case 'LESS_CONFIDENT':
                return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900 dark:text-yellow-300">Shaky</span>;
            case 'FORGOT':
                return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-300">Forgot</span>;
            default:
                return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-300">Pending</span>;
        }
    };

    const statusInfo = getStatusInfo(problem.status);

    return (
        <>
            <tr className={`transition-all duration-200 ${isReviewed ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} hover:bg-gray-100 dark:hover:bg-gray-800`}>
                {/* Status Column */}
                <td className="p-4 text-center">
                    <div className="flex items-center justify-center">
                        {isReviewed ? (
                            <Check className="h-5 w-5 text-green-500" />
                        ) : (
                            <div 
                                onClick={() => setShowConfidence(true)}
                                className="w-5 h-5 border-2 border-gray-300 rounded cursor-pointer hover:border-indigo-500 transition-colors"
                            />
                        )}
                    </div>
                </td>
                
                {/* Problem Column */}
                <td className="px-6 py-4">
                    <div>
                        <div className="flex items-start gap-2">
                            <a 
                                href={problem.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:underline font-medium text-gray-900 dark:text-white flex items-center gap-1"
                                title="Open problem link"
                            >
                                {problem.title}
                                <ExternalLink size={14} className="text-gray-400" />
                            </a>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            {/* Tags */}
                            {problem.tags?.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                                    {tag}
                                </span>
                            ))}
                            {problem.tags?.length > 2 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    +{problem.tags.length - 2} more
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <Calendar size={12} />
                            <span>Added: {formatDate(problem.createdAt)}</span>
                        </div>
                    </div>
                </td>
                
                {/* Difficulty Column */}
                <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBgColor(problem.difficulty)} ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty || 'Unknown'}
                    </span>
                </td>
                
                {/* Notes Column - Hidden on mobile */}
                <td className="px-6 py-4 text-center hidden sm:table-cell">
                    <button 
                        onClick={() => setNotesModalOpen(true)} 
                        className="p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                        title="View notes"
                    >
                        <Notebook size={18} />
                    </button>
                </td>
                
                {/* Actions Column */}
                <td className="px-6 py-4">
                    {showConfidence ? (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                            <div className="flex gap-2">
                                <Button 
                                    onClick={() => handleConfidenceClick('FORGOT')} 
                                    variant={reviewStatus === 'FORGOT' ? 'primary' : 'outline'} 
                                    className="!px-2 !py-1 text-xs"
                                    size="sm"
                                >
                                    Forgot
                                </Button>
                                <Button 
                                    onClick={() => handleConfidenceClick('LESS_CONFIDENT')} 
                                    variant={reviewStatus === 'LESS_CONFIDENT' ? 'primary' : 'outline'} 
                                    className="!px-2 !py-1 text-xs"
                                    size="sm"
                                >
                                    Shaky
                                </Button>
                                <Button 
                                    onClick={() => handleConfidenceClick('MASTERED')} 
                                    variant={reviewStatus === 'MASTERED' ? 'primary' : 'outline'} 
                                    className="!px-2 !py-1 text-xs"
                                    size="sm"
                                >
                                    Mastered
                                </Button>
                            </div>
                            <button 
                                onClick={() => setShowConfidence(false)} 
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                title="Cancel"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-center">
                                {getStatusBadge()}
                            </div>
                            {isReviewed && (
                                <button 
                                    onClick={handleEditClick}
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                    title="Edit confidence level"
                                >
                                    <Edit size={12} />
                                    Change
                                </button>
                            )}
                        </div>
                    )}
                </td>
            </tr>
            <NotesModal isOpen={isNotesModalOpen} onClose={() => setNotesModalOpen(false)} notes={problem.notes} />
        </>
    );
};

export default RevisionItem;