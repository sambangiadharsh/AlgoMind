import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for the theme
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
  // State to hold the current theme. It checks localStorage first,
  // then the user's system preference, and defaults to 'light'.
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Default to dark mode if no preference is saved
    return 'dark'; 
  });

  // Effect to apply the theme class to the <html> element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context easily in other components
export const useTheme = () => useContext(ThemeContext);
