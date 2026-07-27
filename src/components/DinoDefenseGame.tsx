"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Crosshair, Play, RotateCcw, Zap } from "lucide-react";

const WIDTH = 960;
const HEIGHT = 540;
const GROUND = 448;

type GameStatus = "ready" | "playing" | "gameover";
type Dino = { x: number; y: number; width: number; height: number; speed: number; hue: number };
type Shot = { x: number; y: number; speed: number };
type GameState = {
  robotX: number;
  robotY: number;
  velocityY: number;
  direction: -1 | 1;
  dinos: Dino[];
  shots: Shot[];
  score: number;
  lives: number;
  wave: number;
  spawnClock: number;
  lastFrame: number;
  lastShot: number;
};

function createGameState(): GameState {
  return {
    robotX: 120,
    robotY: GROUND,
    velocityY: 0,
    direction: 1,
    dinos: [],
    shots: [],
    score: 0,
    lives: 3,
    wave: 1,
    spawnClock: 0,
    lastFrame: 0,
    lastShot: 0,
  };
}

function overlap(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function drawRobot(context: CanvasRenderingContext2D, x: number, groundY: number, direction: -1 | 1) {
  context.save();
  context.translate(x, groundY);
  context.scale(direction, 1);
  const body = context.createLinearGradient(-25, -75, 30, -15);
  body.addColorStop(0, "#dffcff");
  body.addColorStop(0.48, "#82f3ff");
  body.addColorStop(1, "#6d5dfc");
  context.shadowColor = "rgba(0,229,255,.45)";
  context.shadowBlur = 24;
  context.fillStyle = body;
  context.beginPath();
  context.roundRect(-24, -70, 48, 48, 12);
  context.fill();
  context.shadowBlur = 0;
  context.fillStyle = "#071014";
  context.beginPath();
  context.roundRect(-16, -60, 32, 16, 8);
  context.fill();
  context.fillStyle = "#00f5a0";
  context.beginPath();
  context.arc(7, -52, 3.5, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "#b8fbff";
  context.lineWidth = 7;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(-12, -20);
  context.lineTo(-17, 0);
  context.moveTo(12, -20);
  context.lineTo(18, 0);
  context.moveTo(22, -53);
  context.lineTo(40, -46);
  context.stroke();
  context.fillStyle = "#00e5ff";
  context.fillRect(38, -50, 18, 8);
  context.restore();
}

function drawDino(context: CanvasRenderingContext2D, dino: Dino) {
  context.save();
  context.translate(dino.x, dino.y);
  const fill = context.createLinearGradient(0, 0, dino.width, dino.height);
  fill.addColorStop(0, `hsla(${dino.hue}, 92%, 62%, .94)`);
  fill.addColorStop(1, `hsla(${dino.hue + 58}, 88%, 48%, .82)`);
  context.fillStyle = fill;
  context.shadowColor = `hsla(${dino.hue}, 90%, 55%, .28)`;
  context.shadowBlur = 22;
  context.beginPath();
  context.ellipse(dino.width * 0.46, dino.height * 0.55, dino.width * 0.4, dino.height * 0.34, -0.1, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.ellipse(dino.width * 0.8, dino.height * 0.28, dino.width * 0.22, dino.height * 0.2, 0.25, 0, Math.PI * 2);
  context.fill();
  context.shadowBlur = 0;
  context.fillStyle = "#071014";
  context.beginPath();
  context.arc(dino.width * 0.86, dino.height * 0.23, 3, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = fill;
  context.lineWidth = Math.max(5, dino.width * 0.1);
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(dino.width * 0.3, dino.height * 0.78);
  context.lineTo(dino.width * 0.2, dino.height);
  context.moveTo(dino.width * 0.62, dino.height * 0.78);
  context.lineTo(dino.width * 0.7, dino.height);
  context.moveTo(dino.width * 0.12, dino.height * 0.5);
  context.lineTo(-dino.width * 0.18, dino.height * 0.28);
  context.stroke();
  context.restore();
}

export function DinoDefenseGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const statusRef = useRef<GameStatus>("ready");
  const keysRef = useRef(new Set<string>());
  const gameRef = useRef<GameState>(createGameState());
  const [status, setStatus] = useState<GameStatus>("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);

  const jump = useCallback(() => {
    const game = gameRef.current;
    if (statusRef.current === "playing" && game.robotY >= GROUND - 1) game.velocityY = -14;
  }, []);

  const fire = useCallback(() => {
    const game = gameRef.current;
    const now = performance.now();
    if (statusRef.current !== "playing" || now - game.lastShot < 210) return;
    game.lastShot = now;
    game.shots.push({ x: game.robotX + (game.direction === 1 ? 47 : -8), y: game.robotY - 50, speed: 12 * game.direction });
  }, []);

  const drawScene = useCallback((context: CanvasRenderingContext2D) => {
    const game = gameRef.current;
    context.clearRect(0, 0, WIDTH, HEIGHT);
    const sky = context.createLinearGradient(0, 0, 0, HEIGHT);
    sky.addColorStop(0, "#050507");
    sky.addColorStop(0.6, "#071014");
    sky.addColorStop(1, "#050505");
    context.fillStyle = sky;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    const glows = [
      { x: 130, y: 120, radius: 220, color: "rgba(0,245,160,.12)" },
      { x: 760, y: 150, radius: 260, color: "rgba(0,229,255,.13)" },
      { x: 520, y: 420, radius: 250, color: "rgba(124,58,237,.12)" },
    ];
    for (const glow of glows) {
      const gradient = context.createRadialGradient(glow.x, glow.y, 0, glow.x, glow.y, glow.radius);
      gradient.addColorStop(0, glow.color);
      gradient.addColorStop(1, "transparent");
      context.fillStyle = gradient;
      context.fillRect(glow.x - glow.radius, glow.y - glow.radius, glow.radius * 2, glow.radius * 2);
    }

    context.strokeStyle = "rgba(255,255,255,.045)";
    context.lineWidth = 1;
    for (let x = 0; x <= WIDTH; x += 64) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, GROUND + 20);
      context.stroke();
    }
    for (let y = 64; y <= GROUND; y += 64) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(WIDTH, y);
      context.stroke();
    }

    context.fillStyle = "rgba(255,255,255,.075)";
    context.fillRect(0, GROUND + 2, WIDTH, 2);
    const floorGlow = context.createLinearGradient(0, GROUND, 0, HEIGHT);
    floorGlow.addColorStop(0, "rgba(0,229,255,.09)");
    floorGlow.addColorStop(1, "transparent");
    context.fillStyle = floorGlow;
    context.fillRect(0, GROUND, WIDTH, HEIGHT - GROUND);

    for (const shot of game.shots) {
      context.shadowColor = "#00e5ff";
      context.shadowBlur = 18;
      context.fillStyle = "#dfffff";
      context.fillRect(shot.x, shot.y, 18, 4);
    }
    context.shadowBlur = 0;
    for (const dino of game.dinos) drawDino(context, dino);
    drawRobot(context, game.robotX, game.robotY, game.direction);
  }, []);

  const loop = useCallback((time: number) => {
    const game = gameRef.current;
    const context = canvasRef.current?.getContext("2d");
    if (!context) return;
    const delta = Math.min(32, game.lastFrame ? time - game.lastFrame : 16);
    game.lastFrame = time;

    if (statusRef.current === "playing") {
      const movement = (keysRef.current.has("arrowright") || keysRef.current.has("d") ? 1 : 0) - (keysRef.current.has("arrowleft") || keysRef.current.has("a") ? 1 : 0);
      if (movement) {
        game.direction = movement > 0 ? 1 : -1;
        game.robotX = Math.max(58, Math.min(WIDTH - 140, game.robotX + movement * 5.5 * (delta / 16)));
      }
      if (keysRef.current.has(" ") || keysRef.current.has("f")) fire();

      game.velocityY += 0.78 * (delta / 16);
      game.robotY = Math.min(GROUND, game.robotY + game.velocityY * (delta / 16));
      if (game.robotY >= GROUND) game.velocityY = 0;

      game.spawnClock += delta;
      const spawnEvery = Math.max(560, 1350 - game.wave * 75);
      if (game.spawnClock >= spawnEvery) {
        game.spawnClock = 0;
        const height = 48 + Math.random() * 28;
        const fromRight = Math.random() > 0.16;
        game.dinos.push({
          x: fromRight ? WIDTH + 40 : -100,
          y: GROUND - height,
          width: height * 1.25,
          height,
          speed: (2.3 + game.wave * 0.24 + Math.random() * 1.3) * (fromRight ? -1 : 1),
          hue: [158, 187, 263, 316][Math.floor(Math.random() * 4)],
        });
      }

      game.shots.forEach((shot) => { shot.x += shot.speed * (delta / 16); });
      game.dinos.forEach((dino) => { dino.x += dino.speed * (delta / 16); });

      for (let shotIndex = game.shots.length - 1; shotIndex >= 0; shotIndex -= 1) {
        const shot = game.shots[shotIndex];
        const hitIndex = game.dinos.findIndex((dino) => overlap({ x: shot.x, y: shot.y - 3, width: 20, height: 10 }, dino));
        if (hitIndex >= 0) {
          game.shots.splice(shotIndex, 1);
          game.dinos.splice(hitIndex, 1);
          game.score += 10;
          game.wave = 1 + Math.floor(game.score / 100);
          setScore(game.score);
          setWave(game.wave);
        } else if (shot.x < -30 || shot.x > WIDTH + 30) {
          game.shots.splice(shotIndex, 1);
        }
      }

      const robotHitbox = { x: game.robotX - 22, y: game.robotY - 68, width: 46, height: 68 };
      for (let index = game.dinos.length - 1; index >= 0; index -= 1) {
        const dino = game.dinos[index];
        if (overlap(robotHitbox, dino) || dino.x < -150 || dino.x > WIDTH + 150) {
          game.dinos.splice(index, 1);
          game.lives -= 1;
          setLives(game.lives);
          if (game.lives <= 0) {
            statusRef.current = "gameover";
            setStatus("gameover");
            break;
          }
        }
      }
    }

    drawScene(context);
    frameRef.current = requestAnimationFrame(loop);
  }, [drawScene, fire]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["arrowleft", "arrowright", "arrowup", "a", "d", "w", "f", " "].includes(key)) event.preventDefault();
      keysRef.current.add(key);
      if (key === "arrowup" || key === "w") jump();
    };
    const up = (event: KeyboardEvent) => keysRef.current.delete(event.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    frameRef.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [jump, loop]);

  const start = () => {
    gameRef.current = createGameState();
    statusRef.current = "playing";
    setScore(0);
    setLives(3);
    setWave(1);
    setStatus("playing");
  };

  const move = (direction: -1 | 1) => {
    const game = gameRef.current;
    game.direction = direction;
    game.robotX = Math.max(58, Math.min(WIDTH - 140, game.robotX + direction * 28));
  };

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white/[.055] shadow-[inset_0_1px_0_rgba(255,255,255,.1),0_30px_100px_rgba(0,0,0,.45)] backdrop-blur-[32px]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300/75">Arcade 01</p>
          <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Chrome Ranger: Dino Rush</h2>
        </div>
        <div className="flex items-center gap-4 font-mono text-xs text-white/60 sm:text-sm">
          <span>Score <strong className="text-white">{score}</strong></span>
          <span>Wave <strong className="text-white">{wave}</strong></span>
          <span>Lives <strong className="text-emerald-300">{"●".repeat(lives)}{"○".repeat(3 - lives)}</strong></span>
        </div>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} className="block aspect-video w-full bg-[#050505]" aria-label="Chrome Ranger dinosaur survival game" />
        {status !== "playing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 p-5 backdrop-blur-sm">
            <div className="max-w-md rounded-[1.75rem] bg-black/45 p-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-[32px] sm:p-8">
              <Zap className="mx-auto h-8 w-8 text-cyan-300" />
              <h3 className="mt-4 text-2xl font-semibold text-white">{status === "gameover" ? "The dinosaurs broke through." : "Hold the line."}</h3>
              <p className="mt-3 text-sm leading-6 text-white/55">{status === "gameover" ? `Final score: ${score}. Ready for another run?` : "Move, jump, and fire before the dinosaurs reach your ranger."}</p>
              <button type="button" onClick={start} className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#050505] transition hover:bg-cyan-50">
                {status === "gameover" ? <RotateCcw className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {status === "gameover" ? "Play again" : "Start game"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 p-3 sm:hidden">
        <button type="button" onClick={() => move(-1)} className="flex h-14 items-center justify-center rounded-2xl bg-white/[.07] text-white active:bg-white/[.14]" aria-label="Move left"><ArrowLeft /></button>
        <button type="button" onClick={jump} className="flex h-14 items-center justify-center rounded-2xl bg-white/[.07] text-xs font-semibold uppercase tracking-wider text-white active:bg-white/[.14]">Jump</button>
        <button type="button" onClick={fire} className="flex h-14 items-center justify-center rounded-2xl bg-cyan-300 text-[#050505] active:bg-cyan-200" aria-label="Fire"><Crosshair /></button>
        <button type="button" onClick={() => move(1)} className="flex h-14 items-center justify-center rounded-2xl bg-white/[.07] text-white active:bg-white/[.14]" aria-label="Move right"><ArrowRight /></button>
      </div>
      <div className="hidden items-center justify-between px-7 py-4 text-xs text-white/38 sm:flex">
        <span>Move: A / D or arrow keys · Jump: W / ↑ · Fire: F / space</span>
        <span>Free play · No purchase required</span>
      </div>
    </div>
  );
}
