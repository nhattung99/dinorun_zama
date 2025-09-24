import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./DodgeRace.css";

type LaneIndex = 0 | 1 | 2;

interface Obstacle {
  id: number;
  lane: LaneIndex;
  x: number; // 1.0 -> 0.0 from right to left
  speed: number; // unit per second
  scored?: boolean;
}

interface DodgeRaceProps {
  canPlay?: boolean;
  durationMs?: number;
  onComplete?: (score: number) => void;
}

export const DodgeRace: React.FC<DodgeRaceProps> = ({ canPlay = true, durationMs = 10000, onComplete }) => {
  const [running, setRunning] = useState(false);
  const [lane, setLane] = useState<LaneIndex>(1);
  const [score, setScore] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(durationMs);
  const [blinkHit, setBlinkHit] = useState(false);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const nextIdRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const spawnCooldownRef = useRef(0);

  const difficulty = useMemo(() => {
    const elapsed = durationMs - timeLeftMs;
    const t = Math.max(0, Math.min(1, elapsed / durationMs));
    const speed = 0.4 + t * 0.4; // 0.4 -> 0.8 units/sec (gentle progression)
    const minSpawnGap = 500 - Math.floor(t * 200); // 500ms -> 300ms (gradual spawn increase)
    return { speed, minSpawnGap };
  }, [timeLeftMs, durationMs]);

  const reset = useCallback(() => {
    setRunning(false);
    setLane(1);
    setScore(0);
    setTimeLeftMs(durationMs);
    obstaclesRef.current = [];
    nextIdRef.current = 1;
    lastTsRef.current = null;
    spawnCooldownRef.current = 0;
  }, [durationMs]);

  useEffect(() => {
    reset();
  }, [durationMs]);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!running) return;
      if (e.key === "ArrowUp" || e.key === "w") {
        setLane((l) => (Math.max(0, l - 1) as LaneIndex));
      } else if (e.key === "ArrowDown" || e.key === "s") {
        setLane((l) => (Math.min(2, l + 1) as LaneIndex));
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
      lastTsRef.current = ts;

      // Update timer
      setTimeLeftMs((prev) => {
        const nv = Math.max(0, prev - dtMs);
        return nv;
      });

      // Spawn logic
      spawnCooldownRef.current -= dtMs;
      if (spawnCooldownRef.current <= 0) {
        const newObs: Obstacle = {
          id: nextIdRef.current++,
          lane: Math.floor(Math.random() * 3) as LaneIndex,
          // Spawn at the far end (right side), away from the car
          x: 0.8 + Math.random() * 0.3, // [0.8, 1.1]
          speed: difficulty.speed,
        };
        obstaclesRef.current.push(newObs);
        console.log(`Spawned obstacle ${newObs.id} at x=${newObs.x}, lane=${newObs.lane}`);
        spawnCooldownRef.current = difficulty.minSpawnGap;
      }

      // Move obstacles and scoring
      const px = (dtMs / 1000) * 1; // base unit per second
      // Gradually speed up obstacles as time runs out
      const timeProgress = Math.max(0, (durationMs - timeLeftMs) / durationMs);
      const endFactor = 1.0 + (timeProgress * 0.5); // Speed up to 1.5x by the end (gentle)
      const carX = 0.06; // car sits near 6%
      const passedX = 0.04;
      const hitX = 0.08; // collision threshold
      const keep: Obstacle[] = [];
      let addScore = 0;
      for (const ob of obstaclesRef.current) {
        ob.x -= px * ob.speed * endFactor;
        const nearCar = ob.x <= hitX && ob.x >= 0 && ob.lane === lane;
        if (nearCar) {
          setBlinkHit(true);
          setTimeout(() => setBlinkHit(false), 120);
        }
        if (!ob.scored && ob.x < carX && ob.x > passedX) {
          ob.scored = true;
          if (ob.lane !== lane) addScore += 1; // dodged
        }
        // Keep obstacles that are still on screen or just passed
        if (ob.x > -0.3) keep.push(ob);
      }
      const removedCount = obstaclesRef.current.length - keep.length;
      if (removedCount > 0) {
        console.log(`Removed ${removedCount} obstacles, ${keep.length} remaining`);
      }
      obstaclesRef.current = keep;
      if (addScore) setScore((s) => s + addScore);

      // End condition
      if (timeLeftMs <= dtMs) {
        setRunning(false);
        onComplete?.(score + addScore);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [running, difficulty.speed, difficulty.minSpawnGap, lane, timeLeftMs, onComplete, score],
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

  const lanes = [0, 1, 2] as LaneIndex[];

  const timeStr = useMemo(() => {
    const s = Math.ceil(timeLeftMs / 100) / 10;
    return s.toFixed(1);
  }, [timeLeftMs]);

  return (
    <div className="dodge-container">
      <div className="dodge-hud">
        <div className="hud-item">Time: {timeStr}s</div>
        <div className="hud-item">Score: {score}</div>
      </div>
      <div className={`dodge-track ${blinkHit ? "hit" : ""}`}>
        {lanes.map((l) => (
          <div key={l} className="dodge-lane">
            <div className={`car ${lane === l ? "visible" : "faded"}`}>🚗</div>
          </div>
        ))}
        {obstaclesRef.current.map((o) => {
          const y = (o.lane + 0.5) * 33.3333;
          const isVisible = o.x >= 0 && o.x <= 1.2; // Show obstacles from 0 to 120% of screen
          
          
          return (
            <div
              key={o.id}
              className="obstacle"
              style={{
                top: `${y}%`,
                left: `${o.x * 100}%`,
                opacity: 1,
                display: isVisible ? 'block' : 'none',
                zIndex: 10,
              }}
            >
              🚧
            </div>
          );
        })}
      </div>
      <div className="dodge-cta">
        <button className="race-button" onClick={start} disabled={!canPlay || running}>
          {running ? "Racing..." : "Start Race"}
        </button>
        <div className="hint">Controls: Arrow Up/Down or W/S</div>
      </div>
    </div>
  );
};

export default DodgeRace;


