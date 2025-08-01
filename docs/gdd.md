Game Design Document: IdleCrafter Singularity
1. High Concept

"IdleCrafter Singularity" is a browser-based idle and automation game inspired by the complex modpack GregTech New Horizons (GTNH). The player starts from nothing, manually gathering primitive resources, and progresses through increasingly complex technological tiers. The ultimate goal is to build a fully automated factory capable of constructing an AI Singularity, allowing the player to transcend physical reality and "escape into the matrix." The game emphasizes intricate production chains, resource management, and the satisfying journey from manual labor to vast, self-sustaining automation.

2. Core Gameplay Loop

The gameplay is built on a repeating cycle:

Explore: The player navigates a procedurally generated world with diverse biomes to find and harvest raw resources.

Harvest: Manually gather resources from nodes (trees, ore veins, etc.) using appropriate tools. Tool durability and efficiency are key factors.

Craft: Use harvested resources to craft components, tools, and machines.

Automate: Place machines on the factory floor to automate the harvesting, processing, and crafting of resources.

Research & Progress: Use the products of automation to unlock new technologies, machines, and recipes, advancing to the next technological tier.

Repeat: Use new technologies to explore more efficiently, create more complex automation, and work towards the end goal.

3. Key Features & Mechanics (To Be Implemented)

This section details the features to be built upon the existing prototype.

3.1. World & Exploration

Infinite Procedural World: The world will be procedurally generated using a seed and Perlin noise, creating a unique and virtually infinite landscape for every player.

Biomes: The world will be divided into distinct biomes (Forest, Plains, Desert, Swamp, Rocky Hills, Mountains, Oceans, etc.). Each biome will have a unique appearance and a specific distribution of resources, forcing players to explore to find necessary materials.

Resource Nodes: Resources will appear as finite nodes on the map. Higher-tier resources will be rarer and found in specific biomes or at certain depths.

Underground Exploration (Future): Implement a Z-axis (depth). Players will be able to dig down into the world, discovering different rock layers and ore veins that only generate at specific depths. This will require the development of miners or drills.

Navigation: The current chunk-based navigation system will be maintained. A mini-map or world map feature should be added to help players keep track of their location and discovered biomes.

3.2. Resource & Production Chains

Tiered Progression: The game will be structured around technological tiers, similar to GTNH.

Tier 0 (Primitive): Manual harvesting, wood/stone tools.

Tier 1 (Steam Age): Basic automation with steam-powered machines. Introduction of copper, tin, and bronze. Requires burning fuel for power.

Tier 2 (Low Voltage - LV): Introduction of electricity. Basic electronic components, copper wires, simple electric machines (electric furnace, macerator).

Tier 3 (Medium Voltage - MV): More complex alloys (steel), advanced processing (assemblers, chemical reactors), and more efficient power generation.

Tier 4 (High Voltage - HV) and beyond: Plastic production, advanced electronics, digital logic, and eventually quantum computing, leading to the AI Singularity.

Complex Recipes: Recipes will become progressively more complex, requiring multiple stages of processing and assembly. For example, creating a simple electronic circuit might require:

Mining copper ore.

Smelting it into ingots.

Processing ingots into wires.

Crafting rubber from trees/oil.

Combining wires and rubber to make insulated copper wire.

Crafting a circuit board from wood pulp and resin.

Assembling the wire and other components onto the board.

Byproducts & Chemistry: Later tiers will introduce chemical processing with byproducts that must be managed (e.g., slag from smelting, wastewater from chemical reactions). These can be voided, stored, or recycled into useful materials.

3.3. Automation & Logistics

Machines: A wide variety of single-block machines will be the core of automation. Each machine will perform a specific function (smelting, crushing, assembling, etc.).

Power System:

Burner Power: Early machines will run on solid fuel (wood, coal, coke).

Steam Power: A simple boiler/steam engine setup will be the first step towards scalable power.

