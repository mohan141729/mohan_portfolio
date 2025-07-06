import React from 'react';

const Footer = () => (
  <footer className="w-full bg-gray-900 text-white py-4 sm:py-6 mt-auto">
    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6">
      <div className="mb-3 sm:mb-0 text-center sm:text-left text-sm sm:text-base">
        &copy; {new Date().getFullYear()} Built by <span className="text-blue-400 font-semibold">Mohan D</span>. All rights reserved.
      </div>
      <div className="flex space-x-4 text-sm sm:text-base">
        <a href="https://github.com/mohan-d" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">GitHub</a>
        <a href="https://linkedin.com/in/mohan-d" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">LinkedIn</a>
      </div>
    </div>
  </footer>
);

export default Footer; 