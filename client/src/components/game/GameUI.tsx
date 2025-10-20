import { usePlayerStore } from "../../lib/stores/usePlayerStore";
import { useEnemyStore } from "../../lib/stores/useEnemyStore";
import { useAudio } from "../../lib/stores/useAudio";

export function GameUI() {
  const { health, maxHealth } = usePlayerStore();
  const { enemies } = useEnemyStore();
  const { isMuted, toggleMute } = useAudio();

  // Create hearts array for display
  const hearts = Array.from({ length: maxHealth }, (_, i) => ({
    filled: i < health,
    key: i
  }));

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      {/* Health display */}
      <div className="flex gap-2 mb-4">
        {hearts.map(heart => (
          <div
            key={heart.key}
            className={`w-8 h-8 ${heart.filled ? 'text-red-500' : 'text-gray-400'}`}
            style={{
              fontSize: '2rem',
              lineHeight: '1',
            }}
          >
            ♥
          </div>
        ))}
      </div>

      {/* Enemy count */}
      <div className="bg-black/50 text-white px-3 py-2 rounded mb-2">
        Enemies: {enemies.length}
      </div>

      {/* Controls info */}
      <div className="bg-black/50 text-white px-3 py-2 rounded text-sm">
        <div>WASD/Arrow Keys: Move</div>
        <div>Space: Attack</div>
      </div>

      {/* Audio toggle */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded hover:bg-black/70"
      >
        {isMuted ? '🔇' : '🔊'}
      </button>

      {/* Game Over screen */}
      {health <= 0 && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl mb-4">Game Over</h1>
            <p className="text-xl mb-4">Press F5 to restart</p>
          </div>
        </div>
      )}

      {/* Victory screen */}
      {enemies.length === 0 && health > 0 && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-6xl mb-4">Victory!</h1>
            <p className="text-xl mb-4">All enemies defeated!</p>
            <p className="text-lg">Press F5 to play again</p>
          </div>
        </div>
      )}
    </div>
  );
}
