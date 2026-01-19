import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const ModuleCard = ({ id, title, description, icon: Icon, gradient, features, onOpen }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenModule = () => {
    // Allow supply, contacts, calendar, documents, and photos modules to open
    if ((id === 'supply' || id === 'contacts' || id === 'calendar' || id === 'documents' || id === 'photos' || id === 'maps') && onOpen) {
      onOpen(id);
    } else {
      toast.success(`Opening ${title}...`, {
        description: 'Module will be available soon!'
      });
    }
  };

  return (
    <Card 
      className="module-card stagger-animation overflow-hidden bg-card/90 backdrop-blur-xl border-border/50 hover:border-border relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient border on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${gradient.replace('var(--gradient-', '').replace(')', '')} 0%, transparent 100%)`,
          filter: 'blur(20px)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer pointer-events-none rounded-xl" />
      
      <CardHeader className="space-y-4 relative z-10">
        {/* Icon with pulse effect */}
        <div className="flex items-start gap-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden"
            style={{ background: gradient }}
          >
            {/* Icon glow effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500"
              style={{
                background: gradient,
                filter: 'blur(15px)'
              }}
            />
            <Icon className="h-8 w-8 relative z-10 transform transition-transform duration-500 group-hover:scale-110" />
            
            {/* Sparkle effect on hover */}
            {isHovered && (
              <Sparkles className="absolute top-1 right-1 h-4 w-4 text-white/80 animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
              {title}
            </CardTitle>
          </div>
        </div>
        
        {/* Description */}
        <CardDescription className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        {/* Features List with animated bullets */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li 
              key={index} 
              className="flex items-center gap-3 text-sm text-muted-foreground group-hover:text-foreground transition-all duration-300"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <span 
                className="w-2 h-2 rounded-full transform transition-all duration-500 group-hover:scale-150 group-hover:shadow-lg"
                style={{ 
                  background: gradient,
                  boxShadow: isHovered ? `0 0 10px ${gradient}` : 'none'
                }}
              />
              <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="relative z-10">
        <Button 
          className="btn-module w-full font-semibold text-white border-0 shadow-lg relative overflow-hidden group/btn"
          style={{ background: gradient }}
          onClick={handleOpenModule}
        >
          {/* Button content */}
          <span className="relative z-10 flex items-center justify-center gap-2">
            OPEN MODULE
            <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover/btn:translate-x-2" />
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};
