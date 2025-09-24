import React, { useEffect, useMemo, useRef, useState } from "react";
import "./RaceTrack.css";

type WheelSlotLike =
  | string
  | {
      id: number;
      name: string;
      value: number;
      type: "eth" | "gm";
      color: string;
    };

interface RaceTrackProps {
  isRacening: boolean;
  onRaceComplete: (result: string) => void;
  onRace: () => void;
  slots: WheelSlotLike[];
  canRace: boolean;
  targetSlotIndex?: number | null;
  onBlockedRace?: () => void;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({
  isRacening,
  onRaceComplete,
  onRace,
  slots,
  canRace,
  targetSlotIndex = null,
  onBlockedRace,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [raceLane, setRaceLane] = useState<number | null>(null);
  const [hasSpunThisRound, setHasSpunThisRound] = useState(false);
  const carRef = useRef<HTMLDivElement>(null);

  const normalizedSlots = useMemo(() => {
    return slots.map((slot, index) => {
      if (typeof slot === "string") {
        return {
          name: slot,
          value: index + 1,
          type: "gm" as const,
          color: index % 2 === 0 ? "#4a90e2" : "#357abd",
        };
      }
      return {
        name: slot.name,
        value: slot.value,
        type: slot.type,
        color: slot.color,
      };
    });
  }, [slots]);

  useEffect(() => {
    if (isRacening && !isAnimating && !hasSpunThisRound) {
      setIsAnimating(true);
      setHasSpunThisRound(true);

      const laneIndex =
        targetSlotIndex != null ? targetSlotIndex : Math.floor(Math.random() * normalizedSlots.length);
      setRaceLane(laneIndex);

      const durationMs = 4500;

      const id = setTimeout(() => {
        const s = normalizedSlots[laneIndex];
        const resultWithDetails = {
          slotIndex: laneIndex,
          slotName: s?.name,
          slotValue: s?.value,
          slotType: s?.type,
          result: `${s?.name} ${String(s?.value ?? "")}`,
        };
        onRaceComplete?.(JSON.stringify(resultWithDetails));
        setIsAnimating(false);
      }, durationMs);

      return () => clearTimeout(id);
    }
  }, [isRacening, isAnimating, hasSpunThisRound, targetSlotIndex, normalizedSlots, onRaceComplete]);

  useEffect(() => {
    if (!isRacening) {
      setHasSpunThisRound(false);
    }
  }, [isRacening]);

  return (
    <div className="race-container">
      <div className="race-header">
        <div className="race-title">🏁 Crypto Race</div>
        <div className="race-subtitle">Confidential prizes, verifiable results</div>
      </div>

      <div className="track">
        {normalizedSlots.map((s, i) => (
          <div key={i} className="lane" style={{ background: i % 2 ? "rgba(255,255,255,0.03)" : "transparent" }}>
            <div className="lane-meta">
              <span className="lane-badge" style={{ background: s.color }}>
                {i + 1}
              </span>
              <span className="lane-text">
                {s.name} {s.value ? `· ${s.value}` : ""}
              </span>
            </div>
            <div
              className={`car ${isAnimating && raceLane === i ? "car-run" : ""}`}
              style={{ borderColor: s.color }}
              ref={raceLane === i ? carRef : undefined}
            >
              <span className="car-emoji">🏎️</span>
            </div>
          </div>
        ))}
      </div>

      <div className="race-cta">
        <button
          className="race-button"
          onClick={() => {
            if (!canRace) {
              onBlockedRace?.();
              return;
            }
            if (isRacening || isAnimating) return;
            onRace();
          }}
          disabled={isRacening || isAnimating}
        >
          {isRacening || isAnimating ? "Racing..." : "Start Race"}
        </button>
      </div>
    </div>
  );
};

export default RaceTrack;


