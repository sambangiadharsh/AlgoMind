

import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = 'font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  const disabledStyles = 'opacity-50 cursor-not-allowed';
  return (
    <button type={type} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${disabled ? disabledStyles : ''} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};
export default Button;