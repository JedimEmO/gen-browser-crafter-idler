import type { JSX } from 'solid-js';

type IconComponent = () => JSX.Element;

export const SlimeIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32">
    {/* Slime body */}
    <ellipse cx="12" cy="16" rx="8" ry="6" fill="#10B981" opacity="0.9"/>
    <ellipse cx="12" cy="14" rx="7" ry="5" fill="#34D399"/>
    {/* Eyes */}
    <circle cx="9" cy="13" r="1.5" fill="#000"/>
    <circle cx="15" cy="13" r="1.5" fill="#000"/>
    <circle cx="9.5" cy="12.5" r="0.5" fill="#FFF"/>
    <circle cx="15.5" cy="12.5" r="0.5" fill="#FFF"/>
    {/* Mouth */}
    <path d="M9 16 Q12 17 15 16" stroke="#000" stroke-width="0.5" fill="none"/>
  </svg>
);

export const GoblinIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32">
    {/* Body */}
    <rect x="8" y="12" width="8" height="8" fill="#065F46" rx="1"/>
    {/* Head */}
    <circle cx="12" cy="9" r="4" fill="#10B981"/>
    {/* Ears */}
    <ellipse cx="6" cy="9" rx="2" ry="3" fill="#10B981" transform="rotate(-20 6 9)"/>
    <ellipse cx="18" cy="9" rx="2" ry="3" fill="#10B981" transform="rotate(20 18 9)"/>
    {/* Eyes */}
    <circle cx="10" cy="9" r="1" fill="#DC2626"/>
    <circle cx="14" cy="9" r="1" fill="#DC2626"/>
    {/* Legs */}
    <rect x="9" y="19" width="2" height="3" fill="#065F46"/>
    <rect x="13" y="19" width="2" height="3" fill="#065F46"/>
    {/* Arms */}
    <rect x="6" y="13" width="2" height="1" fill="#10B981"/>
    <rect x="16" y="13" width="2" height="1" fill="#10B981"/>
  </svg>
);

export const WolfIcon = () => (
  <svg viewBox="0 0 24 24" width="32" height="32">
    {/* Body */}
    <ellipse cx="12" cy="16" rx="6" ry="4" fill="#6B7280"/>
    {/* Head */}
    <ellipse cx="12" cy="10" rx="4" ry="3" fill="#4B5563"/>
    {/* Snout */}
    <ellipse cx="12" cy="11.5" rx="2" ry="1.5" fill="#374151"/>
    {/* Ears */}
    <path d="M8 7 L9 10 L10 8 Z" fill="#4B5563"/>
    <path d="M14 8 L15 10 L16 7 Z" fill="#4B5563"/>
    {/* Eyes */}
    <circle cx="10" cy="9.5" r="0.7" fill="#FCD34D"/>
    <circle cx="14" cy="9.5" r="0.7" fill="#FCD34D"/>
    {/* Legs */}
    <rect x="8" y="18" width="1.5" height="3" fill="#4B5563"/>
    <rect x="10.5" y="18" width="1.5" height="3" fill="#4B5563"/>
    <rect x="12" y="18" width="1.5" height="3" fill="#4B5563"/>
    <rect x="14.5" y="18" width="1.5" height="3" fill="#4B5563"/>
    {/* Tail */}
    <path d="M6 15 Q4 17 5 19" stroke="#4B5563" stroke-width="2" fill="none"/>
  </svg>
);

export const PlayerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Head */}
    <circle cx="12" cy="8" r="3" fill="#FFD93D" stroke="#000" stroke-width="0.5"/>
    {/* Body */}
    <path d="M9 11 L9 16 L11 16 L11 20 L13 20 L13 16 L15 16 L15 11 Z" fill="#4A90E2" stroke="#000" stroke-width="0.5"/>
    {/* Arms */}
    <rect x="6" y="12" width="3" height="1.5" fill="#FFD93D" rx="0.5"/>
    <rect x="15" y="12" width="3" height="1.5" fill="#FFD93D" rx="0.5"/>
    {/* Eyes */}
    <circle cx="10.5" cy="7.5" r="0.5" fill="#000"/>
    <circle cx="13.5" cy="7.5" r="0.5" fill="#000"/>
    {/* Smile */}
    <path d="M10 9 Q12 10 14 9" stroke="#000" stroke-width="0.5" fill="none"/>
  </svg>
);

