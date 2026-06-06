import { motion } from 'motion/react';

export function CityTwinLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className="relative">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          {/* City skyline silhouette */}
          <motion.path
            d="M4 32 L8 32 L8 24 L12 24 L12 28 L16 28 L16 20 L20 20 L20 26 L24 26 L24 18 L28 18 L28 22 L32 22 L32 16 L36 16 L36 24 L40 24 L40 32 L44 32 L44 40 L4 40 Z"
            fill="url(#cityGradient)"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />

          {/* Stars above the city */}
          <motion.circle
            cx="12"
            cy="14"
            r="1.5"
            fill="#ec4899"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="2s"
              repeatCount="indefinite"
            />
          </motion.circle>

          <motion.circle
            cx="24"
            cy="8"
            r="2"
            fill="#de1e3d"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </motion.circle>

          <motion.circle
            cx="36"
            cy="12"
            r="1.5"
            fill="#8b5cf6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur="3s"
              repeatCount="indefinite"
            />
          </motion.circle>

          {/* Small sparkles */}
          <motion.circle
            cx="18"
            cy="10"
            r="0.8"
            fill="white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </motion.circle>

          <motion.circle
            cx="30"
            cy="14"
            r="0.8"
            fill="white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <animate
              attributeName="opacity"
              values="0.4;0.8;0.4"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </motion.circle>

          {/* Connecting lines (constellation style) */}
          <motion.line
            x1="12"
            y1="14"
            x2="24"
            y2="8"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          />
          <motion.line
            x1="24"
            y1="8"
            x2="36"
            y2="12"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />

          <defs>
            <linearGradient id="cityGradient" x1="24" y1="16" x2="24" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#de1e3d" stopOpacity="0.9" />
            </linearGradient>
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
