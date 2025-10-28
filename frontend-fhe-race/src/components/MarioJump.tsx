import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./MarioJump.css";

interface Obstacle {
  id: number;
  x: number; // 1.0 -> 0.0 from right to left
  y: number; // ground level (0.8 for ground obstacles)
  speed: number;
  type: 'obstacle'; // Only obstacles in Dino Game
  scored?: boolean;
}

interface MarioJumpProps {
  canPlay?: boolean;
  durationMs?: number;
  onComplete?: (score: number) => void;
}

export const MarioJump: React.FC<MarioJumpProps> = ({ canPlay = true, durationMs = 15000, onComplete }) => {
  const [running, setRunning] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [playerY, setPlayerY] = useState(0.8); // 0.8 = ground, 0.3 = peak of jump
  const [score, setScore] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(durationMs);
  const [blinkHit, setBlinkHit] = useState(false);
  
  const obstaclesRef = useRef<Obstacle[]>([]);
  const nextIdRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const spawnCooldownRef = useRef(0);
  const jumpVelocityRef = useRef(0);
  const isJumpingRef = useRef(false);

  const difficulty = useMemo(() => {
    const elapsed = durationMs - timeLeftMs;
    const t = Math.max(0, Math.min(1, elapsed / durationMs));
    const speed = 0.6 + t * 0.8; // 0.6 -> 1.4 units/sec (faster progression like Dino)
    const minSpawnGap = 1000 - Math.floor(t * 400); // 1000ms -> 600ms
    return { speed, minSpawnGap };
  }, [timeLeftMs, durationMs]);

  const reset = useCallback(() => {
    setRunning(false);
    setIsJumping(false);
    setPlayerY(0.8);
    setScore(0);
    setTimeLeftMs(durationMs);
    obstaclesRef.current = [];
    nextIdRef.current = 1;
    lastTsRef.current = null;
    spawnCooldownRef.current = 0;
    jumpVelocityRef.current = 0;
    isJumpingRef.current = false;
  }, [durationMs]);

  useEffect(() => {
    reset();
  }, [durationMs, reset]);

  // Jump controls - Single press to jump (Dino Game style)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!running) return;
      // Only jump if on ground (not already jumping)
      if ((e.key === " " || e.key === "ArrowUp" || e.key === "w" || e.key === "W") && !isJumpingRef.current) {
        // Start jump - one press triggers full jump arc
        isJumpingRef.current = true;
        setIsJumping(true);
        jumpVelocityRef.current = -2.2; // Initial jump velocity (negative = up, increased for better jump)
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running]);

  const tick = useCallback(
    (ts: number) => {
      if (!running) return;
      if (lastTsRef.current == null) {
        lastTsRef.current = ts;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const dtMs = ts - lastTsRef.current;
      const dtSec = dtMs / 1000;
      lastTsRef.current = ts;

      // Update timer
      setTimeLeftMs((prev) => {
        const nv = Math.max(0, prev - dtMs);
        return nv;
      });

      // Jump physics - automatic arc (Dino Game style) - SMOOTHED
      if (isJumpingRef.current) {
        const gravity = 6.0; // Gravity acceleration (slightly increased for better feel)
        
        // Apply gravity
        jumpVelocityRef.current += gravity * dtSec;
        
        // Calculate new position with velocity
        let newY = playerY + jumpVelocityRef.current * dtSec;
        
        // Clamp to valid range
        newY = Math.max(0.15, Math.min(0.8, newY));
        
        if (newY >= 0.8) {
          // Landed on ground - snap to exact position
          setPlayerY(0.8);
          setIsJumping(false);
          isJumpingRef.current = false;
          jumpVelocityRef.current = 0;
        } else {
          // In air - continue jump arc with smoothed position
          setPlayerY(newY);
        }
      }

      // Spawn logic - only obstacles (cactus) like Dino Game
      spawnCooldownRef.current -= dtMs;
      if (spawnCooldownRef.current <= 0) {
        const newObs: Obstacle = {
          id: nextIdRef.current++,
          x: 1.1, // Start from right side
          y: 0.8, // Always on ground (cactus)
          speed: difficulty.speed,
          type: 'obstacle',
        };
        obstaclesRef.current.push(newObs);
        spawnCooldownRef.current = difficulty.minSpawnGap;
      }
      
      // Distance-based scoring (like Dino Game)
      // Score increases continuously while running
      const timeProgress = Math.max(0, (durationMs - timeLeftMs) / durationMs);
      const scoreIncrement = (dtMs / 100) * (1 + timeProgress * 0.5); // Faster scoring as time goes
      setScore((s) => Math.floor(s + scoreIncrement));

      // Move obstacles and check collisions (Dino Game style)
      const playerX = 0.15; // Player position
      const collisionThreshold = 0.08; // Horizontal distance threshold
      const groundLevel = 0.7; // Player is on ground if Y >= 0.7
      const keep: Obstacle[] = [];
      let bonusScore = 0; // Extra points for dodging obstacles

      for (const ob of obstaclesRef.current) {
        ob.x -= ob.speed * dtSec;

        // Check if obstacle is at player's horizontal position
        const isAtPlayerX = Math.abs(ob.x - playerX) < collisionThreshold;

        if (ob.type === 'obstacle' && !ob.scored && isAtPlayerX) {
          // Obstacle is at ground level (0.8)
          // Player needs to JUMP UP (playerY < groundLevel) to avoid it
          if (playerY >= groundLevel) {
            // Player is on ground -> HIT obstacle
            setBlinkHit(true);
            setTimeout(() => setBlinkHit(false), 120);
            ob.scored = true;
            // No points for getting hit
          } else {
            // Player is in air (jumped) -> Successfully dodged
            ob.scored = true;
            bonusScore += 10; // +10 points for each obstacle dodged! 🎯
          }
        }

        // Keep obstacles still on screen
        if (ob.x > -0.2) keep.push(ob);
      }

      obstaclesRef.current = keep;
      
      // Add bonus points for dodging obstacles
      if (bonusScore > 0) {
        setScore((s) => s + bonusScore);
      }

      // End condition
      if (timeLeftMs <= dtMs) {
        setRunning(false);
        onComplete?.(score);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [running, difficulty.speed, difficulty.minSpawnGap, playerY, timeLeftMs, durationMs, onComplete, score],
  );

  useEffect(() => {
    if (!running) return;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [running, tick]);

  const start = useCallback(() => {
    if (!canPlay) return;
    reset();
    setRunning(true);
  }, [canPlay, reset]);

  const timeStr = useMemo(() => {
    const s = Math.ceil(timeLeftMs / 100) / 10;
    return s.toFixed(1);
  }, [timeLeftMs]);

  return (
    <div className="mario-container">
      <div className="mario-hud">
        <div className="hud-item">⏱️ Time: {timeStr}s</div>
        <div className="hud-item">🏃 Score: {score}</div>
      </div>
      
      <div className={`mario-game dino-theme ${blinkHit ? "hit" : ""}`}>
        {/* Ground */}
        <div className="ground"></div>
        
        {/* Player - T-Rex */}
        <div 
          className={`player ${isJumping ? "jumping" : ""}`}
          style={{
            bottom: `${(0.8 - playerY) * 350}px`, // 0.8 (ground) = 0px, 0.15 (peak) = 227px
            left: '15%'
          }}
        >
          🦕
        </div>

        {/* Obstacles - Cactus only */}
        {obstaclesRef.current.map((o) => {
          const isVisible = o.x >= -0.1 && o.x <= 1.2;
          
          return (
            <div
              key={o.id}
              className={`game-object obstacle`}
              style={{
                bottom: `${(0.8 - o.y) * 350}px`, // Always at ground (0px) for obstacles
                left: `${o.x * 100}%`,
                display: isVisible ? 'block' : 'none',
              }}
            >
              🌵
            </div>
          );
        })}
      </div>

      <div className="mario-cta">
        <button className="mario-button" onClick={start} disabled={!canPlay || running}>
          {running ? "Running..." : "🦕 Start Running"}
        </button>
        <div className="hint">🦕 Jump to avoid cactus! Space / Up / W to Jump</div>
      </div>
    </div>
  );
};

export default MarioJump;

