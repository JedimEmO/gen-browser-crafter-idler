# Visual Style Guide for IdleCrafter Singularity

## Overall Art Direction

### Visual Theme
- **Pixel-inspired simplicity** with clean vector graphics
- **Minecraft-like aesthetic** with a modern twist
- **Industrial/crafting focus** emphasizing automation and progression
- **Readable at small sizes** (16px-32px typical display size)

## Color Palette

### Primary Colors
- **Stone/Gray**: `#666666`, `#888888`, `#AAAAAA` - Base materials, machinery
- **Earth Tones**: `#8B4513`, `#A0522D`, `#D2691E` - Wood, dirt, natural resources
- **Metal Colors**: `#C0C0C0`, `#708090`, `#2F4F4F` - Iron, steel, machinery
- **Energy/Heat**: `#FF4500`, `#FF6347`, `#FFD700` - Fire, fuel, energy sources

### Biome Colors
- **Forest**: `#228B22`, `#32CD32` - Lush greens
- **Desert**: `#F4A460`, `#DEB887` - Sandy browns
- **Mountain**: `#696969`, `#A9A9A9` - Rocky grays
- **Plains**: `#9ACD32`, `#ADFF2F` - Lighter greens
- **Swamp**: `#556B2F`, `#6B8E23` - Muted greens

### UI Colors
- **Inventory Slots**: `#8B4513` border, `#D2B48C` background
- **Hotbar Active**: `#FFD700` highlight
- **Health**: `#DC143C` (hearts), `#8B0000` (damaged)
- **XP Bar**: `#32CD32` (filled), `#228B22` (background)

## Icon Design Principles

### Technical Specifications
- **Size**: 24x24px base canvas (scalable SVG)
- **Stroke Width**: 1-2px for outlines
- **Grid Alignment**: Snap to pixel grid for crisp rendering
- **Viewbox**: `0 0 24 24` standard

### Style Rules
1. **Simple geometric shapes** - rectangles, circles, basic polygons
2. **Bold outlines** - 1-2px black or dark strokes
3. **Flat colors** - minimal gradients, prefer solid fills
4. **High contrast** - ensure readability on dark inventory backgrounds
5. **Consistent lighting** - top-left light source assumption

### Item Categories

#### Raw Materials
- **Ores**: Crystalline chunks with geometric facets
- **Wood**: Simple log shapes with grain lines
- **Stone**: Irregular but geometric rock shapes
- **Organic**: Simple plant/animal forms

#### Tools
- **Pickaxes**: Classic minecraft-style with wooden handle
- **Axes**: Broad blade with handle, durability wear visible
- **Consistent proportions**: Handle 60%, head 40%

#### Machines
- **Furnaces**: Brick-like texture with fire opening
- **Chests**: Classic wooden chest with metal fittings
- **Coke Ovens**: Industrial brick with chimney elements
- **Conveyors**: Metallic with visible belt/rollers

#### Processed Items
- **Ingots**: Clean rectangular bars with slight bevel
- **Crafted Items**: Combination of base element styles
- **Fuel**: Flame or energy-themed accents

## Sprite Design (Characters & Enemies)

### Player Character
- **Size**: 32x32px for factory grid, 24x24px for world view
- **Style**: Simple humanoid with clear silhouette
- **Colors**: Neutral clothing (blue/brown) for universal appeal
- **Animation**: Subtle idle movement, clear directional facing

### Enemies
- **Slime**: `#32CD32` blob with simple face, bouncy appearance
- **Goblin**: `#8B4513` skin, simple clothing, mischievous expression
- **Wolf**: `#696969` fur, pointed ears, fierce but not scary

### Animation Principles
- **Minimal frames**: 2-4 frame cycles maximum
- **Clear silhouettes**: Readable at game resolution
- **Consistent timing**: 500ms per animation cycle
- **Smooth transitions**: Ease-in-out for natural movement

## UI Element Styling

### Buttons
- **Border**: 2px solid dark color
- **Background**: Flat color with subtle hover state
- **Text**: Bold, high contrast
- **Size**: Minimum 32px height for touch-friendly interaction

### Progress Bars
- **Background**: Dark semi-transparent
- **Fill**: Bright color matching content (health=red, XP=green)
- **Border**: 1px solid for definition
- **Corners**: Slightly rounded (2-4px radius)

### Modal Windows
- **Background**: Semi-transparent dark overlay
- **Content**: Light background with dark border
- **Shadows**: Subtle drop shadow for depth
- **Corners**: Rounded for modern feel

## Resource Tile Styling

### World Resources
- **Trees**: Simple trunk with leafy top, vary by biome
- **Rocks**: Angular shapes, color-coded by type
- **Ore Deposits**: Sparkly/crystalline appearance
- **Size**: Fill tile but leave clear borders

### Visual Hierarchy
1. **Player** - Brightest, most detailed
2. **Enemies** - Medium contrast, threatening colors
3. **Resources** - Muted but distinguishable
4. **Terrain** - Subtle background elements

## Consistency Guidelines

### File Organization
- Use descriptive names: `iron_ore.svg`, `wooden_pickaxe.svg`
- Group by category in folders if needed
- Include size variants: `_16`, `_24`, `_32` suffixes

### Quality Standards
- **Scalability**: Must look good from 16px to 64px
- **Color blindness**: Test with common CVD types
- **Contrast**: Minimum 3:1 ratio against dark backgrounds
- **Performance**: Optimize SVG code, remove unnecessary elements

### Brand Alignment
- Maintain **crafting/industrial** theme throughout
- Balance **approachable** and **engaging** aesthetics  
- Ensure **game mechanic clarity** over pure aesthetics
- Keep **nostalgic pixel-game** feeling with modern polish

## Implementation Notes

### SVG Best Practices
- Use `fill` instead of `stroke` when possible for better scaling
- Minimize path complexity for performance
- Include fallback colors for accessibility
- Test rendering at target sizes before finalizing

### Integration Requirements
- All icons must work with existing `icons.tsx` component structure
- Follow React component naming conventions
- Include proper TypeScript definitions
- Ensure compatibility with Tailwind CSS classes

This style guide ensures visual consistency across all game art while maintaining the technical requirements for a modern web-based game.