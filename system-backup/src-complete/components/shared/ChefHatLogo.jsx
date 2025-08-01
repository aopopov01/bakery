import React from 'react';

function ChefHatLogo({ size = 'large', className = '' }) {
  const dimensions = {
    small: { width: 40, height: 48 },
    medium: { width: 60, height: 72 },
    large: { width: 80, height: 96 }
  };

  const { width, height } = dimensions[size];

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {/* Magical Chef's Hat - Exact match to reference image */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 80 96"
        className="absolute inset-0"
        style={{ filter: 'drop-shadow(0 6px 20px rgba(251, 191, 36, 0.3))' }}
      >
        {/* Cylindrical Hat Band/Base - Clean and simple */}
        <ellipse
          cx="40"
          cy="82"
          rx="28"
          ry="6"
          fill="url(#hatBase)"
          stroke="url(#baseStroke)"
          strokeWidth="2"
        />
        
        {/* Main cylindrical body */}
        <rect
          x="12"
          y="58"
          width="56"
          height="24"
          fill="url(#cylinderFill)"
          stroke="url(#cylinderStroke)"
          strokeWidth="2"
          rx="2"
        />
        
        {/* Cloud-like puffy top - Three rounded sections like reference */}
        
        {/* Left puff */}
        <circle
          cx="25"
          cy="48"
          r="18"
          fill="url(#puffFill)"
          stroke="url(#puffStroke)"
          strokeWidth="2.5"
        />
        
        {/* Center puff (largest) */}
        <circle
          cx="40"
          cy="40"
          r="22"
          fill="url(#puffFill)"
          stroke="url(#puffStroke)"
          strokeWidth="2.5"
        />
        
        {/* Right puff */}
        <circle
          cx="55"
          cy="48"
          r="18"
          fill="url(#puffFill)"
          stroke="url(#puffStroke)"
          strokeWidth="2.5"
        />
        
        {/* Small connection details between puffs */}
        <ellipse
          cx="32"
          cy="50"
          rx="8"
          ry="4"
          fill="url(#puffFill)"
          opacity="0.8"
        />
        
        <ellipse
          cx="48"
          cy="50"
          rx="8"
          ry="4"
          fill="url(#puffFill)"
          opacity="0.8"
        />

        {/* Magical sparkle details on the hat */}
        <circle cx="22" cy="35" r="1.5" fill="url(#sparkle)" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        <circle cx="58" cy="38" r="1.2" fill="url(#sparkle)" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
        <circle cx="40" cy="25" r="1.8" fill="url(#sparkle)" className="animate-pulse" style={{ animationDelay: '2.5s' }} />
        <circle cx="30" cy="42" r="1" fill="url(#sparkle)" className="animate-pulse" style={{ animationDelay: '3s' }} />
        <circle cx="50" cy="44" r="1.3" fill="url(#sparkle)" className="animate-pulse" style={{ animationDelay: '4s' }} />

        {/* Gradients and Magical Colors */}
        <defs>
          {/* Pure white hat with magical shimmer */}
          <radialGradient id="puffFill" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#FEFCF3" />
            <stop offset="100%" stopColor="#FEF7E0" />
          </radialGradient>
          
          {/* Cylindrical body - slight gradient */}
          <linearGradient id="cylinderFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8F9FA" />
          </linearGradient>
          
          {/* Hat base - golden band */}
          <linearGradient id="hatBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF7E0" />
            <stop offset="50%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          
          {/* Strokes - Golden magical outline */}
          <linearGradient id="puffStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          
          <linearGradient id="cylinderStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          
          <linearGradient id="baseStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          
          {/* Sparkle gradient */}
          <radialGradient id="sparkle" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FCD34D" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
        </defs>
      </svg>

      {/* Magical floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Magic wand */}
        <div 
          className="absolute text-sm animate-float opacity-90"
          style={{ 
            top: '8%', 
            left: '-8%',
            animationDelay: '0s',
            animationDuration: '5s'
          }}
        >
          🪄
        </div>
        
        {/* Croissant */}
        <div 
          className="absolute text-xs animate-float opacity-85"
          style={{ 
            top: '15%', 
            right: '-12%',
            animationDelay: '1.5s',
            animationDuration: '4s'
          }}
        >
          🥐
        </div>
        
        {/* Cupcake */}
        <div 
          className="absolute text-xs animate-float opacity-85"
          style={{ 
            bottom: '30%', 
            left: '-15%',
            animationDelay: '2.5s',
            animationDuration: '4.5s'
          }}
        >
          🧁
        </div>
        
        {/* Crystal ball for magic */}
        <div 
          className="absolute text-xs animate-float opacity-80"
          style={{ 
            bottom: '15%', 
            right: '-10%',
            animationDelay: '3.5s',
            animationDuration: '6s'
          }}
        >
          🔮
        </div>
        
        {/* Golden sparkles */}
        <div 
          className="absolute text-xs animate-ping opacity-70"
          style={{ 
            top: '5%', 
            left: '88%',
            animationDelay: '1s'
          }}
        >
          ✨
        </div>
        
        <div 
          className="absolute text-xs animate-ping opacity-70"
          style={{ 
            bottom: '20%', 
            right: '90%',
            animationDelay: '3s'
          }}
        >
          ⭐
        </div>
        
        <div 
          className="absolute text-xs animate-ping opacity-60"
          style={{ 
            top: '40%', 
            right: '92%',
            animationDelay: '5s'
          }}
        >
          💫
        </div>
        
        {/* Additional magical elements */}
        <div 
          className="absolute text-xs animate-ping opacity-50"
          style={{ 
            top: '25%', 
            left: '85%',
            animationDelay: '6s'
          }}
        >
          🌟
        </div>
      </div>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-10px) rotate(3deg); 
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default ChefHatLogo;