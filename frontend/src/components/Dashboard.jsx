import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ModuleCard } from './ModuleCard';
import { BottomBar } from './BottomBar';
import { BackgroundBlobs } from './BackgroundBlobs';
import { 
  Flame, 
  Users, 
  Calendar, 
  FileText, 
  Camera, 
  Map,
  Building,
  CloudRainWind,
  ShoppingCart,
  Globe,
  Star
} from 'lucide-react';

const modules = [
  {
    id: 'supply',
    title: 'Supply Inventory',
    description: 'Manage supplies and inventory',
    icon: Flame,
    gradient: 'var(--gradient-cyan)',
    features: ['Track items', 'Stock levels', 'Categories']
  },
  {
    id: 'contacts',
    title: 'Contact Directory',
    description: 'Browse contact information',
    icon: Users,
    gradient: 'var(--gradient-green)',
    features: ['Staff directory', 'Departments', 'Quick search']
  },
  {
    id: 'calendar',
    title: 'Calendar Management',
    description: 'View events and schedules',
    icon: Calendar,
    gradient: 'var(--gradient-purple)',
    features: ['Event calendar', 'Schedules', 'Planning']
  },
  {
    id: 'documents',
    title: 'Document Management',
    description: 'Access documents',
    icon: FileText,
    gradient: 'var(--gradient-orange)',
    features: ['File access', 'Offline support', 'Organization']
  },
  {
    id: 'photos',
    title: 'Photo Documentation',
    description: 'Browse photo gallery',
    icon: Camera,
    gradient: 'var(--gradient-pink)',
    features: ['Photo gallery', 'Media files', 'Documentation']
  },
  {
    id: 'maps',
    title: 'Maps',
    description: 'View maps and locations',
    icon: Map,
    gradient: 'var(--gradient-teal)',
    features: ['Map viewer', 'Locations', 'Offline maps']
  }
];

export const Dashboard = ({ onOpenModule }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Quick access items with icons and colors
  const quickAccessItems = [
    { 
      id: 'logo', 
      label: 'Logo', 
      icon: Building, 
      gradient: 'from-blue-500 to-blue-600',
      hover: 'hover:from-blue-600 hover:to-blue-700'
    },
    { 
      id: 'interactive-map', 
      label: 'Interactive Map', 
      icon: Map, 
      gradient: 'from-green-500 to-green-600',
      hover: 'hover:from-green-600 hover:to-green-700'
    },
    { 
      id: 'typhoon-tracking', 
      label: 'Typhoon Tracking', 
      icon: CloudRainWind, 
      gradient: 'from-yellow-500 to-orange-500',
      hover: 'hover:from-yellow-600 hover:to-orange-600'
    },
    { 
      id: 'procurement', 
      label: 'Procurement', 
      icon: ShoppingCart, 
      gradient: 'from-purple-500 to-purple-600',
      hover: 'hover:from-purple-600 hover:to-purple-700'
    },
    { 
      id: 'drrm-web', 
      label: 'DRRM-Web', 
      icon: Globe, 
      gradient: 'from-red-500 to-red-600',
      hover: 'hover:from-red-600 hover:to-red-700'
    }
  ];

  return (
    <div className=\"min-h-screen relative overflow-hidden\">\n      {/* Animated Background Blobs */}\n      <BackgroundBlobs />\n      \n      {/* Main Layout */}\n      <div className=\"relative z-10 flex min-h-screen\">\n        {/* Main Content */}\n        <div className=\"flex-1 flex flex-col\">\n          {/* Header */}\n          <Header \n            isDarkMode={isDarkMode} \n            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} \n          />\n          \n          {/* Dashboard Content */}\n          <main className=\"flex-1 p-4 sm:p-6 lg:p-8\">\n            <div className=\"max-w-7xl mx-auto\">\n\n              {/* Welcome Section with Gradient Text */}\n              <div className=\"mb-8 animate-fade-in-up\">\n                <h1 className=\"text-4xl sm:text-5xl lg:text-6xl font-bold mb-4\">\n                  <span className=\"gradient-text-rainbow\">Welcome Back</span>\n                </h1>\n                <p className=\"text-lg text-muted-foreground\">Manage your operations with powerful tools and insights</p>\n              </div>\n\n              {/* Enhanced Quick Access Container with Glassmorphism */}\n              <div className=\"mb-10 animate-fade-in-up\" style={{ animationDelay: '0.1s' }}>\n                <div className=\"glass-effect rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-white/20 dark:border-white/10 relative overflow-hidden\">\n                  {/* Gradient overlay */}\n                  <div className=\"absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none\" />\n                  \n                  <div className=\"relative z-10\">\n                    <h2 className=\"text-2xl font-bold mb-6 flex items-center gap-3\">\n                      <span className=\"gradient-text\">Quick Access</span>\n                      <div className=\"h-1 flex-1 bg-gradient-to-r from-purple-500/50 via-cyan-500/50 to-transparent rounded-full\" />\n                    </h2>\n                    \n                    <div className=\"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5\">\n                      {quickAccessItems.map((item, index) => {\n                        const Icon = item.icon;\n                        return (\n                          <button\n                            key={item.id}\n                            className={`quick-access-btn flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-br ${item.gradient} ${item.hover} text-white shadow-xl relative group icon-bounce`}\n                            style={{ animationDelay: `${index * 0.05}s` }}\n                          >\n                            {/* Glow effect */}\n                            <div className=\"absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300\" />\n                            \n                            <div className=\"icon-inner w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-xl mb-3 shadow-lg transform transition-transform duration-300 group-hover:scale-110 relative z-10\">\n                              <Icon className=\"w-7 h-7\" />\n                            </div>\n                            <span className=\"text-xs sm:text-sm font-semibold text-center leading-tight relative z-10\">\n                              {item.label}\n                            </span>\n                          </button>\n                        );\n                      })}\n                    </div>\n                  </div>\n                </div>\n              </div>\n\n              {/* Module Grid Title */}\n              <div className=\"mb-6 animate-fade-in-up\" style={{ animationDelay: '0.2s' }}>\n                <h2 className=\"text-3xl font-bold flex items-center gap-3\">\n                  <span className=\"gradient-text\">System Modules</span>\n                  <div className=\"h-1 flex-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-transparent rounded-full\" />\n                </h2>\n              </div>\n\n              {/* Module Grid */}\n              <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8\">\n                {modules.map((module) => (\n                  <ModuleCard key={module.id} {...module} onOpen={onOpenModule} />\n                ))}\n              </div>\n              \n\n            </div>\n          </main>\n          \n          {/* Bottom Action Bar */}\n          <BottomBar isOnline={isOnline} />\n        </div>\n      </div>\n    </div>\n  );
};

export default Dashboard;
