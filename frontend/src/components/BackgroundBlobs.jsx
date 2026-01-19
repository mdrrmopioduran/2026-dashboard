import React from 'react';

export const BackgroundBlobs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Large Top Left Blob - Purple/Blue */}
      <div 
        className="gradient-blob"
        style={{
          width: '700px',
          height: '700px',
          background: 'var(--gradient-bg-1)',
          top: '-250px',
          left: '-150px',
          animationDelay: '0s',
          animationDuration: '25s'
        }}
      />
      
      {/* Top Right Blob - Cyan */}
      <div 
        className="gradient-blob"
        style={{
          width: '600px',
          height: '600px',
          background: 'var(--gradient-bg-2)',
          top: '-200px',
          right: '-200px',
          animationDelay: '3s',
          animationDuration: '30s'
        }}
      />
      
      {/* Bottom Left Blob - Pink */}
      <div 
        className="gradient-blob"
        style={{
          width: '650px',
          height: '650px',
          background: 'var(--gradient-bg-3)',
          bottom: '-250px',
          left: '5%',
          animationDelay: '6s',
          animationDuration: '28s'
        }}
      />
      
      {/* Bottom Right Blob - Orange/Yellow */}
      <div 
        className="gradient-blob"
        style={{
          width: '750px',
          height: '750px',
          background: 'var(--gradient-bg-4)',
          bottom: '-300px',
          right: '-150px',
          animationDelay: '8s',
          animationDuration: '32s'
        }}
      />
      
      {/* Middle Accent Blob - Purple */}
      <div 
        className="gradient-blob"
        style={{
          width: '500px',
          height: '500px',
          background: 'var(--gradient-bg-1)',
          top: '35%',
          right: '15%',
          animationDelay: '4s',
          animationDuration: '26s',
          opacity: '0.4'
        }}
      />
      
      {/* Additional Small Accent Blobs for depth */}
      <div 
        className="gradient-blob"
        style={{
          width: '350px',
          height: '350px',
          background: 'linear-gradient(135deg, hsl(258 90% 66% / 0.3) 0%, hsl(190 100% 60% / 0.3) 100%)',
          top: '20%',
          left: '30%',
          animationDelay: '2s',
          animationDuration: '22s',
          opacity: '0.3'
        }}
      />
      
      <div 
        className="gradient-blob"
        style={{
          width: '400px',
          height: '400px',
          background: 'linear-gradient(135deg, hsl(330 85% 65% / 0.3) 0%, hsl(280 80% 75% / 0.3) 100%)',
          bottom: '15%',
          right: '35%',
          animationDelay: '5s',
          animationDuration: '24s',
          opacity: '0.35'
        }}
      />
      
      {/* Floating particle effects */}
      <div 
        className="gradient-blob"
        style={{
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, hsl(258 90% 66% / 0.4) 0%, transparent 70%)',
          top: '60%',
          left: '10%',
          animationDelay: '7s',
          animationDuration: '20s',
          filter: 'blur(60px)',
          opacity: '0.5'
        }}
      />
    </div>
  );
};