export const iconLibrary: Record<string, IconComponent> = {
  // Enemy icons
  slime: SlimeIcon,
  goblin: GoblinIcon,
  wolf: WolfIcon,
  
  wood: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="10" width="60" height="80" rx="10" fill="#8B572A"/>
      <path d="M50 10 C 40 20, 40 80, 50 90" stroke="#654321" stroke-width="4"/>
      <path d="M50 10 C 60 20, 60 80, 50 90" stroke="#654321" stroke-width="4"/>
    </svg>
  ),
  stone: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 40 L30 20 L70 20 L80 40 L75 70 L25 70 Z" fill="#9CA3AF" stroke="#6B7280" stroke-width="2"/>
      <path d="M35 35 L40 30 L60 30 L65 35 L62 55 L38 55 Z" fill="#6B7280"/>
    </svg>
  ),
  coal: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" fill="#1F2937"/>
      <circle cx="40" cy="40" r="5" fill="#374151"/>
      <circle cx="60" cy="45" r="4" fill="#374151"/>
      <circle cx="45" cy="55" r="3" fill="#374151"/>
    </svg>
  ),
  charcoal: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="20" width="40" height="60" rx="5" fill="#374151"/>
      <path d="M35 30 L35 70" stroke="#1F2937" stroke-width="3"/>
      <path d="M50 25 L50 75" stroke="#1F2937" stroke-width="3"/>
      <path d="M65 30 L65 70" stroke="#1F2937" stroke-width="3"/>
    </svg>
  ),
  iron_ore: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 50 L35 30 L65 30 L75 50 L65 70 L35 70 Z" fill="#6B7280" stroke="#4B5563" stroke-width="2"/>
      <circle cx="50" cy="50" r="15" fill="#EF4444"/>
      <circle cx="45" cy="45" r="3" fill="#DC2626"/>
    </svg>
  ),
  copper_ore: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 45 L40 25 L60 25 L70 45 L65 65 L35 65 Z" fill="#6B7280" stroke="#4B5563" stroke-width="2"/>
      <circle cx="50" cy="45" r="12" fill="#F97316"/>
      <circle cx="47" cy="42" r="2" fill="#EA580C"/>
    </svg>
  ),
  iron: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="30" width="40" height="40" rx="5" fill="#E5E7EB"/>
      <rect x="35" y="35" width="30" height="30" rx="3" fill="#D1D5DB"/>
    </svg>
  ),
  copper: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="30" width="40" height="40" rx="5" fill="#FB923C"/>
      <rect x="35" y="35" width="30" height="30" rx="3" fill="#F97316"/>
    </svg>
  ),
  coke: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="50" height="50" rx="8" fill="#111827"/>
      <rect x="35" y="35" width="10" height="10" fill="#1F2937"/>
      <rect x="55" y="35" width="10" height="10" fill="#1F2937"/>
      <rect x="35" y="55" width="10" height="10" fill="#1F2937"/>
      <rect x="55" y="55" width="10" height="10" fill="#1F2937"/>
    </svg>
  ),
  tar: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="60" rx="30" ry="20" fill="#000000"/>
      <ellipse cx="50" cy="55" rx="25" ry="15" fill="#1F2937"/>
    </svg>
  ),
  furnace: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="60" height="60" fill="#4B5563" stroke="#374151" stroke-width="2"/>
      <rect x="30" y="30" width="40" height="30" fill="#1F2937"/>
      <rect x="35" y="40" width="30" height="15" fill="#F97316"/>
      <rect x="40" y="65" width="20" height="10" fill="#374151"/>
    </svg>
  ),
  pickaxe: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 30 L45 45 L50 40 L35 25 Z" fill="#9CA3AF" stroke="#6B7280" stroke-width="2"/>
      <rect x="45" y="45" width="8" height="40" rx="2" fill="#8B572A" transform="rotate(-45 45 45)"/>
    </svg>
  ),
  iron_pickaxe: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 30 L45 45 L50 40 L35 25 Z" fill="#E5E7EB" stroke="#D1D5DB" stroke-width="2"/>
      <rect x="45" y="45" width="8" height="40" rx="2" fill="#8B572A" transform="rotate(-45 45 45)"/>
    </svg>
  ),
  chest: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="40" width="60" height="40" fill="#8B572A" stroke="#654321" stroke-width="2"/>
      <rect x="20" y="30" width="60" height="15" rx="7" fill="#A0522D" stroke="#654321" stroke-width="2"/>
      <rect x="45" y="35" width="10" height="15" fill="#FFD700" stroke="#FFA500" stroke-width="1"/>
    </svg>
  ),
  wrench: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 25 Q35 15, 45 25 L55 35 Q65 45, 55 55 L45 65 Q35 75, 25 65 L35 55 L45 45 L35 35 Z" fill="#9CA3AF" stroke="#6B7280" stroke-width="2"/>
      <rect x="50" y="50" width="30" height="8" rx="2" fill="#9CA3AF" transform="rotate(45 50 50)"/>
    </svg>
  ),
  coke_oven: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="60" height="60" fill="#DC2626" stroke="#991B1B" stroke-width="2"/>
      <rect x="30" y="30" width="40" height="40" fill="#7F1D1D"/>
      <rect x="35" y="35" width="30" height="30" fill="#991B1B"/>
      <circle cx="50" cy="50" r="10" fill="#F97316"/>
    </svg>
  ),
  
  // World resources
  tree: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="45" y="60" width="10" height="30" fill="#8B572A"/>
      <circle cx="50" cy="40" r="25" fill="#228B22"/>
      <circle cx="40" cy="35" r="20" fill="#2E7D32"/>
      <circle cx="60" cy="35" r="20" fill="#2E7D32"/>
    </svg>
  ),
  rock: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 70 L25 50 L35 40 L50 35 L65 40 L75 50 L70 70 Z" fill="#9CA3AF"/>
      <path d="M30 70 L35 40 L50 35 L50 70 Z" fill="#6B7280"/>
      <path d="M50 35 L65 40 L60 50 L50 55 Z" fill="#E5E7EB"/>
    </svg>
  ),
  coal_deposit: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 60 L30 40 L50 30 L70 40 L75 60 L50 75 Z" fill="#374151"/>
      <circle cx="40" cy="45" r="8" fill="#1F2937"/>
      <circle cx="60" cy="50" r="6" fill="#1F2937"/>
      <circle cx="50" cy="60" r="7" fill="#1F2937"/>
    </svg>
  ),
  iron_deposit: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 65 L25 45 L40 35 L60 35 L75 45 L70 65 L50 70 Z" fill="#6B7280"/>
      <ellipse cx="50" cy="50" rx="20" ry="15" fill="#DC2626"/>
      <ellipse cx="45" cy="48" rx="8" ry="6" fill="#EF4444"/>
    </svg>
  ),
  sand_deposit: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="60" rx="30" ry="20" fill="#FDE047"/>
      <ellipse cx="35" cy="55" rx="20" ry="15" fill="#FEF3C7"/>
      <ellipse cx="65" cy="55" rx="20" ry="15" fill="#FEF3C7"/>
    </svg>
  ),
  clay_deposit: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="60" rx="30" ry="20" fill="#A78BFA"/>
      <ellipse cx="50" cy="55" rx="25" ry="15" fill="#C4B5FD"/>
      <path d="M30 55 Q50 65 70 55" fill="#8B5CF6"/>
    </svg>
  ),
};