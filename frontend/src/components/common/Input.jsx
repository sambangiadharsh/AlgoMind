import React from 'react';

const Input = ({ id, name, type = 'text', value, onChange, placeholder, required = false, className = '', autoComplete, readOnly, disabled }) => {
  return (
    <input
      id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
      required={required} autoComplete={autoComplete} readOnly={readOnly} disabled={disabled}
      className={`w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white 
      disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
      ${className}`}
    />
  );
};
export default Input;

