# IdleCrafter Singularity

A browser-based automation and exploration game where you gather resources, build machines, and create automated factories while defending against enemies in a procedurally generated world.

## How to Run

### Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)

### Installation & Running

1. Clone the repository:
```bash
git clone [repository-url] game
cd game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Game Tutorial

### Getting Started

When you first start the game, you'll find yourself in **Explore Mode** in a forest biome with no items. Your goal is to gather resources, craft tools, build machines, and create an automated factory.

### Basic Controls

#### Movement
- **WASD** or **Arrow Keys**: Move your character
- Movement works in both Factory and Explore modes
- You can only interact with tiles within 5 spaces of your position

#### Inventory Management
- **Number Keys 1-9**: Select hotbar slots
- **Left Click**: Pick up/place items
- **Right Click**: Split stacks
- **Shift+Click**: Quick transfer items
- **Double Click**: Collect all items of the same type

### Game Modes

#### Explore Mode
- Venture into the procedurally generated world
- Gather resources by clicking on them (must be adjacent)
- Watch out for enemies (slimes, goblins, wolves)
- Different biomes contain different resources:
  - **Forest**: Wood, stone, sometimes coal
  - **Plains**: Grass, flowers, stone
  - **Desert**: Sand, clay
  - **Swamp**: Clay, wood
  - **Rocky Hills**: Stone, coal, iron ore

#### Factory Mode
- Place and configure machines
- Build automated production lines
- Access by clicking the "Factory" button

### Your First Steps

1. **Gather Basic Resources**
   - Click on trees to get wood
   - Click on stone deposits for stone
   - Stay close to resources (within 1 tile) to harvest them

2. **Craft Your First Tools**
   - Open your inventory (bottom center)
   - Use the 2x2 crafting grid to make:
     - Wooden planks from wood
     - Sticks from planks
     - Wooden pickaxe (planks + sticks)

3. **Build a Crafting Bench**
   - Craft a crafting bench (4 wooden planks)
   - Switch to Factory mode
   - Place the crafting bench
   - Right-click to open it for 3x3 crafting

4. **Create Storage**
   - Craft chests for storage
   - Place them in your factory
   - Each chest holds 16 stacks of items

5. **Automation Basics**
   - Build a furnace for smelting
   - Configure input/output sides with a wrench
   - Connect chests to automatically feed materials

### Combat System

When you encounter enemies:
- **Combat is turn-based** with three actions:
  - **Attack**: Deal 10-20 damage (10% miss, 20% critical chance)
  - **Defend**: Reduce incoming damage by 5-10
  - **Run**: 50% chance to escape
- Defeating enemies grants XP
- Leveling up increases max HP by 10
- Death causes XP loss and returns you to factory

### Advanced Tips

- **Auto-save**: Game saves every 30 seconds automatically
- **Manual Save/Load**: Use buttons at the bottom of System Log
- **Fuel System**: Furnaces need fuel (wood/coal) to operate
- **Machine Connections**: Configure sides for item flow
- **Tool Durability**: Tools wear out - craft replacements

### Recipes to Get Started

**Basic Crafting (2x2 grid):**
- Wooden Planks: 1 Wood → 4 Planks
- Sticks: 2 Planks → 4 Sticks
- Crafting Bench: 4 Planks → 1 Crafting Bench

**Tools (3x3 grid):**
- Wooden Pickaxe: 3 Planks + 2 Sticks
- Stone Pickaxe: 3 Stone + 2 Sticks
- Iron Pickaxe: 3 Iron Ingots + 2 Sticks

**Machines:**
- Furnace: 8 Stone
- Chest: 8 Planks
- Coke Oven: 9 Bricks

**Smelting:**
- Iron Ore → Iron Ingot (5 seconds)
- Sand → Glass (3 seconds)
- Clay → Brick (3 seconds)

### Save System

- **Auto-save**: Every 30 seconds
- **Manual Save**: Click "Save" button in System Log
- **Load**: Click "Load" to restore previous save
- **Reset**: Click "Reset" to start fresh (requires confirmation)

## Tips for Success

1. Always keep tools in your hotbar for quick access
2. Build chests early for organization
3. Set up automated smelting lines for efficiency
4. Explore carefully - enemies can appear anywhere
5. Keep your factory compact for easier management
6. Use the minimap (in Explore mode) to navigate

Good luck, and happy crafting!
