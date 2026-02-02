
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';

const ProblemItem = ({ problem, onSelect, isSelected }) => {
  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusClass = (status) => {
     switch (status) {
      case 'Mastered': return 'text-green-500';
      case 'Revisiting': return 'text-yellow-500';
      case 'Pending': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  }

  return (
    <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="p-4">
        <input type="checkbox" checked={isSelected} onChange={() => onSelect(problem._id)} className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500" />
      </td>
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
        <a href={problem.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{problem.title}</a>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyClass(problem.difficulty)}`}>
          {problem.difficulty}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`font-semibold ${getStatusClass(problem.status)}`}>
            {problem.status}
        </span>
      </td>
      <td className="px-6 py-4">
        {new Date(problem.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-right space-x-2">
        <Link to={`/problem/${problem._id}/edit`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline inline-flex items-center p-1">
            <Edit size={16} />
        </Link>
      </td>
    </tr>
  );
};
export default ProblemItem;