import { motion } from 'motion/react';
import { useState } from 'react';
import { CityTwinLogo } from './CityTwinLogo';
import { B2BForm } from './B2BForm';

interface City {
  name: string;
  available: boolean;
  gradient: string;
  position: { x: number; y: number };
}

const cities: City[] = [
  {
    name: 'London',
    available: false,
    gradient: 'from-blue-500 to-indigo-600',
    position: { x: 20, y: 30 },
  },
  {
    name: 'Hong Kong',
    available: true,
    gradient: 'from-purple-500 to-pink-600',
    position: { x: 50, y: 45 },
  },
  {
    name: 'Dubai',
    available: false,
    gradient: 'from-amber-500 to-orange-600',
    position: { x: 80, y: 35 },
  },
];

interface HeroPageProps {
  onCitySelect: (city: string) => void;
}

export function HeroPage({ onCitySelect }: HeroPageProps) {
  const [mode, setMode] = useState<'b2c' | 'b2b'>('b2c');

  // Show B2B form if in B2B mode
  if (mode === 'b2b') {
    return <B2BForm onBack={() => setMode('b2c')} />;
  }

  return (
    <div className="h-screen w-full bg-[#0a0e27] overflow-hidden relative flex flex-col">
      {/* Header with Logo */}
      <div className="p-6 z-10">
        <CityTwinLogo />
        
        {/* B2B/B2C Toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <motion.button
            onClick={() => setMode('b2c')}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
              mode === 'b2c'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
            style={{
              boxShadow: mode === 'b2c' ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Explore
          </motion.button>
          <motion.button
            onClick={() => setMode('b2b')}
            className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
              mode === 'b2b'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
            style={{
              boxShadow: mode === 'b2b' ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Partner with us
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 z-10">
        <motion.h1
          className="text-white text-center mb-4"
          style={{
            fontSize: '3rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 50%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Choose Your City
        </motion.h1>

        <motion.p
          className="text-gray-400 text-center mb-12"
          style={{ fontSize: '1.125rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Discover opportunities tailored to your destination
        </motion.p>

        {/* City Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          {cities.map((city, index) => (
            <motion.button
              key={city.name}
              onClick={() => city.available && onCitySelect(city.name)}
              disabled={!city.available}
              className={`relative p-8 rounded-3xl border-2 backdrop-blur-sm transition-all ${
                city.available
                  ? 'cursor-pointer hover:scale-105 active:scale-95'
                  : 'cursor-not-allowed opacity-50'
              }`}
              style={{
                background: city.available
                  ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)'
                  : 'rgba(26, 31, 58, 0.5)',
                borderColor: city.available ? '#8b5cf6' : '#374151',
                boxShadow: city.available ? '0 0 30px rgba(139, 92, 246, 0.3)' : 'none',
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={city.available ? { y: -8 } : {}}
            >
              {/* City Icon/Illustration */}
              <div className="mb-6 flex justify-center">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br ${city.gradient}`}
                  style={{
                    boxShadow: city.available ? `0 0 40px rgba(139, 92, 246, 0.5)` : 'none',
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    {/* Simplified city skyline */}
                    <g stroke="white" strokeWidth="2" fill="none">
                      <path d="M 10 32 L 10 28 L 14 28 L 14 32" />
                      <path d="M 16 32 L 16 24 L 20 24 L 20 32" />
                      <path d="M 22 32 L 22 20 L 26 20 L 26 32" />
                      <path d="M 28 32 L 28 24 L 32 24 L 32 32" />
                      <path d="M 34 32 L 34 28 L 38 28 L 38 32" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* City Name */}
              <h3
                className="text-white mb-2"
                style={{ fontSize: '1.5rem', fontWeight: '600' }}
              >
                {city.name}
              </h3>

              {/* Status */}
              {city.available ? (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span style={{ fontSize: '0.875rem' }}>Available Now</span>
                </div>
              ) : (
                <div className="text-gray-500" style={{ fontSize: '0.875rem' }}>
                  Coming Soon
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Partner Logos */}
        <motion.div
          className="mt-16 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <p className="text-gray-500 text-center mb-6" style={{ fontSize: '0.875rem', letterSpacing: '0.05em' }}>
            TRUSTED BY LEADING ORGANIZATIONS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl mx-auto">
            {[
              { name: 'HKUST', link: 'https://sfao.hkust.edu.hk/' },
              { name: 'HKU', link: 'https://admissions.hku.hk/fees-and-scholarships/scholarships' },
              { name: 'InvestHK', link: 'https://www.investhk.gov.hk/' },
              { name: 'Cyberport', link: 'https://www.cyberport.hk/en/about_cyberport/cyberport_entrepreneurs' },
              { name: 'HSBC', link: 'https://www.hsbcinnovationbanking.com/' },
            ].map((company, index) => (
              <motion.a
                key={company.name}
                href={company.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.05, duration: 0.5 }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(139, 92, 246, 0.5)' }}
              >
                <span className="text-white/70" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  {company.name}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Earth Silhouette at Bottom */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-0">
        <motion.svg
          width="1000"
          height="1000"
          viewBox="0 0 1000 1000"
          fill="none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {/* Earth circle */}
          <circle
            cx="500"
            cy="500"
            r="450"
            fill="url(#earthGradient)"
            opacity="0.25"
          />
          
          {/* Earth outline */}
          <circle
            cx="500"
            cy="500"
            r="450"
            fill="none"
            stroke="url(#earthStroke)"
            strokeWidth="2"
            opacity="0.4"
          />


          {/* City lights (glowing dots) */}
          {[
            { cx: 260, cy: 290 },
            { cx: 300, cy: 400 },
            { cx: 490, cy: 230 },
            { cx: 520, cy: 350 },
            { cx: 660, cy: 280 },
            { cx: 700, cy: 340 },
            { cx: 750, cy: 510 },
            { cx: 400, cy: 320 },
          ].map((dot, i) => (
            <circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r="4"
              fill="#e0d4ff"
              opacity="0.9"
            >
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur={`${2 + i * 0.2}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          <defs>
            <linearGradient id="earthGradient" x1="500" y1="50" x2="500" y2="950">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>
            <linearGradient id="earthStroke" x1="500" y1="50" x2="500" y2="950">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>
    </div>
  );
}
