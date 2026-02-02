import React, { useState } from 'react';
import { Check, X, Edit, Calendar, Clock, ExternalLink, Star, MessageSquare } from 'lucide-react';
import Button from '/src/components/common/Button.jsx';
import NotesModal from './NotesModal';
import { getStatusInfo, formatDate, getDifficultyColor, getDifficultyBgColor } from '/src/utils/helpers';

const RevisionCard = ({ problem, onReview, reviewStatus, sessionId, viewMode = 'grid' }) => {
    const [showConfidence, setShowConfidence] = useState(false);
    const [isNotesModalOpen, setNotesModalOpen] = useState(false);
    const isReviewed = reviewStatus !== null;

    if (!problem) {
        return (
            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-700">
                <p className="text-red-500 text-center">Problem data is missing or was deleted</p>
            </div>
        );
    }

    const handleConfidenceClick = (confidence) => {
        onReview(problem._id, confidence, sessionId);
        setShowConfidence(false);
    };

    const getStatusBadge = () => {
        switch (reviewStatus) {
            case 'MASTERED':
                return (
                    <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-medium flex items-center gap-1">
                        <Star size={12} />
                        Mastered
                    </span>
                );
            case 'LESS_CONFIDENT':
                return (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs font-medium">
                        Less Confident
                    </span>
                );
            case 'FORGOT':
                return (
                    <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs font-medium">
                        Forgot
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                        Pending
                    </span>
                );
        }
    };

    const statusInfo = getStatusInfo(problem.status);

    if (viewMode === 'list') {
        return (
            <>
                <div className={`p-4 rounded-lg border transition-all duration-200 ${
                    isReviewed 
                        ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700' 
                        : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
                } hover:shadow-md`}>
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-3">
                                <a 
                                    href={problem.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:underline font-semibold text-gray-900 dark:text-white flex items-start gap-2 break-words"
                                >
                                    {problem.title}
                                    <ExternalLink size={14} className="text-gray-400 flex-shrink-0 mt-1" />
                                </a>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBgColor(problem.difficulty)} ${getDifficultyColor(problem.difficulty)} self-start`}>
                                    {problem.difficulty || 'Unknown'}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {problem.tags?.slice(0, 3).map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs">
                                        {tag}
                                    </span>
                                ))}
                                {problem.tags?.length > 3 && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        +{problem.tags.length - 3} more
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    <span>Added: {formatDate(problem.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>Status: {statusInfo.text}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
                            <div className="self-end sm:self-auto">
                                {getStatusBadge()}
                            </div>
                            
                            {!showConfidence ? (
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                                    {!isReviewed && (
                                        <Button
                                            onClick={() => setShowConfidence(true)}
                                            variant="primary"
                                            size="sm"
                                            className="w-full sm:w-auto text-center"
                                        >
                                            Mark Reviewed
                                        </Button>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setNotesModalOpen(true)}
                                            className="p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                                            title="View notes"
                                        >
                                            <MessageSquare size={16} />
                                        </button>
                                        {isReviewed && (
                                            <button
                                                onClick={() => setShowConfidence(true)}
                                                className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-colors"
                                                title="Change confidence"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 w-full sm:w-auto">
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <Button 
                                            onClick={() => handleConfidenceClick('FORGOT')} 
                                            variant={reviewStatus === 'FORGOT' ? 'primary' : 'outline'} 
                                            size="sm"
                                            className="text-xs w-full sm:w-auto"
                                        >
                                            Forgot
                                        </Button>
                                        <Button 
                                            onClick={() => handleConfidenceClick('LESS_CONFIDENT')} 
                                            variant={reviewStatus === 'LESS_CONFIDENT' ? 'primary' : 'outline'} 
                                            size="sm"
                                            className="text-xs w-full sm:w-auto"
                                        >
                                            Less Confident
                                        </Button>
                                        <Button 
                                            onClick={() => handleConfidenceClick('MASTERED')} 
                                            variant={reviewStatus === 'MASTERED' ? 'primary' : 'outline'} 
                                            size="sm"
                                            className="text-xs w-full sm:w-auto"
                                        >
                                            Mastered
                                        </Button>
                                    </div>
                                    <button 
                                        onClick={() => setShowConfidence(false)} 
                                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-1 w-full sm:w-auto"
                                    >
                                        <X size={12} />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <NotesModal isOpen={isNotesModalOpen} onClose={() => setNotesModalOpen(false)} notes={problem.notes} />
            </>
        );
    }

    // Grid View (unchanged)
    return (
        <>
            <div className={`p-6 rounded-lg border transition-all duration-200 ${
                isReviewed 
                    ? 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700' 
                    : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
            } hover:shadow-md h-full flex flex-col`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBgColor(problem.difficulty)} ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty || 'Unknown'}
                    </span>
                    {getStatusBadge()}
                </div>

                {/* Title */}
                <a 
                    href={problem.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 flex items-start gap-2"
                >
                    {problem.title}
                    <ExternalLink size={14} className="text-gray-400 flex-shrink-0 mt-1" />
                </a>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
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

                {/* Metadata */}
                <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{formatDate(problem.createdAt)}</span>
                        </div>
                        <span className={statusInfo.color}>{statusInfo.text}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setNotesModalOpen(true)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                            <MessageSquare size={14} />
                            Notes
                        </button>

                        {!showConfidence ? (
                            <div className="flex items-center gap-2">
                                {isReviewed ? (
                                    <button
                                        onClick={() => setShowConfidence(true)}
                                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                                    >
                                        <Edit size={12} />
                                        Change
                                    </button>
                                ) : (
                                    <Button
                                        onClick={() => setShowConfidence(true)}
                                        variant="primary"
                                        size="sm"
                                        className="text-xs"
                                    >
                                        Mark Reviewed
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-1">
                                    <Button 
                                        onClick={() => handleConfidenceClick('FORGOT')} 
                                        variant={reviewStatus === 'FORGOT' ? 'primary' : 'outline'} 
                                        size="sm"
                                        className="text-xs !px-2"
                                    >
                                        Forgot
                                    </Button>
                                    <Button 
                                        onClick={() => handleConfidenceClick('LESS_CONFIDENT')} 
                                        variant={reviewStatus === 'LESS_CONFIDENT' ? 'primary' : 'outline'} 
                                        size="sm"
                                        className="text-xs !px-2"
                                    >
                                        Less Confident
                                    </Button>
                                    <Button 
                                        onClick={() => handleConfidenceClick('MASTERED')} 
                                        variant={reviewStatus === 'MASTERED' ? 'primary' : 'outline'} 
                                        size="sm"
                                        className="text-xs !px-2"
                                    >
                                        Mastered
                                    </Button>
                                </div>
                                <button 
                                    onClick={() => setShowConfidence(false)} 
                                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-center"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <NotesModal isOpen={isNotesModalOpen} onClose={() => setNotesModalOpen(false)} notes={problem.notes} />
        </>
    );
};

export default RevisionCard;