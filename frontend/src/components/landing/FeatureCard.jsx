import React from 'react';

const FeatureCard = ({ icon, title, children, delay }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center mb-4">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-400">{children}</p>
    </div>
  );
};

export default FeatureCard;