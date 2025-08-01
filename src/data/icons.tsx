import type { JSX } from 'solid-js';

type IconComponent = () => JSX.Element;

export const iconLibrary: Record<string, IconComponent> = {
  wood: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="10" width="60" height="80" rx="10" fill="#8B572A"/>
      <path d="M50 10 C 40 20, 40 80, 50 90" stroke="#654321" stroke-width="4"/>
      <path d="M50 10 C 60 20, 60 80, 50 90" stroke="#654321" stroke-width="4"/>
      <circle cx="35" cy="30" r="5" fill="#654321"/>
      <circle cx="65" cy="60" r="7" fill="#654321"/>
    </svg>
  ),
  stone: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 70 C 5 60, 15 30, 40 20 C 70 5, 95 30, 80 60 C 70 95, 30 90, 20 70 Z" fill="#808080"/>
      <path d="M30 60 L 40 50" stroke="#696969" stroke-width="5"/>
      <path d="M60 40 L 70 35" stroke="#696969" stroke-width="5"/>
    </svg>
  ),
  coal: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 75 C 10 65, 20 35, 45 25 C 75 10, 100 35, 85 65 C 75 100, 35 95, 25 75 Z" fill="#36454F"/>
    </svg>
  ),
  iron_ore: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 70 C 5 60, 15 30, 40 20 C 70 5, 95 30, 80 60 C 70 95, 30 90, 20 70 Z" fill="#808080"/>
      <rect x="30" y="35" width="10" height="10" fill="#E07C44" transform="rotate(20 30 35)"/>
      <rect x="60" y="60" width="15" height="15" fill="#D96C2E" transform="rotate(45 60 60)"/>
    </svg>
  ),
  iron_ingot: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 40 L20 20 H80 L90 40 V80 L80 90 H20 L10 80 V40 Z" fill="#D1D5DB" stroke="#9CA3AF" stroke-width="5"/>
    </svg>
  ),
  stick: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="45" width="80" height="10" rx="5" fill="#A0522D" transform="rotate(-30 50 50)"/>
      <rect x="10" y="45" width="80" height="10" rx="5" fill="#A0522D" transform="rotate(30 50 50)"/>
    </svg>
  ),
  pickaxe: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 50 L50 10 L60 20 L20 60 Z" fill="#8B572A"/>
      <path d="M90 50 L50 90 L40 80 L80 40 Z" fill="#8B572A"/>
      <rect x="45" y="5" width="10" height="90" rx="5" fill="#A0522D"/>
    </svg>
  ),
  iron_pickaxe: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 50 L50 10 L60 20 L20 60 Z" fill="#D1D5DB"/>
      <path d="M90 50 L50 90 L40 80 L80 40 Z" fill="#D1D5DB"/>
      <rect x="45" y="5" width="10" height="90" rx="5" fill="#A0522D"/>
    </svg>
  ),
  wrench: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="45" width="90" height="10" rx="5" fill="#9CA3AF"/>
      <path d="M10 35 C 0 35, 0 55, 10 55 V35 Z" fill="#9CA3AF"/>
      <path d="M20 25 H 40 V 65 H 20 V 25 Z" fill="#9CA3AF"/>
    </svg>
  ),
  gear: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10 L60 20 H40 L50 10 Z M90 50 L80 60 V40 L90 50 Z M50 90 L40 80 H60 L50 90 Z M10 50 L20 40 V60 L10 50 Z M78.28 21.72 L71.21 28.79 L61.21 18.79 L68.28 11.72 Z M21.72 21.72 L28.79 28.79 L18.79 38.79 L11.72 31.72 Z M21.72 78.28 L28.79 71.21 L18.79 61.21 L11.72 68.28 Z M78.28 78.28 L71.21 71.21 L61.21 81.21 L68.28 88.28 Z" fill="#9CA3AF"/>
      <circle cx="50" cy="50" r="20" fill="#9CA3AF"/>
    </svg>
  ),
  chest: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="30" width="80" height="60" rx="5" fill="#C68642"/>
      <rect x="5" y="20" width="90" height="20" rx="5" fill="#966939"/>
      <rect x="45" y="55" width="10" height="15" fill="#FFD700"/>
    </svg>
  ),
  furnace: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="80" height="80" rx="5" fill="#696969"/>
      <rect x="25" y="50" width="50" height="35" fill="#202020"/>
      <path d="M35 75 C 40 65, 45 65, 50 75 S 60 65, 65 75" stroke="#FF4500" stroke-width="5" fill="none"/>
    </svg>
  ),
  tree: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="60" width="20" height="40" fill="#8B572A"/>
      <circle cx="50" cy="40" r="30" fill="#228B22"/>
      <circle cx="35" cy="45" r="20" fill="#2E8B57"/>
      <circle cx="65" cy="45" r="20" fill="#2E8B57"/>
    </svg>
  ),
  rock: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 85 C 5 70, 10 40, 30 30 C 50 15, 80 20, 90 45 C 105 70, 80 95, 50 90 C 20 95, 20 90, 15 85 Z" fill="#A9A9A9"/>
    </svg>
  ),
  coal_deposit: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 85 C 5 70, 10 40, 30 30 C 50 15, 80 20, 90 45 C 105 70, 80 95, 50 90 C 20 95, 20 90, 15 85 Z" fill="#A9A9A9"/>
      <rect x="30" y="40" width="15" height="15" fill="#36454F" transform="rotate(15 30 40)"/>
      <rect x="60" y="65" width="20" height="20" fill="#2C3E50" transform="rotate(-25 60 65)"/>
    </svg>
  ),
  iron_deposit: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 85 C 5 70, 10 40, 30 30 C 50 15, 80 20, 90 45 C 105 70, 80 95, 50 90 C 20 95, 20 90, 15 85 Z" fill="#A9A9A9"/>
      <rect x="25" y="55" width="15" height="15" fill="#E07C44" transform="rotate(-30 25 55)"/>
      <rect x="65" y="35" width="20" height="20" fill="#D96C2E" transform="rotate(20 65 35)"/>
    </svg>
  ),
  sand: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 90 C 30 70, 70 70, 90 90" fill="#F0E68C" stroke="#DEB887" stroke-width="3"/>
      <path d="M20 80 C 40 60, 60 60, 80 80" fill="#F0E68C" stroke="#DEB887" stroke-width="3" opacity="0.7"/>
    </svg>
  ),
  clay: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 90 C 20 60, 80 60, 90 90" fill="#B0B0B0" stroke="#808080" stroke-width="3"/>
    </svg>
  ),
  brick_mixture: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 90 C 30 70, 70 70, 90 90" fill="#D2B48C"/>
      <circle cx="30" cy="80" r="5" fill="#B0B0B0"/>
      <circle cx="50" cy="75" r="7" fill="#B0B0B0"/>
      <circle cx="70" cy="80" r="5" fill="#B0B0B0"/>
    </svg>
  ),
  brick: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="35" width="70" height="30" rx="4" fill="#B22222" stroke="#8B0000" stroke-width="4"/>
    </svg>
  ),
  coal_coke: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 75 C 10 65, 20 35, 45 25 C 75 10, 100 35, 85 65 C 75 100, 35 95, 25 75 Z" fill="#778899"/>
      <circle cx="35" cy="45" r="5" fill="#D3D3D3"/>
      <circle cx="65" cy="65" r="8" fill="#D3D3D3"/>
      <circle cx="50" cy="30" r="4" fill="#D3D3D3"/>
    </svg>
  ),
  coke_oven: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="80" height="80" fill="#B22222" stroke="#8B0000" stroke-width="2"/>
      <path d="M10 40 H 90 M10 70 H 90 M40 10 V 40 M70 10 V 40 M25 40 V 70 M55 40 V 70" stroke="#8B0000" stroke-width="2"/>
      <rect x="30" y="75" width="40" height="10" fill="#202020"/>
    </svg>
  ),
  sand_deposit: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 85 C 5 70, 10 40, 30 30 C 50 15, 80 20, 90 45 C 105 70, 80 95, 50 90 C 20 95, 20 90, 15 85 Z" fill="#D2B48C"/>
    </svg>
  ),
  clay_deposit: () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 85 C 5 70, 10 40, 30 30 C 50 15, 80 20, 90 45 C 105 70, 80 95, 50 90 C 20 95, 20 90, 15 85 Z" fill="#D3D3D3"/>
    </svg>
  ),
};