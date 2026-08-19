"use client";

import { Crown, RotateCcw, Shield, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const ROWS = 11;
const COLS = 15;
const START = 16;
const GUARD_STARTS = [73, 88];
const WALLS = new Set([
  0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,
  15,19,25,29,30,32,34,35,36,38,40,41,42,44,
  45,49,53,55,59,60,61,62,64,66,68,70,72,73,74,
  75,79,83,89,90,92,94,95,96,98,100,101,102,104,
  105,109,113,115,119,120,122,123,124,126,128,129,130,132,134,
  135,139,145,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,
]);

type Direction = "up" | "down" | "left" | "right";
const DELTA: Record<Direction, number> = { up: -COLS, down: COLS, left: -1, right: 1 };

export function validVaultMove(from: number, direction: Direction) {
  const next = from + DELTA[direction];
  if (next < 0 || next >= ROWS * COLS || WALLS.has(next)) return from;
  if (direction === "left" && from % COLS === 0) return from;
  if (direction === "right" && from % COLS === COLS - 1) return from;
  return next;
}

export function createVaultSeals() {
  return new Set(Array.from({ length: ROWS * COLS }, (_, index) => index).filter(index => !WALLS.has(index) && index !== START && !GUARD_STARTS.includes(index)));
}

export function VaultRun() {
  const initialSeals = useMemo(() => createVaultSeals(), []);
  const [player, setPlayer] = useState(START);
  const [guards, setGuards] = useState(GUARD_STARTS);
  const [seals, setSeals] = useState(initialSeals);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [seconds, setSeconds] = useState(60);
  const [status, setStatus] = useState<"ready" | "playing" | "won" | "lost">("ready");
  const [highScore, setHighScore] = useState(0);
  const tick = useRef(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setHighScore(Number(window.localStorage.getItem("hs-vault-run-high-score") ?? 0));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const finish = useCallback((nextStatus: "won" | "lost", finalScore: number) => {
    setStatus(nextStatus);
    setHighScore(previous => {
      const next = Math.max(previous, finalScore);
      window.localStorage.setItem("hs-vault-run-high-score", String(next));
      return next;
    });
  }, []);

  const move = useCallback((direction: Direction) => {
    if (status !== "playing") return;
    setPlayer(current => {
      const next = validVaultMove(current, direction);
      setSeals(currentSeals => {
        if (!currentSeals.has(next)) return currentSeals;
        const remaining = new Set(currentSeals);
        remaining.delete(next);
        setScore(currentScore => {
          const nextScore = currentScore + 10;
          if (remaining.size === 0) finish("won", nextScore + seconds * 5);
          return nextScore;
        });
        return remaining;
      });
      return next;
    });
  }, [finish, seconds, status]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const keys: Partial<Record<string, Direction>> = { ArrowUp: "up", w: "up", ArrowDown: "down", s: "down", ArrowLeft: "left", a: "left", ArrowRight: "right", d: "right" };
      const direction = keys[event.key];
      if (direction) { event.preventDefault(); move(direction); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  useEffect(() => {
    if (status !== "playing") return;
    const interval = window.setInterval(() => {
      setSeconds(value => {
        if (value <= 1) { finish("lost", score); return 0; }
        return value - 1;
      });
      tick.current += 1;
      if (tick.current % 2 === 0) {
        setGuards(current => current.map((guard, guardIndex) => {
          const rowDiff = Math.floor(player / COLS) - Math.floor(guard / COLS);
          const colDiff = player % COLS - guard % COLS;
          const choices: Direction[] = Math.abs(colDiff) > Math.abs(rowDiff)
            ? [colDiff > 0 ? "right" : "left", rowDiff > 0 ? "down" : "up"]
            : [rowDiff > 0 ? "down" : "up", colDiff > 0 ? "right" : "left"];
          const chase = validVaultMove(guard, choices[guardIndex % choices.length]);
          return chase === guard ? validVaultMove(guard, choices[(guardIndex + 1) % choices.length]) : chase;
        }));
      }
    }, 500);
    return () => window.clearInterval(interval);
  }, [finish, player, score, status]);

  useEffect(() => {
    if (status !== "playing" || !guards.includes(player)) return;
    const timeout = window.setTimeout(() => {
      setLives(value => {
        if (value <= 1) { finish("lost", score); return 0; }
        return value - 1;
      });
      setPlayer(START);
      setGuards(GUARD_STARTS);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [finish, guards, player, score, status]);

  const start = () => {
    setPlayer(START); setGuards(GUARD_STARTS); setSeals(createVaultSeals()); setScore(0); setLives(3); setSeconds(60); setStatus("playing"); tick.current = 0;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
      <div className="min-w-0">
        <div className="mb-4 grid grid-cols-4 divide-x divide-white/10 border border-white/10 bg-black/30 text-center">
          {[['Score', score], ['Seals', seals.size], ['Time', `${seconds}s`], ['Lives', lives]].map(([label, value]) => <div key={label} className="px-2 py-3"><p className="text-[10px] uppercase text-zinc-500">{label}</p><p className="mt-1 font-mono text-sm text-[#ffc263]">{value}</p></div>)}
        </div>
        <div className="relative mx-auto aspect-[15/11] w-full max-w-[760px] overflow-hidden border border-[#e5a12b]/35 bg-[#070706] p-1 shadow-[0_25px_80px_rgba(0,0,0,.55)]">
          <div className="grid h-full w-full grid-cols-[repeat(15,minmax(0,1fr))] grid-rows-[repeat(11,minmax(0,1fr))] gap-[2px]">
            {Array.from({ length: ROWS * COLS }, (_, index) => (
              <div key={index} className={`relative flex items-center justify-center ${WALLS.has(index) ? "bg-[#29261e] shadow-[inset_0_0_0_1px_rgba(212,175,55,.12)]" : "bg-[#0d0d0b]"}`}>
                {seals.has(index) && <span className="h-[18%] w-[18%] rounded-full bg-[#e5a12b] shadow-[0_0_8px_#e5a12b]" />}
                {player === index && <span className="absolute z-20 flex h-[70%] w-[70%] items-center justify-center rounded-full bg-[#e5a12b] text-black shadow-[0_0_15px_#e5a12b]"><Crown className="h-[60%] w-[60%]" /></span>}
                {guards.includes(index) && <span className="absolute z-10 flex h-[68%] w-[68%] items-center justify-center bg-[#8f2730] text-white"><Shield className="h-[55%] w-[55%]" /></span>}
              </div>
            ))}
          </div>
          {status !== "playing" && <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6 text-center backdrop-blur-sm"><Sparkles className="h-8 w-8 text-[#e5a12b]" /><h3 className="mt-4 text-2xl font-medium">{status === "ready" ? "Crack the inner vault" : status === "won" ? "Vault cleared" : "Security locked you out"}</h3><p className="mt-2 max-w-sm text-sm text-zinc-400">Collect every gold seal before time expires. Avoid security and protect your three lives.</p><button onClick={start} className="mt-6 inline-flex h-11 items-center gap-2 bg-[#e5a12b] px-5 text-sm font-semibold text-black"><RotateCcw className="h-4 w-4" />{status === "ready" ? "Start run" : "Run again"}</button></div>}
        </div>
        <div className="mx-auto mt-4 grid w-40 grid-cols-3 gap-2 lg:hidden">
          <button className="game-control col-start-2" onClick={() => move("up")} aria-label="Move up">↑</button><button className="game-control" onClick={() => move("left")} aria-label="Move left">←</button><button className="game-control" onClick={() => move("down")} aria-label="Move down">↓</button><button className="game-control" onClick={() => move("right")} aria-label="Move right">→</button>
        </div>
      </div>
      <aside className="border-t border-[#e5a12b]/30 pt-5">
        <p className="eyebrow">Vault protocol</p><h3 className="mt-3 text-xl font-medium">Move with purpose.</h3>
        <div className="mt-6 space-y-5 text-sm leading-6 text-zinc-400"><p>Use arrow keys or WASD. Mobile controls appear below the vault.</p><p>Each gold seal is worth 10 points. Remaining time becomes a win bonus.</p><p>Your high score stays on this device.</p></div>
        <div className="mt-8 border border-white/10 bg-black/30 p-4"><p className="text-xs uppercase text-zinc-500">Personal best</p><p className="mt-2 font-mono text-2xl text-[#ffc263]">{highScore.toLocaleString()}</p></div>
      </aside>
    </div>
  );
}
