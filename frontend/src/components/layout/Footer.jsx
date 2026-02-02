import React from 'react';
import { Code, Github, Twitter, Linkedin, Brain } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-indigo-500" />
            <span className="text-md font-semibold text-gray-700 dark:text-gray-200">AlgoMind</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {year} AlgoMind. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <a href="https://github.com/sambangiadharsh" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500 transition-colors" aria-label="GitHub repository">
              <Github size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500 transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500 transition-colors" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
