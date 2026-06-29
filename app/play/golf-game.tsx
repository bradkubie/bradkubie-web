"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// --- Logical canvas dimensions (scaled responsively via CSS) ---
const W = 800;
const H = 500;
const PAD = 18; // inset of the boundary walls

// --- Physics tuning ---
const BALL_R = 8;
const HOLE_R = 15;
const MAX_POWER = 1100; // max launch speed (px/sec)
const POWER_SCALE = 6.4; // drag length (px) -> launch speed
const MAX_DRAG = MAX_POWER / POWER_SCALE;
const FRICTION = 0.987; // per 1/60s frame
const STOP_SPEED = 7; // below this speed the ball is considered stopped
const CAPTURE_SPEED = 380; // max speed at which the hole will capture the ball
const RESTITUTION = 0.72; // bounce energy retained off walls

type Vec = { x: number; y: number };
type Rect = { x: number; y: number; w: number; h: number };
type Level = { name: string; par: number; tee: Vec; hole: Vec; walls: Rect[] };

// Ten levels of increasing difficulty. Coordinates are in logical space.
const LEVELS: Level[] = [
  {
    name: "Warm-up",
    par: 2,
    tee: { x: 70, y: 250 },
    hole: { x: 730, y: 250 },
    walls: [],
  },
  {
    name: "Cross-court",
    par: 2,
    tee: { x: 70, y: 430 },
    hole: { x: 730, y: 70 },
    walls: [],
  },
  {
    name: "The Pillar",
    par: 3,
    tee: { x: 70, y: 250 },
    hole: { x: 730, y: 250 },
    walls: [{ x: 378, y: 150, w: 44, h: 200 }],
  },
  {
    name: "The Gate",
    par: 3,
    tee: { x: 70, y: 250 },
    hole: { x: 730, y: 250 },
    walls: [
      { x: 392, y: PAD, w: 38, h: 178 },
      { x: 392, y: 304, w: 38, h: H - PAD - 304 },
    ],
  },
  {
    name: "Dogleg",
    par: 3,
    tee: { x: 80, y: 420 },
    hole: { x: 720, y: 90 },
    walls: [
      { x: 250, y: 180, w: 320, h: 34 },
      { x: 536, y: 180, w: 34, h: 240 },
    ],
  },
  {
    name: "Slalom",
    par: 4,
    tee: { x: 70, y: 90 },
    hole: { x: 730, y: 410 },
    walls: [
      { x: 200, y: PAD, w: 36, h: 320 },
      { x: 400, y: 160, w: 36, h: H - PAD - 160 },
      { x: 600, y: PAD, w: 36, h: 320 },
    ],
  },
  {
    name: "Double Doors",
    par: 3,
    tee: { x: 70, y: 250 },
    hole: { x: 730, y: 250 },
    walls: [
      { x: 300, y: PAD, w: 36, h: 168 },
      { x: 300, y: 312, w: 36, h: H - PAD - 312 },
      { x: 470, y: PAD, w: 36, h: 168 },
      { x: 470, y: 312, w: 36, h: H - PAD - 312 },
    ],
  },
  {
    name: "The Vault",
    par: 3,
    tee: { x: 80, y: 250 },
    hole: { x: 410, y: 250 },
    walls: [
      { x: 300, y: 150, w: 230, h: 34 },
      { x: 300, y: 316, w: 230, h: 34 },
      { x: 496, y: 150, w: 34, h: 200 },
    ],
  },
  {
    name: "Minefield",
    par: 4,
    tee: { x: 70, y: 430 },
    hole: { x: 730, y: 70 },
    walls: [
      { x: 200, y: 300, w: 78, h: 78 },
      { x: 360, y: 170, w: 78, h: 78 },
      { x: 520, y: 320, w: 78, h: 78 },
      { x: 600, y: 130, w: 78, h: 78 },
    ],
  },
  {
    name: "The Gauntlet",
    par: 4,
    tee: { x: 70, y: 250 },
    hole: { x: 730, y: 250 },
    walls: [
      { x: 175, y: PAD, w: 34, h: 300 },
      { x: 320, y: 184, w: 34, h: H - PAD - 184 },
      { x: 465, y: PAD, w: 34, h: 300 },
      { x: 610, y: 184, w: 34, h: H - PAD - 184 },
    ],
  },
];

const TOTAL_PAR = LEVELS.reduce((sum, l) => sum + l.par, 0);

