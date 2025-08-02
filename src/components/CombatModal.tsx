import { Show, For, createSignal, createEffect } from 'solid-js';
import type { Component } from 'solid-js';
import { gameState, gameActions, setGameState } from '../stores/gameStore';
import { iconLibrary } from '../data/icons';

export const CombatModal: Component = () => {
  const [isAttacking, setIsAttacking] = createSignal(false);
  const [isDamaged, setIsDamaged] = createSignal(false);
  const [screenShake, setScreenShake] = createSignal(false);
  const [damageNumbers, setDamageNumbers] = createSignal<Array<{id: number, value: number, x: number, y: number, isCritical: boolean}>>([]);
  const [missIndicators, setMissIndicators] = createSignal<Array<{id: number, x: number, y: number}>>([]);
  const [isDefending, setIsDefending] = createSignal(false);
  const [playerDefense, setPlayerDefense] = createSignal(0);
  const [soundEffects, setSoundEffects] = createSignal<Array<{id: number, type: string, x: number, y: number}>>([]);
  
  let damageId = 0;
  let missId = 0;
  let soundId = 0;
  
  const showDamageNumber = (value: number, x: number, y: number, isCritical: boolean = false) => {
    const id = damageId++;
    setDamageNumbers(prev => [...prev, {id, value, x, y, isCritical}]);
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== id));
    }, 1500);
  };
  
  const showMiss = (x: number, y: number) => {
    const id = missId++;
    setMissIndicators(prev => [...prev, {id, x, y}]);
    setTimeout(() => {
      setMissIndicators(prev => prev.filter(m => m.id !== id));
    }, 1000);
  };
  
  const showSoundEffect = (type: string, x: number, y: number) => {
    const id = soundId++;
    setSoundEffects(prev => [...prev, {id, type, x, y}]);
    setTimeout(() => {
      setSoundEffects(prev => prev.filter(s => s.id !== id));
    }, 800);
  };
  
  const handleAttack = () => {
    if (gameState.combat.turn !== 'player' || !gameState.combat.enemy) return;
    
    // Check for miss (10% chance)
    if (Math.random() < 0.1) {
      setIsAttacking(true);
      setTimeout(() => setIsAttacking(false), 600);
      showMiss(25, 50); // Percentage values
      gameActions.addCombatLog(`Your attack missed!`);
      
      // Enemy turn after miss
      gameActions.setTurn('enemy');
      setTimeout(() => enemyAttack(), 1000);
      return;
    }
    
    // Player attacks with critical hit chance
    const isCritical = Math.random() < 0.2; // 20% crit chance
    const baseDamage = 10 + Math.floor(Math.random() * 10);
    const damage = isCritical ? Math.floor(baseDamage * 1.5) : baseDamage;
    
    setIsAttacking(true);
    showSoundEffect(isCritical ? 'critical' : 'attack', 25, 50);
    setTimeout(() => {
      setIsAttacking(false);
      gameActions.damageEnemy(damage);
      showDamageNumber(damage, 25, 50, isCritical);
      gameActions.addCombatLog(`You attack for ${damage} damage!${isCritical ? ' CRITICAL HIT!' : ''}`);
      
      // Check if enemy is defeated after damage
      if (gameState.combat.enemy && gameState.combat.enemy.hp <= 0) {
        gameActions.addCombatLog(`${gameState.combat.enemy.type} defeated!`);
        
        // Remove enemy from chunk
        const chunkKey = `${gameState.world.playerX},${gameState.world.playerY}`;
        gameActions.removeEnemy(chunkKey, gameState.combat.enemy.id);
        
        // End combat after delay
        setTimeout(() => {
          gameActions.endCombat();
        }, 1500);
        return;
      }
      
      // Enemy turn
      gameActions.setTurn('enemy');
      setTimeout(() => enemyAttack(), 1000);
    }, 300);
  };
  
  const enemyAttack = () => {
    if (!gameState.combat.enemy) return;
    
    // Enemy miss chance (15%)
    if (Math.random() < 0.15) {
      showMiss(75, 50);
      gameActions.addCombatLog(`${gameState.combat.enemy.type}'s attack missed!`);
      gameActions.setTurn('player');
      setPlayerDefense(0);
      return;
    }
    
    const baseDamage = gameState.combat.enemy.damage + Math.floor(Math.random() * 5);
    const reducedDamage = Math.max(1, baseDamage - playerDefense());
    
    setIsDamaged(true);
    setScreenShake(true);
    showSoundEffect('attack', 75, 50);
    
    setTimeout(() => {
      gameActions.damagePlayer(reducedDamage);
      showDamageNumber(reducedDamage, 75, 50);
      gameActions.addCombatLog(`${gameState.combat.enemy.type} attacks for ${reducedDamage} damage!${playerDefense() > 0 ? ` (${playerDefense()} blocked)` : ''}`);
      
      setIsDamaged(false);
      setScreenShake(false);
      setPlayerDefense(0);
      
      // Check if player is defeated
      if (gameState.combat.playerHp <= 0) {
        gameActions.addCombatLog('You have been defeated!');
        // Reset player position
        setTimeout(() => {
          gameActions.movePlayerToChunk(0, 0);
          setGameState('world', 'playerLocalX', 5);
          setGameState('world', 'playerLocalY', 5);
          setGameState('combat', 'playerHp', gameState.combat.playerMaxHp);
          gameActions.endCombat();
        }, 2000);
        return;
      }
      
      gameActions.setTurn('player');
    }, 300);
  };
  
  const handleDefend = () => {
    if (gameState.combat.turn !== 'player') return;
    
    setIsDefending(true);
    const defense = 5 + Math.floor(Math.random() * 5);
    setPlayerDefense(defense);
    showSoundEffect('defend', 75, 50);
    gameActions.addCombatLog(`You brace for defense! (+${defense} defense)`);
    
    setTimeout(() => {
      setIsDefending(false);
    }, 500);
    
    // Enemy turn
    gameActions.setTurn('enemy');
    setTimeout(() => enemyAttack(), 1000);
  };
  
  const handleRun = () => {
    if (gameState.combat.turn !== 'player') return;
    
    if (Math.random() < 0.5) {
      gameActions.addCombatLog('You escaped!');
      setTimeout(() => {
        gameActions.endCombat();
      }, 1000);
    } else {
      gameActions.addCombatLog('Cannot escape!');
      gameActions.setTurn('enemy');
      
      // Enemy gets a free attack
      setTimeout(() => enemyAttack(), 1000);
    }
  };
  
  return (
    <Show when={gameState.combat.active}>
      <div class="fixed inset-0 z-[100]" style="width: 100vw; height: 100vh; top: 0; left: 0; background-color: #0a0a0f;">
        <div class="combat-bg-effect"></div>
        <div class={`relative flex flex-col ${screenShake() ? 'screen-shake' : ''}`} style="width: 100vw; height: 100vh;">
          
          {/* Header */}
          <div class="bg-gradient-to-r from-gray-900 via-cyan-900 to-gray-900 border-b-2 border-cyan-400 py-4">
            <h1 class="text-3xl font-bold text-cyan-400 text-center tracking-wider animate-pulse">COMBAT ENCOUNTER</h1>
          </div>
          
          {/* Main Combat Area */}
          <div class="flex-1 flex items-center justify-center p-8">
            <div class="w-full max-w-6xl grid grid-cols-2 gap-8">
              
              {/* Left Side - Enemy */}
              <div class="flex flex-col items-center justify-center">
                <div class={`bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-8 w-full max-w-md h-[600px] shadow-2xl border-2 border-red-900 flex flex-col ${gameState.combat.turn === 'enemy' ? 'enemy-turn-active' : ''}`}>
                  <h2 class="text-2xl font-bold text-red-400 text-center mb-6 tracking-wide">ENEMY</h2>
                  
                  <div class="flex-1 flex items-center justify-center">
                    {/* Enemy Sprite */}
                    <div class="w-48 h-48 flex items-center justify-center bg-gradient-to-br from-gray-800 to-black rounded-xl shadow-inner relative overflow-visible">
                      {gameState.combat.enemy && iconLibrary[gameState.combat.enemy.type] && 
                        <div class={`transition-all duration-300 ${isDamaged() ? 'damage-animation' : ''} ${isAttacking() && damageNumbers().some(d => d.isCritical) ? 'critical-hit-animation' : isAttacking() ? 'attack-animation' : ''}`} style="transform: scale(8)">
                          {iconLibrary[gameState.combat.enemy.type]()}
                        </div>
                      }
                    </div>
                  </div>
                  
                  {/* Enemy Info */}
                  <Show when={gameState.combat.enemy}>
                    <div class="text-center space-y-2 pb-8">
                      <h3 class="text-xl font-bold text-white capitalize">
                        {gameState.combat.enemy!.type}
                      </h3>
                      <div class="text-lg text-gray-300">
                        HP: {gameState.combat.enemy!.hp} / {gameState.combat.enemy!.maxHp}
                      </div>
                      {/* Heart Health Display */}
                      <div class="flex justify-center gap-2">
                        <For each={Array(Math.ceil(gameState.combat.enemy!.maxHp / 10))}>
                          {(_, index) => {
                            const heartValue = Math.min(10, gameState.combat.enemy!.hp - index() * 10);
                            const fillPercent = Math.max(0, heartValue) * 10;
                            return (
                              <div class={`relative w-12 h-12 ${isDamaged() ? 'health-damage' : ''}`}>
                                <svg viewBox="0 0 24 24" class="absolute inset-0 w-full h-full heart-icon">
                                  <path 
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                                    fill="#4B5563"
                                    stroke="#1F2937"
                                    stroke-width="1"
                                  />
                                  <clipPath id={`heart-clip-enemy-${index()}`}>
                                    <rect x="0" y="24" width="24" height={`${fillPercent}%`} transform="rotate(180 12 12)" class="health-bar-transition" />
                                  </clipPath>
                                  <path 
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                                    fill="#DC2626"
                                    clip-path={`url(#heart-clip-enemy-${index()})`}
                                  />
                                </svg>
                              </div>
                            );
                          }}
                        </For>
                      </div>
                    </div>
                  </Show>
                </div>
              </div>
              
              {/* Right Side - Player */}
              <div class="flex flex-col items-center justify-center">
                <div class={`bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-8 w-full max-w-md h-[600px] shadow-2xl border-2 border-green-900 flex flex-col justify-between ${gameState.combat.turn === 'player' ? 'player-turn-active' : ''} ${isDefending() ? 'defend-animation' : ''}`}>
                  <div>
                    <h2 class="text-2xl font-bold text-green-400 text-center mb-4 tracking-wide">PLAYER</h2>
                    
                    {/* Player Status */}
                    <div class="mb-8 space-y-2">
                      <div class="text-lg text-gray-300 text-center">
                        HP: {gameState.combat.playerHp} / {gameState.combat.playerMaxHp}
                      </div>
                    {/* Heart Health Display */}
                    <div class="flex justify-center gap-2 flex-wrap">
                      <For each={Array(Math.ceil(gameState.combat.playerMaxHp / 10))}>
                        {(_, index) => {
                          const heartValue = Math.min(10, gameState.combat.playerHp - index() * 10);
                          const fillPercent = Math.max(0, heartValue) * 10;
                          return (
                            <div class={`relative w-12 h-12 ${screenShake() ? 'health-damage' : ''}`}>
                              <svg viewBox="0 0 24 24" class="absolute inset-0 w-full h-full heart-icon">
                                <path 
                                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                                  fill="#4B5563"
                                  stroke="#1F2937"
                                  stroke-width="1"
                                />
                                <clipPath id={`heart-clip-player-${index()}`}>
                                  <rect x="0" y="24" width="24" height={`${fillPercent}%`} transform="rotate(180 12 12)" class="health-bar-transition" />
                                </clipPath>
                                <path 
                                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                                  fill="#DC2626"
                                  clip-path={`url(#heart-clip-player-${index()})`}
                                />
                              </svg>
                            </div>
                          );
                        }}
                      </For>
                    </div>
                    </div>
                  </div>
                  
                  <div>
                    {/* Action Buttons */}
                    <div class="space-y-3">
                    <button
                      class="w-full py-4 text-lg font-bold bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                      onClick={handleAttack}
                      disabled={gameState.combat.turn !== 'player'}
                    >
                      ⚔️ ATTACK
                    </button>
                    <button
                      class="w-full py-4 text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                      onClick={handleDefend}
                      disabled={gameState.combat.turn !== 'player'}
                    >
                      🛡️ DEFEND
                    </button>
                    <button
                      class="w-full py-4 text-lg font-bold bg-gradient-to-r from-yellow-700 to-yellow-500 hover:from-yellow-800 hover:to-yellow-600 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                      onClick={handleRun}
                      disabled={gameState.combat.turn !== 'player'}
                    >
                      🏃 RUN AWAY
                    </button>
                    </div>
                    
                    <Show when={gameState.combat.turn === 'enemy'}>
                      <div class="text-center text-yellow-400 text-lg mt-4 animate-pulse">
                        Enemy is attacking...
                      </div>
                    </Show>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Combat Log - Fixed position at bottom */}
          <div class="absolute bottom-0 left-0 right-0 bg-gray-800 border-t-4 border-gray-700 p-4">
            <h3 class="text-sm font-bold text-gray-400 mb-2">COMBAT LOG</h3>
            <div class="h-20 overflow-y-auto bg-black rounded-lg p-2 space-y-1 shadow-inner">
              <For each={gameState.combat.log}>
                {(message) => (
                  <div class="text-sm text-gray-300 font-mono">&gt; {message}</div>
                )}
              </For>
            </div>
          </div>
          
          {/* Damage Numbers */}
          <For each={damageNumbers()}>
            {(damage) => (
              <div 
                class={`damage-number ${damage.isCritical ? 'critical' : ''}`}
                style={`left: ${damage.x}%; top: ${damage.y}%;`}
              >
                {damage.value}
              </div>
            )}
          </For>
          
          {/* Miss Indicators */}
          <For each={missIndicators()}>
            {(miss) => (
              <div 
                class="miss-indicator"
                style={`left: ${miss.x}%; top: ${miss.y}%;`}
              >
                MISS
              </div>
            )}
          </For>
          
          {/* Sound Effects */}
          <For each={soundEffects()}>
            {(effect) => (
              <div 
                class={`sound-effect ${effect.type}`}
                style={`left: ${effect.x}%; top: ${effect.y}%;`}
              >
              </div>
            )}
          </For>
          
        </div>
      </div>
    </Show>
  );
};