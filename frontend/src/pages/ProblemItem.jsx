import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteProblem, checkProblemsInTodaysRevision } from '../features/problems/problemSlice';
import { toast } from 'react-hot-toast';
import { Trash2, Edit, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProblemItem = ({ problem, onSelect, isSelected, showDeleteWarning = true }) => {
     const dispatch = useDispatch();
     const [showDeleteModal, setShowDeleteModal] = useState(false);

     const handleDelete = async () => {
          if (showDeleteWarning) {
               // Check if problem is in today's revision
               try {
               const result = await dispatch(checkProblemsInTodaysRevision([problem._id])).unwrap();
               
               if (result.problemsInRevision && result.problemsInRevision.length > 0) {
                    setShowDeleteModal(true);
                    return;
               }
               
               // If not in revision, proceed with deletion
               if (window.confirm('Are you sure you want to delete this problem?')) {
                    dispatch(deleteProblem(problem._id))
                    .unwrap()
                    .then(() => {
                    toast.success('Problem deleted successfully');
                    })
                    .catch(err => {
                    if (err.includes('scheduled for revision today')) {
                         setShowDeleteModal(true);
                    } else {
                         toast.error(err.message || 'Failed to delete problem');
                    }
                    });
               }
               } catch (err) {
               toast.error(err.message || 'Failed to check problem');
               }
          } else {
               // Direct deletion without checking (for other pages)
               if (window.confirm('Are you sure you want to delete this problem?')) {
               dispatch(deleteProblem(problem._id))
                    .unwrap()
                    .then(() => {
                    toast.success('Problem deleted successfully');
                    })
                    .catch(err => {
                    toast.error(err.message || 'Failed to delete problem');
                    });
               }
          }
     };

     const formatDate = (dateString) => {
          return new Date(dateString).toLocaleDateString('en-US', {
               year: 'numeric',
               month: 'short',
               day: 'numeric'
          });
     };

     return (
     <>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <td className="w-4 p-4">
               <div className="flex items-center">
               <input
               type="checkbox"
               checked={isSelected}
               onChange={() => onSelect(problem._id)}
               className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
               />
               </div>
          </td>
          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
               <a href={problem.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
               {problem.title}
               </a>
          </td>
          <td className="px-6 py-4">
               <span className={`px-2 py-1 text-xs rounded-full ${
               problem.difficulty === 'Easy' 
               ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
               : problem.difficulty === 'Medium'
               ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
               : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
               }`}>
               {problem.difficulty}
               </span>
          </td>
          <td className="px-6 py-4">
               <span className={`px-2 py-1 text-xs rounded-full ${
               problem.status === 'Pending' 
               ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
               : problem.status === 'Mastered'
               ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
               : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
               }`}>
               {problem.status}
               </span>
          </td>
          <td className="px-6 py-4">
               {formatDate(problem.createdAt)}
          </td>
          <td className="px-6 py-4 flex items-center gap-2">
               <Link to={`/edit-problem/${problem._id}`}>
               <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
               <Edit size={16} />
               </button>
               </Link>
               <button onClick={handleDelete} className="font-medium text-red-600 dark:text-red-500 hover:underline">
               <Trash2 size={16} />
               </button>
          </td>
          </tr>

          {/* Delete Warning Modal */}
          {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
               <div className="flex items-center gap-3 mb-4">
               <AlertCircle className="h-6 w-6 text-red-500" />
               <h3 className="text-lg font-semibold">Cannot Delete Problem</h3>
               </div>
               
               <div className="mb-6">
               <p className="text-gray-600 dark:text-gray-300 mb-3">
                    This problem is scheduled for revision today and cannot be deleted:
               </p>
               <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <p className="text-red-700 dark:text-red-300 font-medium">
                    {problem.title} ({problem.difficulty})
                    </p>
               </div>
               <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    Please try deleting this problem tomorrow when it is no longer scheduled for revision.
               </p>
               </div>
               
               <div className="flex justify-end">
               <button 
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
               >
                    Close
               </button>
               </div>
               </div>
          </div>
          )}
     </>
     );
};

export default ProblemItem;



