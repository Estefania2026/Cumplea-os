import { motion } from "motion/react";
import React from "react";

interface RobloxButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  className?: string;
}

export const RobloxButton: React.FC<RobloxButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary',
  className = ''
}) => {
  const variants = {
    primary: 'bg-cobalt-blue hover:bg-blue-600',
    secondary: 'bg-vibrant-orange hover:bg-orange-600',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-neon-green text-black font-bold hover:bg-green-400',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative px-6 py-3 rounded-xl roblox-glossy transition-colors
        text-slate-200 text-lg font-bold uppercase tracking-wider
        border-b-4 border-black/30 active:border-b-0 active:translate-y-1
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};
