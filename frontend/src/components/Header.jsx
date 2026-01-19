import React from 'react';
import { Moon, Sun, Sparkles } from 'lucide-react';

export const Header = ({ isDarkMode, onToggleDarkMode }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-background/80 border-b border-border/30 shadow-2xl">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      
      <div className="flex items-center justify-between px-6 sm:px-8 lg:px-12 py-4 max-w-7xl mx-auto relative z-10">
        {/* Logo and Title */}
        <div className="flex items-center gap-4 group">
          <div className="relative">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
            
            <img
              src="/logome.webp"
              alt="MDRRMO Pio Duran Logo"
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
            />
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500 bg-clip-text text-transparent animate-gradient-text">
              MDRRMO Pio Duran
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              File Inventory & Management System
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full glass-effect">
            <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />
            <span className="text-xs font-medium gradient-text">All Systems Online</span>
          </div>
          
          {/* Dark Mode Toggle with enhanced styling */}
          <button
            onClick={onToggleDarkMode}
            className="relative p-3 rounded-2xl hover:bg-accent transition-all duration-300 hover:scale-110 group/btn overflow-hidden"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {/* Button glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-400 transform transition-transform duration-300 group-hover/btn:rotate-180" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300 transform transition-transform duration-300 group-hover/btn:-rotate-12" />
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