// Score relative to par, with the golf name and a tone for colouring.
function scoreTerm(
  strokes: number,
  par: number,
): { term: string; tone: "good" | "even" | "bad" } {
  const diff = strokes - par;
  if (diff <= -3) return { term: "Albatross", tone: "good" };
  if (diff === -2) return { term: "Eagle", tone: "good" };
  if (diff === -1) return { term: "Birdie", tone: "good" };
  if (diff === 0) return { term: "Par", tone: "even" };
  if (diff === 1) return { term: "Bogey", tone: "bad" };
  if (diff === 2) return { term: "Double bogey", tone: "bad" };
  if (diff === 3) return { term: "Triple bogey", tone: "bad" };
  return { term: `${diff} over`, tone: "bad" };
}

// "Even", "-3", "+5" style formatting for a to-par total.
const formatToPar = (diff: number) =>
  diff === 0 ? "Even" : diff > 0 ? `+${diff}` : `${diff}`;

type Phase = "aim" | "roll" | "sunk" | "done";

type GameState = {
  ball: Vec;
  vel: Vec;
  moving: boolean;
  level: Level;
  strokes: number;
  aiming: boolean;
  pointer: Vec; // current pointer position while aiming
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export default function GolfGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);

  const [levelIdx, setLevelIdx] = useState(0);
  const [strokes, setStrokes] = useState(0);
  const [scores, setScores] = useState<number[]>([]); // strokes per completed hole
  const [phase, setPhase] = useState<Phase>("aim");
  const [best, setBest] = useState<number | null>(null);

  const holeInOnes = scores.filter((s) => s === 1).length;

  // Running totals across completed holes.
  const completedStrokes = scores.reduce((a, b) => a + b, 0);
  const completedPar = LEVELS.slice(0, scores.length).reduce(
    (a, l) => a + l.par,
    0,
  );
  const toPar = completedStrokes - completedPar; // running score vs par

  // Load best score once.
  useEffect(() => {
    // Hydrate the persisted best (lowest) to-par score from localStorage after
    // mount. Done in an effect (not a lazy initializer) so server and client
    // first-render markup match; this is the legitimate external-store sync case.
    const raw = window.localStorage.getItem("golf-best-score");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (raw !== null) setBest(Number(raw));
  }, []);

  const scoresRef = useRef<number[]>([]);

  // Build the mutable ball/level state for a hole (touches the ref only, never
  // React state — so it is safe to call from an effect).
  const buildState = useCallback((idx: number) => {
    const level = LEVELS[idx];
    stateRef.current = {
      ball: { ...level.tee },
      vel: { x: 0, y: 0 },
      moving: false,
      level,
      strokes: 0,
      aiming: false,
      pointer: { ...level.tee },
    };
  }, []);

  // Initialise the first hole once on mount. Initial React state already
  // matches (strokes 0, phase "aim"), so no setState is needed here. Level
  // changes are driven imperatively from the button handlers instead.
  useEffect(() => {
    if (!stateRef.current) buildState(levelIdx);
  }, [levelIdx, buildState]);

  // --- Collision helpers ---
  const collideRect = (g: GameState, r: Rect) => {
    const b = g.ball;
    const cx = clamp(b.x, r.x, r.x + r.w);
    const cy = clamp(b.y, r.y, r.y + r.h);
    const dx = b.x - cx;
    const dy = b.y - cy;
    const dist2 = dx * dx + dy * dy;
    if (dist2 > BALL_R * BALL_R) return;

    if (dist2 < 0.0001) {
      // Center is inside the rect — push out along the nearest edge.
      const left = b.x - r.x;
      const right = r.x + r.w - b.x;
      const top = b.y - r.y;
      const bottom = r.y + r.h - b.y;
      const m = Math.min(left, right, top, bottom);
      if (m === left) {
        b.x = r.x - BALL_R;
        g.vel.x = -Math.abs(g.vel.x) * RESTITUTION;
      } else if (m === right) {
        b.x = r.x + r.w + BALL_R;
        g.vel.x = Math.abs(g.vel.x) * RESTITUTION;
      } else if (m === top) {
        b.y = r.y - BALL_R;
        g.vel.y = -Math.abs(g.vel.y) * RESTITUTION;
      } else {
        b.y = r.y + r.h + BALL_R;
        g.vel.y = Math.abs(g.vel.y) * RESTITUTION;
      }
      return;
    }

    const dist = Math.sqrt(dist2);
    const nx = dx / dist;
    const ny = dy / dist;
    const overlap = BALL_R - dist;
    b.x += nx * overlap;
    b.y += ny * overlap;
    const vdotn = g.vel.x * nx + g.vel.y * ny;
    g.vel.x = (g.vel.x - 2 * vdotn * nx) * RESTITUTION;
    g.vel.y = (g.vel.y - 2 * vdotn * ny) * RESTITUTION;
  };

  const commitBest = useCallback((finalToPar: number) => {
    const raw = window.localStorage.getItem("golf-best-score");
    const prevBest = raw === null ? Infinity : Number(raw);
    if (finalToPar < prevBest) {
      window.localStorage.setItem("golf-best-score", String(finalToPar));
      setBest(finalToPar);
    }
  }, []);

  const onSunk = useCallback(() => {
    const g = stateRef.current;
    if (!g) return;
    const finalScores = [...scoresRef.current, g.strokes];
    scoresRef.current = finalScores;
    setScores(finalScores);
    if (levelIdx >= LEVELS.length - 1) {
      const finalToPar = finalScores.reduce((a, b) => a + b, 0) - TOTAL_PAR;
      commitBest(finalToPar);
      setPhase("done");
    } else {
      setPhase("sunk");
    }
  }, [levelIdx, commitBest]);

  // --- Physics step (fixed sub-steps for stability) ---
  const stepPhysics = useCallback(
    (g: GameState, dt: number) => {
      const SUB = 1 / 240;
      let remaining = Math.min(dt, 0.05);
      const frictionPerSub = Math.pow(FRICTION, SUB * 60);

      while (remaining > 0) {
        const h = Math.min(SUB, remaining);
        remaining -= h;

        // Gentle pull into the hole when close, so near-misses curl in.
        const hx = g.level.hole.x - g.ball.x;
        const hy = g.level.hole.y - g.ball.y;
        const hd = Math.hypot(hx, hy);
        if (hd < HOLE_R * 2.6 && hd > 0.001) {
          const pull = 900 * (1 - hd / (HOLE_R * 2.6));
          g.vel.x += (hx / hd) * pull * h;
          g.vel.y += (hy / hd) * pull * h;
        }

        g.ball.x += g.vel.x * h;
        g.ball.y += g.vel.y * h;
        g.vel.x *= frictionPerSub;
        g.vel.y *= frictionPerSub;

        // Boundary walls.
        const minX = PAD + BALL_R;
        const maxX = W - PAD - BALL_R;
        const minY = PAD + BALL_R;
        const maxY = H - PAD - BALL_R;
        if (g.ball.x < minX) {
          g.ball.x = minX;
          g.vel.x = Math.abs(g.vel.x) * RESTITUTION;
        } else if (g.ball.x > maxX) {
          g.ball.x = maxX;
          g.vel.x = -Math.abs(g.vel.x) * RESTITUTION;
        }
        if (g.ball.y < minY) {
          g.ball.y = minY;
          g.vel.y = Math.abs(g.vel.y) * RESTITUTION;
        } else if (g.ball.y > maxY) {
          g.ball.y = maxY;
          g.vel.y = -Math.abs(g.vel.y) * RESTITUTION;
        }

        // Obstacles.
        for (const r of g.level.walls) collideRect(g, r);

        // Hole capture.
        const speed = Math.hypot(g.vel.x, g.vel.y);
        const distHole = Math.hypot(
          g.level.hole.x - g.ball.x,
          g.level.hole.y - g.ball.y,
        );
        if (distHole < HOLE_R - 2 && speed < CAPTURE_SPEED) {
          g.ball.x = g.level.hole.x;
          g.ball.y = g.level.hole.y;
          g.vel.x = 0;
          g.vel.y = 0;
          g.moving = false;
          onSunk();
          return;
        }
      }

      if (Math.hypot(g.vel.x, g.vel.y) < STOP_SPEED) {
        g.vel.x = 0;
        g.vel.y = 0;
        if (g.moving) {
          g.moving = false;
          setPhase("aim");
        }
      }
    },
    [onSunk],
  );

  // --- Render + animation loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let last = performance.now();

    const draw = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const g = stateRef.current;
      if (!g) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      if (g.moving) stepPhysics(g, dt);

      // Background green.
      ctx.fillStyle = "#0b3a25";
      ctx.fillRect(0, 0, W, H);

      // Subtle mow stripes.
      ctx.fillStyle = "rgba(255,255,255,0.025)";
      for (let i = 0; i < W; i += 80) ctx.fillRect(i, 0, 40, H);

      // Boundary.
      ctx.strokeStyle = "rgba(148, 197, 168, 0.5)";
      ctx.lineWidth = 3;
      ctx.strokeRect(PAD, PAD, W - PAD * 2, H - PAD * 2);

      // Walls.
      for (const r of g.level.walls) {
        ctx.fillStyle = "#15543a";
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = "rgba(180, 230, 200, 0.45)";
        ctx.lineWidth = 2;
        ctx.strokeRect(r.x, r.y, r.w, r.h);
      }

      // Hole.
      const hole = g.level.hole;
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, HOLE_R, 0, Math.PI * 2);
      ctx.fillStyle = "#04140d";
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Flag.
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hole.x, hole.y - 2);
      ctx.lineTo(hole.x, hole.y - 40);
      ctx.stroke();
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(hole.x, hole.y - 40);
      ctx.lineTo(hole.x + 22, hole.y - 33);
      ctx.lineTo(hole.x, hole.y - 26);
      ctx.closePath();
      ctx.fill();

      // Aim line + power meter.
      if (g.aiming && !g.moving) {
        const dx = g.ball.x - g.pointer.x;
        const dy = g.ball.y - g.pointer.y;
        const len = Math.hypot(dx, dy);
        const drag = Math.min(len, MAX_DRAG);
        const power = drag / MAX_DRAG; // 0..1
        if (len > 0.001) {
          const ux = dx / len;
          const uy = dy / len;
          const guide = 60 + power * 150;
          ctx.strokeStyle = `rgba(${56 + power * 199}, ${189 - power * 100}, ${248 - power * 200}, 0.9)`;
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 8]);
          ctx.beginPath();
          ctx.moveTo(g.ball.x, g.ball.y);
          ctx.lineTo(g.ball.x + ux * guide, g.ball.y + uy * guide);
          ctx.stroke();
          ctx.setLineDash([]);

          // Pull-back indicator.
          ctx.strokeStyle = "rgba(226,232,240,0.45)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(g.ball.x, g.ball.y);
          ctx.lineTo(g.ball.x - ux * drag, g.ball.y - uy * drag);
          ctx.stroke();
        }
      }

      // Ball.
      const b = g.ball;
      const grad = ctx.createRadialGradient(
        b.x - 3,
        b.y - 3,
        1,
        b.x,
        b.y,
        BALL_R,
      );
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(1, "#cbd5e1");
      ctx.beginPath();
      ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(15,23,42,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stepPhysics]);

  // --- Pointer input ---
  const toLogical = (e: React.PointerEvent<HTMLCanvasElement>): Vec => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = stateRef.current;
    if (!g || g.moving || phase !== "aim") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    g.aiming = true;
    g.pointer = toLogical(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = stateRef.current;
    if (!g || !g.aiming) return;
    g.pointer = toLogical(e);
  };

  const handlePointerUp = () => {
    const g = stateRef.current;
    if (!g || !g.aiming) return;
    g.aiming = false;
    const dx = g.ball.x - g.pointer.x;
    const dy = g.ball.y - g.pointer.y;
    const len = Math.hypot(dx, dy);
    if (len < 6) return; // ignore taps / accidental clicks
    const drag = Math.min(len, MAX_DRAG);
    const ux = dx / len;
    const uy = dy / len;
    const speed = drag * POWER_SCALE;
    g.vel.x = ux * speed;
    g.vel.y = uy * speed;
    g.moving = true;
    g.strokes += 1;
    setStrokes(g.strokes);
    setPhase("roll");
  };

  // --- UI actions (event handlers — safe to call setState directly) ---
  const replayHole = () => {
    buildState(levelIdx);
    setStrokes(0);
    setPhase("aim");
  };

  const nextHole = () => {
    const ni = levelIdx + 1;
    buildState(ni);
    setLevelIdx(ni);
    setStrokes(0);
    setPhase("aim");
  };

  const playAgain = () => {
    scoresRef.current = [];
    setScores([]);
    buildState(0);
    setLevelIdx(0);
    setStrokes(0);
    setPhase("aim");
  };

  const sunkResult = scores[scores.length - 1];
  const sunkPar = LEVELS[levelIdx].par;
  const sunkTerm =
    sunkResult != null ? scoreTerm(sunkResult, sunkPar) : null;
  const doneTone: "good" | "even" | "bad" =
    toPar < 0 ? "good" : toPar > 0 ? "bad" : "even";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
              Easter egg
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
              Putt-Putt Challenge
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300">
              Drag back from the ball to aim and set power, then release to putt.
              Ten holes, par {TOTAL_PAR} — sink each in as few strokes as you can
              and try to finish under par.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-300/40 hover:text-sky-100"
          >
            ← Back to site
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <Stat label="Hole" value={`${levelIdx + 1} / ${LEVELS.length}`} />
          <Stat label="Course" value={LEVELS[levelIdx].name} />
          <Stat label="Par" value={String(LEVELS[levelIdx].par)} />
          <Stat label="Strokes" value={String(strokes)} />
          <Stat
            label="Score"
            value={formatToPar(toPar)}
            tone={toPar < 0 ? "good" : toPar > 0 ? "bad" : undefined}
            accent
          />
          <Stat label="Holes-in-one" value={`${holeInOnes}`} />
          {best !== null && (
            <Stat label="Best" value={formatToPar(best)} />
          )}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/60 shadow-2xl shadow-emerald-950/30">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="block w-full touch-none select-none"
          style={{ aspectRatio: `${W} / ${H}` }}
        />

        {phase === "sunk" && sunkTerm && (
          <Overlay>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
              {sunkResult === 1 ? "Hole in one!" : "Sunk it"}
            </p>
            <p className={`mt-2 text-3xl font-semibold ${toneClass(sunkTerm.tone)}`}>
              {sunkResult === 1 ? "Ace! 🏌️" : sunkTerm.term}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              {sunkResult} stroke{sunkResult === 1 ? "" : "s"} · par {sunkPar}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={nextHole}
                className="rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Next hole →
              </button>
            </div>
          </Overlay>
        )}

        {phase === "done" && (
          <Overlay>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
              Round complete
            </p>
            <p className={`mt-2 text-5xl font-semibold ${toneClass(doneTone)}`}>
              {formatToPar(toPar)}
            </p>
            <p className="mt-1 text-sm text-slate-300">
              {completedStrokes} strokes · par {TOTAL_PAR} · {holeInOnes} hole
              {holeInOnes === 1 ? "" : "s"}-in-one
            </p>
            <p className="mt-3 text-base text-slate-200">
              {toPar <= -6
                ? "Course record pace. 🐐"
                : toPar < 0
                  ? "Under par — superb golf. ⛳"
                  : toPar === 0
                    ? "Even par. Clean round."
                    : toPar <= 5
                      ? "Solid round."
                      : "Keep practicing!"}
            </p>
            {best !== null && toPar <= best && (
              <p className="mt-2 text-sm font-semibold text-emerald-300">
                ★ New best score!
              </p>
            )}
            <div className="mt-5 flex gap-3">
              <button
                onClick={playAgain}
                className="rounded-full bg-sky-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
              >
                Play again
              </button>
              <Link
                href="/"
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-sky-300/40 hover:text-sky-100"
              >
                Done
              </Link>
            </div>
          </Overlay>
        )}
      </div>

      {(phase === "aim" || phase === "roll") && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Tip: a longer drag = a harder putt. Use the walls to bank shots.
          </p>
          <button
            onClick={replayHole}
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-300/40 hover:text-sky-100"
          >
            Replay hole
          </button>
        </div>
      )}
    </div>
  );
}

const toneClass = (tone: "good" | "even" | "bad") =>
  tone === "good"
    ? "text-emerald-300"
    : tone === "bad"
      ? "text-amber-300"
      : "text-sky-300";

function Stat({
  label,
  value,
  accent,
  tone,
}: {
  label: string;
  value: string;
  accent?: boolean;
  tone?: "good" | "bad";
}) {
  const toneText =
    tone === "good"
      ? "text-emerald-300"
      : tone === "bad"
        ? "text-amber-300"
        : "";
  return (
    <div
      className={`rounded-2xl border px-4 py-2 ${
        accent
          ? "border-sky-400/30 bg-sky-400/10 text-sky-100"
          : "border-white/10 bg-slate-950/40 text-slate-200"
      }`}
    >
      <span className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <p className={`text-base font-semibold leading-tight ${toneText}`}>
        {value}
      </p>
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      <div className="rounded-[1.5rem] border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl">
        {children}
      </div>
    </div>
  );
}
