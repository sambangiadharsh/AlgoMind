// NotesModal.jsx
import React from 'react';
import Button from '/src/components/common/Button.jsx';

const NotesModal = ({ isOpen, onClose, notes }) => {
    if (!isOpen) return null;
    
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div onClick={e => e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
                <h3 className="text-lg font-semibold mb-4">Notes & Solution</h3>
                <div className="prose dark:prose-invert max-h-[60vh] overflow-y-auto p-4 bg-gray-100 dark:bg-gray-700 rounded">
                   <p className="whitespace-pre-wrap">{notes || 'No notes have been added for this problem.'}</p>
                </div>
                <div className="mt-6 text-right">
                    <Button onClick={onClose} variant="secondary">Close</Button>
                </div>
            </div>
        </div>
    );
};

export default NotesModal;