Electricity: A full-fledged power grid system with generators (solar, geothermal, nuclear), cables of different voltage capacities, and batteries for storage. Power will be measured in EU/t (Energy Units per tick). Machines will have voltage requirements; connecting a low-voltage machine to a high-voltage line will cause it to explode.

Logistics:

Conveyor Belts: The primary method for moving items between machines. Belts will have different speeds and capacities.

Item Pipes/Tubes (Future): A more advanced, compact, and faster logistics system.

Filters & Sorters: Devices to attach to conveyors/pipes to direct specific items to the correct machines.

Fluids: Introduction of fluids (water, oil, steam, acid) and a corresponding pipe/tank system for transport and storage.

3.4. UI/UX Improvements

NEI/JEI-style Recipe Book: The current recipe book is a good start. It should be expanded to be searchable and show not just crafting recipes, but also machine processing recipes (e.g., what happens when you put iron ore in a furnace vs. a macerator).

Detailed Tooltips: All items and machines should have detailed tooltips showing their properties (durability, fuel value, power usage, processing speed, etc.).

Quest/Advancement System: A guided progression system (similar to a quest book) to help players understand the complex production chains and give them clear goals for what to do next.

Factory Overview: A zoomed-out view or a special UI to monitor the status of the entire factory, showing power levels, resource bottlenecks, and machine statuses.

4. The End Goal: The AI Singularity

The final tier of the game will revolve around constructing a multi-block "Singularity Nexus." This will require immense resources from every production chain in the game, including:

Quantum Processors: Requiring rare materials and complex, multi-stage assembly lines.

Super-cooled Superconductors: Requiring cryogenics and rare earth elements.

Vast Data Storage: Requiring millions of storage components.

Massive Power: Requiring a robust, end-game power plant (e.g., a fusion reactor).

Once the Nexus is built and fully powered, the player will initiate the "Transcendence" sequence. This will be a final, massive resource sink. Upon completion, the player "wins" the game, escaping into the matrix, and the game can either end or unlock a "New Game+" mode with new challenges or multipliers.

5. Implementation Instructions for the Agent

The next development steps should focus on fleshing out the core mechanics in a logical order.

Step 1: Implement Conveyor Belts & Basic Logistics

Create a "Conveyor Belt" item.

Allow the player to place belts on the factory floor.

Belts should automatically move items dropped on them in the direction they are facing.

Update machine logic: Machines with an output side set will now eject items onto an adjacent belt. Machines with an input side set will pull items from a belt ending at that side.

Implement a simple "Inserter" or "Robotic Arm" machine that can pull items from one machine/chest and place them in an adjacent one.

Step 2: Flesh out the Steam Tier (Tier 1)

Introduce Copper and Tin ore to the world generation (primarily in Rocky Hills).

Add recipes for:

Bronze: Mixing copper and tin dust (requiring a new machine: the Macerator).

Macerator (Burner): A machine that takes ore and fuel and outputs dusts. This is the first step beyond simple smelting.

Bronze Boiler & Steam Engine: Multi-block structures that consume fuel and water to generate a new power type: Steam.

Bronze-Plated Machines: Upgrade existing machines (Furnace, Macerator) to run on Steam instead of solid fuel, making them faster and more efficient.

Step 3: Introduce Electricity (Tier 2 - LV)

Create a basic power system (EU/t).

Add a Low Voltage Generator (e.g., a Steam Turbine that consumes steam to produce LV power).

Add Copper Wires for transmitting power.

Add a basic Battery Box for storing power.

Introduce the first set of electric machines:

Electric Furnace: Faster than the stone furnace, runs on electricity.

Electric Macerator: Faster than the burner version.

Wiremill: Turns metal ingots into wires.

Implement the "explosion" mechanic if a machine is connected to a higher voltage than it can handle.

From this point, the game can be expanded tier by tier, adding new resources, machines, and production challenges, always building upon the established foundation of exploration, crafting, and automation.
