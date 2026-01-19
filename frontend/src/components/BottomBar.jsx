import React from 'react';
import { Heart, Zap } from 'lucide-react';

export const BottomBar = ({ isOnline }) => {
  return (
    <div className="relative z-40 backdrop-blur-2xl bg-background/90 border-t border-border/30 shadow-2xl overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      
      <div className="flex items-center justify-between px-6 sm:px-8 lg:px-12 py-4 max-w-7xl mx-auto relative z-10">
        {/* System Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect">
            <span className="relative flex h-2 w-2">
              {isOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {isOnline ? 'All Systems Online' : 'Offline Mode'}
            </span>
          </div>
        </div>
        
        {/* Copyright with gradient effect */}
        <div className="hidden sm:flex items-center gap-2">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            © 2026 MDRRMO Pio Duran
            <span className="text-red-500 animate-pulse">
              <Heart className="h-3 w-3 inline fill-current" />
            </span>
          </p>
        </div>
        
        {/* Performance Badge */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-effect">
          <Zap className="h-3 w-3 text-yellow-500 animate-pulse" />
          <span className="text-xs font-medium gradient-text">Fast & Secure</span>
        </div>
      </div>
    </div>
  );
};
