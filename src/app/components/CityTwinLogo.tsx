import { motion } from 'motion/react';

export function CityTwinLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon - Purple Circle with City Skyline */}
      <div className="relative">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          {/* Purple circle outline */}
          <motion.circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
          />

          {/* Dark background inside circle */}
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            fill="#1a1f3a"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', delay: 0.1 }}
          />

          {/* Five glowing dots in arc above skyline */}
          <motion.circle
            cx="10"
            cy="16"
            r="1.5"
            fill="#e0d4ff"
            filter="url(#glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="2s"
              repeatCount="indefinite"
            />
          </motion.circle>

          <motion.circle
            cx="16"
            cy="12"
            r="1.5"
            fill="#e0d4ff"
            filter="url(#glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </motion.circle>

          <motion.circle
            cx="24"
            cy="10"
            r="1.5"
            fill="#e0d4ff"
            filter="url(#glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </motion.circle>

          <motion.circle
            cx="32"
            cy="12"
            r="1.5"
            fill="#e0d4ff"
            filter="url(#glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="2.6s"
              repeatCount="indefinite"
            />
          </motion.circle>

          <motion.circle
            cx="38"
            cy="16"
            r="1.5"
            fill="#e0d4ff"
            filter="url(#glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <animate
              attributeName="opacity"
              values="0.7;1;0.7"
              dur="2.8s"
              repeatCount="indefinite"
            />
          </motion.circle>

          {/* City skyline - outlined buildings with varied heights and shapes */}
          <motion.g
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            stroke="white"
            strokeWidth="1"
            fill="none"
          >
            {/* Left section - shorter buildings */}
            <path d="M 9 33 L 9 30 L 11 30 L 11 28 L 13 28 L 13 38" />
            <path d="M 14 38 L 14 26 L 16 26 L 16 24 L 18 24 L 18 38" />
            
            {/* Left-center - medium building */}
            <path d="M 19 38 L 19 22 L 21 22 L 21 20 L 24 20 L 24 38" />
            
            {/* Center - tallest building with setback */}
            <path d="M 25 38 L 25 18 L 27 18 L 27 16 L 29 16 L 29 18 L 31 18 L 31 38" />
            
            {/* Right-center - medium building */}
            <path d="M 32 38 L 32 24 L 34 24 L 34 22 L 36 22 L 36 38" />
            
            {/* Right section - varied heights */}
            <path d="M 37 38 L 37 28 L 39 28 L 39 26 L 41 26 L 41 38" />
          </motion.g>

          <defs>
            {/* Glow effect for dots */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* Text Logo */}
      <div>
        <motion.h1
          className="text-white"
          style={{
            fontSize: '1.75rem',
            fontWeight: '700',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #ffffff 0%, #e9d5ff 50%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          CityTwin
        </motion.h1>
        <motion.p
          className="text-white/70"
          style={{ fontSize: '0.75rem', letterSpacing: '0.1em', marginTop: '-2px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          EXPLORE • CONNECT • GROW
        </motion.p>
      </div>
    </div>
  );
}
