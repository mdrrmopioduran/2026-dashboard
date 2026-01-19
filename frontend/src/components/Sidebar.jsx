import React from 'react';
import { Home } from 'lucide-react';
import { Button } from './ui/button';

export const Sidebar = () => {
  return (
    <aside className="w-20 sm:w-24 backdrop-blur-lg bg-background/60 border-r border-border flex flex-col items-center py-8">
      {/* Navigation Items */}
      <nav className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-xl hover:bg-accent flex flex-col items-center justify-center gap-1 transition-all group"
        >
          <Home className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors">Home</span>
        </Button>
      </nav>
    </aside>
  );
};
