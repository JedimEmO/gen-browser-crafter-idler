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
  
  // Item icons
  stick: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="45" y="10" width="10" height="80" rx="5" fill="#8B572A"/>
      <rect x="47" y="10" width="6" height="80" rx="3" fill="#A0522D"/>
      <line x1="50" y1="15" x2="50" y2="85" stroke="#654321" stroke-width="1"/>
      <line x1="48" y1="30" x2="48" y2="70" stroke="#654321" stroke-width="0.5"/>
      <line x1="52" y1="40" x2="52" y2="60" stroke="#654321" stroke-width="0.5"/>
    </svg>
  ),
  iron_ingot: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="35" width="60" height="30" rx="3" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2"/>
      <rect x="25" y="40" width="50" height="20" rx="2" fill="#F3F4F6"/>
      <line x1="25" y1="45" x2="75" y2="45" stroke="#D1D5DB" stroke-width="1"/>
      <line x1="25" y1="50" x2="75" y2="50" stroke="#D1D5DB" stroke-width="1"/>
      <line x1="25" y1="55" x2="75" y2="55" stroke="#D1D5DB" stroke-width="1"/>
    </svg>
  ),
  gear: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50, 50)">
        {/* Gear teeth */}
        <rect x="-5" y="-30" width="10" height="15" fill="#6B7280"/>
        <rect x="-5" y="15" width="10" height="15" fill="#6B7280"/>
        <rect x="-30" y="-5" width="15" height="10" fill="#6B7280"/>
        <rect x="15" y="-5" width="15" height="10" fill="#6B7280"/>
        <rect x="-25" y="-25" width="12" height="12" fill="#6B7280" transform="rotate(45 -19 -19)"/>
        <rect x="13" y="-25" width="12" height="12" fill="#6B7280" transform="rotate(45 19 -19)"/>
        <rect x="-25" y="13" width="12" height="12" fill="#6B7280" transform="rotate(45 -19 19)"/>
        <rect x="13" y="13" width="12" height="12" fill="#6B7280" transform="rotate(45 19 19)"/>
        {/* Center circle */}
        <circle cx="0" cy="0" r="20" fill="#9CA3AF" stroke="#374151" stroke-width="2"/>
        <circle cx="0" cy="0" r="8" fill="#374151"/>
      </g>
    </svg>
  ),
  sand: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="30" fill="#FDE047"/>
      <circle cx="45" cy="45" r="25" fill="#FBBF24"/>
      <circle cx="40" cy="40" r="2" fill="#F59E0B"/>
      <circle cx="55" cy="45" r="1.5" fill="#F59E0B"/>
      <circle cx="48" cy="52" r="1" fill="#F59E0B"/>
      <circle cx="60" cy="55" r="1.5" fill="#F59E0B"/>
      <circle cx="42" cy="58" r="1" fill="#F59E0B"/>
    </svg>
  ),
  clay: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="30" ry="25" fill="#A78BFA"/>
      <ellipse cx="50" cy="48" rx="25" ry="20" fill="#C4B5FD"/>
      <path d="M30 45 Q50 50 70 45" stroke="#8B5CF6" stroke-width="2" fill="none"/>
      <path d="M35 55 Q50 60 65 55" stroke="#8B5CF6" stroke-width="1.5" fill="none"/>
    </svg>
  ),
  brick_mixture: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="55" rx="30" ry="20" fill="#92400E"/>
      <ellipse cx="50" cy="52" rx="25" ry="15" fill="#A16207"/>
      <circle cx="40" cy="50" r="3" fill="#FBBF24" opacity="0.7"/>
      <circle cx="60" cy="53" r="2.5" fill="#FBBF24" opacity="0.7"/>
      <circle cx="48" cy="56" r="2" fill="#FBBF24" opacity="0.7"/>
      <path d="M35 52 Q45 55 55 52" stroke="#A78BFA" stroke-width="2" opacity="0.6" fill="none"/>
    </svg>
  ),
  brick: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="60" height="40" rx="2" fill="#DC2626" stroke="#991B1B" stroke-width="2"/>
      <rect x="25" y="35" width="50" height="30" rx="1" fill="#EF4444"/>
      {/* Mortar lines */}
      <line x1="25" y1="50" x2="75" y2="50" stroke="#991B1B" stroke-width="1"/>
      <line x1="50" y1="35" x2="50" y2="50" stroke="#991B1B" stroke-width="1"/>
      <line x1="40" y1="50" x2="40" y2="65" stroke="#991B1B" stroke-width="1"/>
      <line x1="60" y1="50" x2="60" y2="65" stroke="#991B1B" stroke-width="1"/>
    </svg>
  ),
  coal_coke: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="50" height="50" rx="5" fill="#0F172A" stroke="#1E293B" stroke-width="2"/>
      <rect x="30" y="30" width="40" height="40" rx="3" fill="#1E293B"/>
      {/* Grid pattern */}
      <rect x="35" y="35" width="12" height="12" fill="#334155"/>
      <rect x="53" y="35" width="12" height="12" fill="#334155"/>
      <rect x="35" y="53" width="12" height="12" fill="#334155"/>
      <rect x="53" y="53" width="12" height="12" fill="#334155"/>
    </svg>
  ),
  
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
  crafting_bench: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="52" cy="88" rx="40" ry="8" fill="#1F2937" opacity="0.3"/>
      
      {/* Table legs */}
      <rect x="25" y="65" width="8" height="20" fill="#654321"/>
      <rect x="67" y="65" width="8" height="20" fill="#654321"/>
      <rect x="25" y="65" width="8" height="3" fill="#8B572A"/>
      <rect x="67" y="65" width="8" height="3" fill="#8B572A"/>
      
      {/* Main table surface */}
      <rect x="15" y="50" width="70" height="20" rx="2" fill="#8B572A" stroke="#654321" stroke-width="2"/>
      <rect x="18" y="53" width="64" height="14" rx="1" fill="#A0522D"/>
      
      {/* Wood grain */}
      <path d="M20 58 Q35 60 50 58 Q65 56 80 58" stroke="#654321" stroke-width="1" opacity="0.6"/>
      <path d="M20 62 Q40 64 60 62 Q75 60 80 62" stroke="#654321" stroke-width="0.8" opacity="0.5"/>
      
      {/* Crafting grid surface */}
      <rect x="25" y="30" width="30" height="30" rx="2" fill="#9CA3AF" stroke="#6B7280" stroke-width="1.5"/>
      <rect x="27" y="32" width="26" height="26" rx="1" fill="#D1D5DB"/>
      
      {/* 3x3 grid lines */}
      <line x1="35" y1="32" x2="35" y2="58" stroke="#6B7280" stroke-width="1"/>
      <line x1="45" y1="32" x2="45" y2="58" stroke="#6B7280" stroke-width="1"/>
      <line x1="27" y1="40" x2="53" y2="40" stroke="#6B7280" stroke-width="1"/>
      <line x1="27" y1="50" x2="53" y2="50" stroke="#6B7280" stroke-width="1"/>
      
      {/* Tools on the side */}
      <rect x="60" y="32" width="2" height="15" rx="1" fill="#8B572A"/>
      <rect x="58" y="30" width="6" height="4" rx="1" fill="#6B7280"/>
      
      <rect x="65" y="35" width="12" height="2" rx="1" fill="#8B572A"/>
      <rect x="75" y="33" width="4" height="6" rx="1" fill="#6B7280"/>
      
      {/* Small parts/components */}
      <circle cx="70" cy="45" r="2" fill="#4B5563"/>
      <circle cx="75" cy="48" r="1.5" fill="#6B7280"/>
      <rect x="68" y="52" width="8" height="3" rx="1" fill="#A0522D"/>
      
      {/* Highlight on table edge */}
      <rect x="15" y="50" width="70" height="3" rx="2" fill="#D1914D" opacity="0.7"/>
    </svg>
  ),
  furnace: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="52" cy="92" rx="35" ry="6" fill="#111827" opacity="0.4"/>
      
      {/* Main furnace body */}
      <rect x="20" y="25" width="60" height="60" rx="3" fill="#4B5563" stroke="#374151" stroke-width="2"/>
      <rect x="22" y="27" width="56" height="56" rx="2" fill="#6B7280"/>
      
      {/* Metal panels with rivets */}
      <rect x="25" y="30" width="50" height="20" fill="#9CA3AF"/>
      <rect x="25" y="55" width="50" height="25" fill="#9CA3AF"/>
      
      {/* Rivets */}
      <circle cx="30" cy="35" r="1.5" fill="#374151"/>
      <circle cx="70" cy="35" r="1.5" fill="#374151"/>
      <circle cx="30" cy="45" r="1.5" fill="#374151"/>
      <circle cx="70" cy="45" r="1.5" fill="#374151"/>
      <circle cx="30" cy="65" r="1.5" fill="#374151"/>
      <circle cx="70" cy="65" r="1.5" fill="#374151"/>
      <circle cx="30" cy="75" r="1.5" fill="#374151"/>
      <circle cx="70" cy="75" r="1.5" fill="#374151"/>
      
      {/* Furnace door */}
      <rect x="35" y="35" width="30" height="25" rx="2" fill="#1F2937" stroke="#111827" stroke-width="1.5"/>
      <rect x="37" y="37" width="26" height="21" rx="1" fill="#374151"/>
      
      {/* Door handle */}
      <rect x="60" y="46" width="6" height="3" rx="1.5" fill="#9CA3AF"/>
      <circle cx="63" cy="47.5" r="1" fill="#4B5563"/>
      
      {/* Fire glow inside */}
      <ellipse cx="50" cy="47" rx="10" ry="8" fill="#F97316" opacity="0.8"/>
      <ellipse cx="50" cy="45" rx="6" ry="5" fill="#FB923C"/>
      <ellipse cx="50" cy="44" rx="3" ry="3" fill="#FED7AA"/>
      
      {/* Flame effects */}
      <path d="M45 44 Q47 40 49 44 Q51 38 53 44" stroke="#F97316" stroke-width="1.5" fill="none" opacity="0.7"/>
      <path d="M47 46 Q49 42 51 46" stroke="#FB923C" stroke-width="1" fill="none" opacity="0.8"/>
      
      {/* Heat vents on top */}
      <rect x="35" y="25" width="4" height="8" rx="2" fill="#111827"/>
      <rect x="42" y="25" width="4" height="8" rx="2" fill="#111827"/>
      <rect x="54" y="25" width="4" height="8" rx="2" fill="#111827"/>
      <rect x="61" y="25" width="4" height="8" rx="2" fill="#111827"/>
      
      {/* Heat shimmer effect */}
      <path d="M37 28 Q40 26 43 28" stroke="#F97316" stroke-width="0.5" opacity="0.6"/>
      <path d="M56 28 Q59 26 62 28" stroke="#F97316" stroke-width="0.5" opacity="0.6"/>
      
      {/* Control panel */}
      <rect x="25" y="65" width="15" height="10" rx="1" fill="#4B5563"/>
      <circle cx="30" cy="70" r="2" fill="#1F2937"/>
      <circle cx="35" cy="70" r="2" fill="#1F2937"/>
      <circle cx="32.5" cy="70" r="0.5" fill="#DC2626"/>
      
      {/* Base platform */}
      <rect x="15" y="80" width="70" height="5" rx="2" fill="#374151"/>
      <rect x="15" y="80" width="70" height="2" rx="2" fill="#4B5563"/>
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
      {/* Shadow */}
      <ellipse cx="52" cy="88" rx="35" ry="6" fill="#1F2937" opacity="0.3"/>
      
      {/* Main chest body */}
      <rect x="20" y="40" width="60" height="40" rx="2" fill="#8B572A" stroke="#654321" stroke-width="2"/>
      <rect x="22" y="42" width="56" height="36" rx="1" fill="#A0522D"/>
      
      {/* Wood grain */}
      <path d="M25 50 Q40 52 55 50 Q70 48 75 50" stroke="#654321" stroke-width="1" opacity="0.6"/>
      <path d="M25 60 Q35 62 45 60 Q55 58 65 60 Q75 62 75 60" stroke="#654321" stroke-width="0.8" opacity="0.5"/>
      <path d="M25 70 Q40 72 55 70 Q70 68 75 70" stroke="#654321" stroke-width="1" opacity="0.6"/>
      
      {/* Chest lid */}
      <rect x="20" y="30" width="60" height="18" rx="8" fill="#A0522D" stroke="#654321" stroke-width="2"/>
      <rect x="22" y="32" width="56" height="14" rx="6" fill="#D1914D"/>
      
      {/* Lid wood grain */}
      <path d="M25 37 Q40 39 55 37 Q70 35 75 37" stroke="#654321" stroke-width="0.8" opacity="0.6"/>
      <path d="M25 42 Q50 44 75 42" stroke="#654321" stroke-width="0.6" opacity="0.5"/>
      
      {/* Metal reinforcements */}
      <rect x="18" y="38" width="64" height="4" rx="2" fill="#6B7280"/>
      <rect x="18" y="76" width="64" height="4" rx="2" fill="#6B7280"/>
      <rect x="18" y="30" width="4" height="50" rx="2" fill="#6B7280"/>
      <rect x="78" y="30" width="4" height="50" rx="2" fill="#6B7280"/>
      
      {/* Corner reinforcements */}
      <rect x="16" y="28" width="8" height="8" rx="2" fill="#4B5563"/>
      <rect x="76" y="28" width="8" height="8" rx="2" fill="#4B5563"/>
      <rect x="16" y="76" width="8" height="8" rx="2" fill="#4B5563"/>
      <rect x="76" y="76" width="8" height="8" rx="2" fill="#4B5563"/>
      
      {/* Rivets on metal */}
      <circle cx="20" cy="40" r="1" fill="#374151"/>
      <circle cx="80" cy="40" r="1" fill="#374151"/>
      <circle cx="20" cy="78" r="1" fill="#374151"/>
      <circle cx="80" cy="78" r="1" fill="#374151"/>
      
      {/* Lock mechanism */}
      <rect x="45" y="35" width="10" height="18" rx="2" fill="#4B5563" stroke="#374151" stroke-width="1"/>
      <rect x="47" y="37" width="6" height="14" rx="1" fill="#6B7280"/>
      
      {/* Keyhole */}
      <circle cx="50" cy="44" r="2.5" fill="#1F2937"/>
      <rect x="49" y="44" width="2" height="6" fill="#1F2937"/>
      
      {/* Lock highlight */}
      <rect x="47" y="37" width="6" height="3" rx="1" fill="#9CA3AF" opacity="0.7"/>
      
      {/* Chest handle/latch */}
      <ellipse cx="50" cy="32" rx="8" ry="3" fill="#6B7280"/>
      <ellipse cx="50" cy="31" rx="6" ry="2" fill="#9CA3AF"/>
    </svg>
  ),
  wrench: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 25 Q35 15, 45 25 L55 35 Q65 45, 55 55 L45 65 Q35 75, 25 65 L35 55 L45 45 L35 35 Z" fill="#9CA3AF" stroke="#6B7280" stroke-width="2"/>
      <rect x="50" y="50" width="30" height="8" rx="2" fill="#9CA3AF" transform="rotate(45 50 50)"/>
    </svg>
  ),
  hammer: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wooden handle */}
      <rect x="35" y="55" width="8" height="35" rx="4" fill="#8B572A" stroke="#654321" stroke-width="1"/>
      <rect x="36" y="56" width="6" height="33" rx="3" fill="#A0522D"/>
      
      {/* Handle wood grain */}
      <line x1="37" y1="60" x2="37" y2="85" stroke="#654321" stroke-width="0.5" opacity="0.7"/>
      <line x1="41" y1="62" x2="41" y2="83" stroke="#654321" stroke-width="0.5" opacity="0.6"/>
      
      {/* Handle wrap/grip */}
      <rect x="35" y="70" width="8" height="3" fill="#654321" opacity="0.8"/>
      <rect x="35" y="75" width="8" height="3" fill="#654321" opacity="0.8"/>
      
      {/* Main hammer head - rectangular metal block */}
      <rect x="25" y="35" width="28" height="16" rx="2" fill="#9CA3AF" stroke="#6B7280" stroke-width="2"/>
      <rect x="27" y="37" width="24" height="12" rx="1" fill="#D1D5DB"/>
      
      {/* Hammer head highlights and depth */}
      <rect x="27" y="37" width="24" height="4" rx="1" fill="#E5E7EB"/>
      <rect x="27" y="45" width="24" height="2" fill="#6B7280" opacity="0.6"/>
      
      {/* Metal texture lines */}
      <line x1="30" y1="39" x2="48" y2="39" stroke="#9CA3AF" stroke-width="0.5"/>
      <line x1="30" y1="41" x2="48" y2="41" stroke="#9CA3AF" stroke-width="0.5"/>
      <line x1="30" y1="45" x2="48" y2="45" stroke="#9CA3AF" stroke-width="0.5"/>
      
      {/* Handle connection - metal ferrule */}
      <rect x="34" y="48" width="10" height="8" rx="1" fill="#6B7280" stroke="#4B5563" stroke-width="1"/>
      <rect x="35" y="49" width="8" height="6" rx="0.5" fill="#9CA3AF"/>
      
      {/* Connection rivets */}
      <circle cx="37" cy="52" r="0.8" fill="#4B5563"/>
      <circle cx="41" cy="52" r="0.8" fill="#4B5563"/>
      
      {/* Strike marks on hammer face */}
      <circle cx="45" cy="43" r="1.5" fill="#9CA3AF" opacity="0.8"/>
      <circle cx="42" cy="41" r="1" fill="#9CA3AF" opacity="0.6"/>
      
      {/* Shadow under head */}
      <ellipse cx="39" cy="52" rx="12" ry="2" fill="#6B7280" opacity="0.3"/>
    </svg>
  ),
  iron_plate: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main plate body */}
      <rect x="15" y="35" width="70" height="30" rx="2" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2"/>
      <rect x="18" y="38" width="64" height="24" rx="1" fill="#F3F4F6"/>
      
      {/* Metal surface texture */}
      <rect x="20" y="40" width="60" height="20" rx="1" fill="#D1D5DB"/>
      
      {/* Brushed metal effect lines */}
      <line x1="22" y1="43" x2="78" y2="43" stroke="#9CA3AF" stroke-width="0.5" opacity="0.6"/>
      <line x1="22" y1="47" x2="78" y2="47" stroke="#9CA3AF" stroke-width="0.5" opacity="0.6"/>
      <line x1="22" y1="51" x2="78" y2="51" stroke="#9CA3AF" stroke-width="0.5" opacity="0.6"/>
      <line x1="22" y1="55" x2="78" y2="55" stroke="#9CA3AF" stroke-width="0.5" opacity="0.6"/>
      <line x1="22" y1="57" x2="78" y2="57" stroke="#9CA3AF" stroke-width="0.5" opacity="0.6"/>
      
      {/* Corner rivet holes */}
      <circle cx="25" cy="42" r="3" fill="#6B7280" stroke="#4B5563" stroke-width="1"/>
      <circle cx="75" cy="42" r="3" fill="#6B7280" stroke="#4B5563" stroke-width="1"/>
      <circle cx="25" cy="58" r="3" fill="#6B7280" stroke="#4B5563" stroke-width="1"/>
      <circle cx="75" cy="58" r="3" fill="#6B7280" stroke="#4B5563" stroke-width="1"/>
      
      {/* Inner rivet holes */}
      <circle cx="25" cy="42" r="1.5" fill="#374151"/>
      <circle cx="75" cy="42" r="1.5" fill="#374151"/>
      <circle cx="25" cy="58" r="1.5" fill="#374151"/>
      <circle cx="75" cy="58" r="1.5" fill="#374151"/>
      
      {/* Center mounting holes */}
      <circle cx="40" cy="50" r="2" fill="#6B7280" stroke="#4B5563" stroke-width="0.5"/>
      <circle cx="60" cy="50" r="2" fill="#6B7280" stroke="#4B5563" stroke-width="0.5"/>
      <circle cx="40" cy="50" r="1" fill="#374151"/>
      <circle cx="60" cy="50" r="1" fill="#374151"/>
      
      {/* Top highlight */}
      <rect x="18" y="36" width="64" height="4" rx="1" fill="#F9FAFB" opacity="0.8"/>
      
      {/* Bottom shadow */}
      <rect x="18" y="60" width="64" height="3" rx="1" fill="#9CA3AF" opacity="0.6"/>
      
      {/* Edge bevels */}
      <line x1="15" y1="37" x2="85" y2="37" stroke="#F9FAFB" stroke-width="1" opacity="0.8"/>
      <line x1="15" y1="63" x2="85" y2="63" stroke="#6B7280" stroke-width="1" opacity="0.7"/>
    </svg>
  ),
  steel_ingot: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main ingot body - darker blue-gray steel */}
      <rect x="20" y="35" width="60" height="30" rx="3" fill="#475569" stroke="#334155" stroke-width="2"/>
      <rect x="23" y="38" width="54" height="24" rx="2" fill="#64748B"/>
      
      {/* Polished steel surface with blue tint */}
      <rect x="25" y="40" width="50" height="20" rx="2" fill="#7C8E9F"/>
      
      {/* Steel shine highlight on top */}
      <rect x="25" y="40" width="50" height="6" rx="2" fill="#9DB2C5" opacity="0.9"/>
      
      {/* Polished metal reflection lines */}
      <line x1="27" y1="43" x2="73" y2="43" stroke="#B4C7DB" stroke-width="1" opacity="0.8"/>
      <line x1="27" y1="47" x2="73" y2="47" stroke="#94A3B8" stroke-width="0.8" opacity="0.7"/>
      <line x1="27" y1="51" x2="73" y2="51" stroke="#94A3B8" stroke-width="0.8" opacity="0.7"/>
      <line x1="27" y1="55" x2="73" y2="55" stroke="#94A3B8" stroke-width="0.8" opacity="0.7"/>
      <line x1="27" y1="57" x2="73" y2="57" stroke="#64748B" stroke-width="0.6" opacity="0.6"/>
      
      {/* Steel ingot characteristic marks */}
      <rect x="30" y="44" width="4" height="2" rx="1" fill="#334155" opacity="0.6"/>
      <rect x="36" y="44" width="4" height="2" rx="1" fill="#334155" opacity="0.6"/>
      <rect x="42" y="44" width="4" height="2" rx="1" fill="#334155" opacity="0.6"/>
      <rect x="48" y="44" width="4" height="2" rx="1" fill="#334155" opacity="0.6"/>
      <rect x="54" y="44" width="4" height="2" rx="1" fill="#334155" opacity="0.6"/>
      <rect x="60" y="44" width="4" height="2" rx="1" fill="#334155" opacity="0.6"/>
      <rect x="66" y="44" width="4" height="2" rx="1" fill="#334155" opacity="0.6"/>
      
      {/* Sleek bottom shadow */}
      <rect x="23" y="58" width="54" height="4" rx="2" fill="#1E293B" opacity="0.7"/>
      
      {/* Steel edge highlights */}
      <line x1="20" y1="37" x2="80" y2="37" stroke="#B4C7DB" stroke-width="1.5" opacity="0.9"/>
      <line x1="22" y1="39" x2="78" y2="39" stroke="#9DB2C5" stroke-width="1" opacity="0.8"/>
      
      {/* Bottom edge definition */}
      <line x1="20" y1="63" x2="80" y2="63" stroke="#1E293B" stroke-width="1.5" opacity="0.8"/>
      
      {/* Corner chamfers for industrial look */}
      <path d="M20 38 L23 35 L23 38 Z" fill="#334155"/>
      <path d="M80 38 L77 35 L77 38 Z" fill="#334155"/>
      <path d="M20 62 L23 65 L23 62 Z" fill="#334155"/>
      <path d="M80 62 L77 65 L77 62 Z" fill="#334155"/>
    </svg>
  ),
  blast_furnace: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="52" cy="94" rx="42" ry="4" fill="#111827" opacity="0.4"/>
      
      {/* Main blast furnace body - tall and imposing */}
      <rect x="15" y="20" width="70" height="70" rx="5" fill="#991B1B" stroke="#7F1D1D" stroke-width="2"/>
      <rect x="17" y="22" width="66" height="66" rx="4" fill="#DC2626"/>
      
      {/* Wide base foundation */}
      <rect x="10" y="75" width="80" height="15" rx="3" fill="#4B5563" stroke="#374151" stroke-width="2"/>
      <rect x="12" y="77" width="76" height="11" rx="2" fill="#6B7280"/>
      
      {/* Brick pattern on main body */}
      <rect x="20" y="25" width="60" height="10" fill="#EF4444"/>
      <rect x="20" y="40" width="60" height="10" fill="#EF4444"/>
      <rect x="20" y="55" width="60" height="10" fill="#EF4444"/>
      <rect x="20" y="70" width="60" height="10" fill="#EF4444"/>
      
      {/* Brick divisions - staggered pattern */}
      <line x1="35" y1="25" x2="35" y2="35" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="50" y1="25" x2="50" y2="35" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="65" y1="25" x2="65" y2="35" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="27" y1="40" x2="27" y2="50" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="42" y1="40" x2="42" y2="50" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="57" y1="40" x2="57" y2="50" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="72" y1="40" x2="72" y2="50" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="35" y1="55" x2="35" y2="65" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="50" y1="55" x2="50" y2="65" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="65" y1="55" x2="65" y2="65" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="27" y1="70" x2="27" y2="80" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="42" y1="70" x2="42" y2="80" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="57" y1="70" x2="57" y2="80" stroke="#991B1B" stroke-width="1.5"/>
      <line x1="72" y1="70" x2="72" y2="80" stroke="#991B1B" stroke-width="1.5"/>
      
      {/* Metal reinforcement bands */}
      <rect x="12" y="30" width="76" height="4" rx="2" fill="#4B5563"/>
      <rect x="12" y="50" width="76" height="4" rx="2" fill="#4B5563"/>
      <rect x="12" y="70" width="76" height="4" rx="2" fill="#4B5563"/>
      
      {/* Rivets on metal bands */}
      <circle cx="20" cy="32" r="1.5" fill="#9CA3AF"/>
      <circle cx="35" cy="32" r="1.5" fill="#9CA3AF"/>
      <circle cx="50" cy="32" r="1.5" fill="#9CA3AF"/>
      <circle cx="65" cy="32" r="1.5" fill="#9CA3AF"/>
      <circle cx="80" cy="32" r="1.5" fill="#9CA3AF"/>
      <circle cx="20" cy="52" r="1.5" fill="#9CA3AF"/>
      <circle cx="80" cy="52" r="1.5" fill="#9CA3AF"/>
      <circle cx="20" cy="72" r="1.5" fill="#9CA3AF"/>
      <circle cx="80" cy="72" r="1.5" fill="#9CA3AF"/>
      
      {/* Large furnace opening */}
      <rect x="30" y="45" width="40" height="30" rx="4" fill="#000000" stroke="#111827" stroke-width="2"/>
      <rect x="32" y="47" width="36" height="26" rx="3" fill="#1F2937"/>
      
      {/* Intense heat glow - much brighter than regular furnace */}
      <ellipse cx="50" cy="60" rx="16" ry="12" fill="#DC2626" opacity="0.9"/>
      <ellipse cx="50" cy="58" rx="12" ry="9" fill="#EF4444"/>
      <ellipse cx="50" cy="56" rx="8" ry="6" fill="#F97316"/>
      <ellipse cx="50" cy="54" rx="5" ry="4" fill="#FED7AA"/>
      
      {/* Molten metal effect */}
      <ellipse cx="50" cy="68" rx="14" ry="4" fill="#F97316" opacity="0.8"/>
      <circle cx="45" cy="68" r="2" fill="#DC2626"/>
      <circle cx="55" cy="68" r="1.5" fill="#EF4444"/>
      <circle cx="50" cy="70" r="1" fill="#F97316"/>
      
      {/* Tall chimney stack */}
      <rect x="43" y="8" width="14" height="18" rx="2" fill="#4B5563" stroke="#374151" stroke-width="2"/>
      <rect x="45" y="10" width="10" height="14" rx="1" fill="#6B7280"/>
      
      {/* Chimney cap */}
      <rect x="40" y="6" width="20" height="4" rx="2" fill="#9CA3AF"/>
      <rect x="42" y="8" width="16" height="2" rx="1" fill="#D1D5DB"/>
      
      {/* Heavy smoke from chimney */}
      <ellipse cx="50" cy="4" rx="6" ry="2" fill="#6B7280" opacity="0.6"/>
      <ellipse cx="52" cy="1" rx="4" ry="1.5" fill="#6B7280" opacity="0.4"/>
      <ellipse cx="48" cy="-1" rx="3" ry="1" fill="#6B7280" opacity="0.3"/>
      
      {/* Heat shimmer from top */}
      <path d="M25 18 Q27 16 29 18" stroke="#F97316" stroke-width="0.8" opacity="0.6"/>
      <path d="M35 16 Q37 14 39 16" stroke="#F97316" stroke-width="0.8" opacity="0.6"/>
      <path d="M61 16 Q63 14 65 16" stroke="#F97316" stroke-width="0.8" opacity="0.6"/>
      <path d="M71 18 Q73 16 75 18" stroke="#F97316" stroke-width="0.8" opacity="0.6"/>
      
      {/* Industrial pipes on sides */}
      <rect x="8" y="35" width="6" height="25" rx="3" fill="#9CA3AF" stroke="#6B7280" stroke-width="1"/>
      <rect x="86" y="35" width="6" height="25" rx="3" fill="#9CA3AF" stroke="#6B7280" stroke-width="1"/>
      <circle cx="11" cy="40" r="2" fill="#4B5563"/>
      <circle cx="89" cy="40" r="2" fill="#4B5563"/>
      <circle cx="11" cy="55" r="2" fill="#4B5563"/>
      <circle cx="89" cy="55" r="2" fill="#4B5563"/>
      
      {/* Temperature gauges */}
      <circle cx="22" cy="38" r="3" fill="#374151"/>
      <circle cx="22" cy="38" r="2.5" fill="#1F2937"/>
      <circle cx="22" cy="38" r="1" fill="#DC2626"/>
      <circle cx="78" cy="38" r="3" fill="#374151"/>
      <circle cx="78" cy="38" r="2.5" fill="#1F2937"/>
      <circle cx="78" cy="38" r="1" fill="#EF4444"/>
      
      {/* Control valves */}
      <rect x="75" y="62" width="12" height="8" rx="2" fill="#4B5563"/>
      <rect x="77" y="64" width="8" height="4" rx="1" fill="#6B7280"/>
      <circle cx="81" cy="66" r="1.5" fill="#374151"/>
      
      {/* Inspection window */}
      <rect x="70" y="48" width="8" height="8" rx="1" fill="#111827" stroke="#000000" stroke-width="1"/>
      <circle cx="74" cy="52" r="2" fill="#F97316" opacity="0.8"/>
    </svg>
  ),
  coke_oven: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="52" cy="92" rx="38" ry="6" fill="#111827" opacity="0.4"/>
      
      {/* Main oven body - brick construction */}
      <rect x="18" y="25" width="64" height="60" rx="4" fill="#991B1B" stroke="#7F1D1D" stroke-width="2"/>
      <rect x="20" y="27" width="60" height="56" rx="3" fill="#DC2626"/>
      
      {/* Brick pattern */}
      <rect x="22" y="30" width="56" height="8" fill="#EF4444"/>
      <rect x="22" y="42" width="56" height="8" fill="#EF4444"/>
      <rect x="22" y="54" width="56" height="8" fill="#EF4444"/>
      <rect x="22" y="66" width="56" height="8" fill="#EF4444"/>
      
      {/* Brick divisions */}
      <line x1="35" y1="30" x2="35" y2="38" stroke="#991B1B" stroke-width="1"/>
      <line x1="50" y1="30" x2="50" y2="38" stroke="#991B1B" stroke-width="1"/>
      <line x1="65" y1="30" x2="65" y2="38" stroke="#991B1B" stroke-width="1"/>
      <line x1="42" y1="42" x2="42" y2="50" stroke="#991B1B" stroke-width="1"/>
      <line x1="57" y1="42" x2="57" y2="50" stroke="#991B1B" stroke-width="1"/>
      <line x1="35" y1="54" x2="35" y2="62" stroke="#991B1B" stroke-width="1"/>
      <line x1="50" y1="54" x2="50" y2="62" stroke="#991B1B" stroke-width="1"/>
      <line x1="65" y1="54" x2="65" y2="62" stroke="#991B1B" stroke-width="1"/>
      <line x1="42" y1="66" x2="42" y2="74" stroke="#991B1B" stroke-width="1"/>
      <line x1="57" y1="66" x2="57" y2="74" stroke="#991B1B" stroke-width="1"/>
      
      {/* Furnace chamber opening */}
      <rect x="35" y="38" width="30" height="20" rx="3" fill="#111827" stroke="#000000" stroke-width="1.5"/>
      <rect x="37" y="40" width="26" height="16" rx="2" fill="#1F2937"/>
      
      {/* Intense heat glow */}
      <ellipse cx="50" cy="48" rx="12" ry="7" fill="#DC2626" opacity="0.9"/>
      <ellipse cx="50" cy="47" rx="8" ry="5" fill="#EF4444"/>
      <ellipse cx="50" cy="46" rx="5" ry="3" fill="#F97316"/>
      <ellipse cx="50" cy="45" rx="3" ry="2" fill="#FED7AA"/>
      
      {/* Hot coals effect */}
      <circle cx="45" cy="50" r="1.5" fill="#DC2626"/>
      <circle cx="55" cy="49" r="1" fill="#EF4444"/>
      <circle cx="50" cy="52" r="1" fill="#F97316"/>
      
      {/* Chimney/stack */}
      <rect x="45" y="15" width="10" height="15" rx="2" fill="#6B7280" stroke="#4B5563" stroke-width="1.5"/>
      <rect x="47" y="17" width="6" height="11" rx="1" fill="#9CA3AF"/>
      
      {/* Smoke/heat coming from chimney */}
      <ellipse cx="50" cy="12" rx="4" ry="2" fill="#6B7280" opacity="0.4"/>
      <ellipse cx="52" cy="8" rx="3" ry="1.5" fill="#6B7280" opacity="0.3"/>
      <ellipse cx="48" cy="5" rx="2" ry="1" fill="#6B7280" opacity="0.2"/>
      
      {/* Door mechanism/latch */}
      <rect x="68" y="45" width="8" height="6" rx="2" fill="#4B5563"/>
      <rect x="70" y="47" width="4" height="2" rx="1" fill="#6B7280"/>
      <circle cx="72" cy="48" r="1" fill="#374151"/>
      
      {/* Temperature gauge */}
      <circle cx="25" cy="35" r="4" fill="#374151"/>
      <circle cx="25" cy="35" r="3" fill="#1F2937"/>
      <circle cx="25" cy="35" r="1" fill="#DC2626"/>
      
      {/* Base/foundation */}
      <rect x="15" y="80" width="70" height="6" rx="3" fill="#4B5563"/>
      <rect x="15" y="80" width="70" height="3" rx="3" fill="#6B7280"/>
      
      {/* Heat shimmer lines */}
      <path d="M40 25 Q42 23 44 25" stroke="#F97316" stroke-width="0.5" opacity="0.5"/>
      <path d="M56 25 Q58 23 60 25" stroke="#F97316" stroke-width="0.5" opacity="0.5"/>
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