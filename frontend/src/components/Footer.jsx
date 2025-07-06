import React from 'react';

const Footer = () => (
  <footer className="w-full bg-gray-900 text-white py-6 mt-auto">
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
      <div className="mb-2 md:mb-0">&copy; {new Date().getFullYear()} Built by <span className="text-blue-400 font-semibold">Mohan D</span>. All rights reserved.</div>
      <div className="flex space-x-4">
        <a href="https://github.com/mohan-d" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">GitHub</a>
        <a href="https://linkedin.com/in/mohan-d" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">LinkedIn</a>
      </div>
    </div>
  </footer>
);

export default Footer; 