import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import contentData from '../data/contentData.json';
import {
  Trophy,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Home,
  Copy,
  Check,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';

// Global declaration for callback interfaces
declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

interface FlappyGameSectionProps {
  onBackToMenu: () => void;
}

// ==========================================
// CONFIGURATION VARIABLES (Exact PDF requirements)
// ==========================================
const WIN_SCORE = 20;
const GRAVITY = 0.28;
const JUMP_FORCE = -5.8;
const PIPE_SPEED = 2.0;
const PIPE_GAP = 160; // Generous gap for comfortable customer experience
const VOUCHER_TEXT = "Voucher 2 lít xăng";
const BRAND_NAME = "VietinBank";
const GAME_TITLE = "Chờ vui – Chơi hay – Nhận quà liền tay";

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  passed: boolean;
}

export const FlappyGameSection: React.FC<FlappyGameSectionProps> = ({
  onBackToMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game States
  const [gameState, setGameState] = useState<'start' | 'playing' | 'won' | 'lost'>('start');
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [lastSavedVoucher, setLastSavedVoucher] = useState<{
    code: string;
    date: string;
  } | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Game Loop Refs
  const animationFrameIdRef = useRef<number | null>(null);
  const birdRef = useRef({
    x: 60,
    y: 200,
    velocity: 0,
    width: 38,
    height: 24,
    rotation: 0,
  });
  const pipesRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const isGameOverRef = useRef(false);

  // Web Audio Synth for jump, score, win, crash
  const playSound = useCallback((type: 'jump' | 'point' | 'hit' | 'win') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'jump') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'point') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'hit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'win') {
        // celebratory chime
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const winOsc = ctx.createOscillator();
          const winGain = ctx.createGain();
          winOsc.type = 'triangle';
          winOsc.frequency.value = freq;
          winOsc.connect(winGain);
          winGain.connect(ctx.destination);
          winGain.gain.setValueAtTime(0.18, now + i * 0.12);
          winGain.gain.linearRampToValueAtTime(0.01, now + i * 0.12 + 0.25);
          winOsc.start(now + i * 0.12);
          winOsc.stop(now + i * 0.12 + 0.25);
        });
      }
    } catch {
      // Audio fallback silent
    }
  }, [soundEnabled]);

  // Load High Score & Latest Voucher from LocalStorage on Mount
  useEffect(() => {
    try {
      const savedHigh = localStorage.getItem('vietinbank_flappy_high_score');
      if (savedHigh) setHighScore(parseInt(savedHigh, 10) || 0);

      const savedVoucher = localStorage.getItem('vietinbank_flappy_latest_voucher');
      if (savedVoucher) {
        setLastSavedVoucher(JSON.parse(savedVoucher));
      }
    } catch {
      // ignore storage access issues
    }
  }, []);

  // Function to generate 6 digit voucher: VB-XXXXXX
  const generateVoucherCode = (): string => {
    const digits = Math.floor(100000 + Math.random() * 900000);
    return `VB-${digits}`;
  };

  // Copy voucher to clipboard
  const copyVoucherCode = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2000);
  };

  // Trigger Win State
  const winGame = useCallback((finalScore: number) => {
    if (isGameOverRef.current) return;
    isGameOverRef.current = true;
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    const newCode = generateVoucherCode();
    setVoucherCode(newCode);
    setGameState('won');
    playSound('win');

    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#005596', '#ED1C24', '#f59e0b', '#10b981'],
    });

    // Save to localStorage
    try {
      localStorage.setItem('vietinbank_flappy_high_score', '20');
      const voucherData = {
        code: newCode,
        date: new Date().toLocaleDateString('vi-VN'),
      };
      localStorage.setItem('vietinbank_flappy_latest_voucher', JSON.stringify(voucherData));
      setLastSavedVoucher(voucherData);
      setHighScore(20);
    } catch {
      // Ignore storage errors
    }

    // Call window callback if defined
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: finalScore,
        voucherCode: newCode,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString(),
      });
    }
  }, [playSound]);

  // Trigger End / Lose State
  const endGame = useCallback((finalScore: number) => {
    if (isGameOverRef.current) return;
    isGameOverRef.current = true;
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    setGameState('lost');
    playSound('hit');
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);

    // Update high score
    if (finalScore > highScore) {
      setHighScore(finalScore);
      try {
        localStorage.setItem('vietinbank_flappy_high_score', finalScore.toString());
      } catch {
        // ignore
      }
    }

    // Call window callback if defined
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString(),
      });
    }
  }, [highScore, playSound]);

  // Jump action handler
  const jump = useCallback(() => {
    if (isGameOverRef.current || gameState !== 'playing') return;
    birdRef.current.velocity = JUMP_FORCE;
    playSound('jump');
  }, [gameState, playSound]);

  // Start new game
  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset Bird
    birdRef.current = {
      x: 70,
      y: canvas.height / 2 - 20,
      velocity: 0,
      width: 38,
      height: 24,
      rotation: 0,
    };

    // Reset Pipes
    pipesRef.current = [];
    scoreRef.current = 0;
    isGameOverRef.current = false;
    setScore(0);
    setGameState('playing');
  };

  // Reset Game completely
  const resetGame = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    isGameOverRef.current = false;
    setGameState('start');
    setScore(0);
  };

  // Dynamic Encouraging Words
  const getEncouragementText = (curScore: number) => {
    if (curScore >= 20) return contentData.gameData.encouragements.win;
    if (curScore >= 15) return contentData.gameData.encouragements.under20;
    if (curScore >= 10) return contentData.gameData.encouragements.under15;
    if (curScore >= 5) return contentData.gameData.encouragements.under10;
    return contentData.gameData.encouragements.under5;
  };

  // Keyboard Space trigger & prevent page scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'playing') {
          jump();
        } else if (gameState === 'start') {
          startGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    const renderLoop = () => {
      frameCount++;
      const width = canvas.width;
      const height = canvas.height;

      // 1. CLEAR & BACKGROUND
      ctx.clearRect(0, 0, width, height);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#bae6fd');
      skyGrad.addColorStop(0.7, '#e0f2fe');
      skyGrad.addColorStop(1, '#f8fafc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant City Skyline / Cloud silhouette
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.rect(0, height - 35, width, 35);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, height - 35, width, 3);

      // 2. PIPE SPAWNING
      // Spawn pipe every 95 frames
      if (frameCount % 95 === 0 && pipesRef.current.length < 5) {
        const minPipeTop = 60;
        const maxPipeTop = height - PIPE_GAP - 90;
        const topHeight = Math.floor(minPipeTop + Math.random() * (maxPipeTop - minPipeTop));
        pipesRef.current.push({
          x: width + 20,
          topHeight,
          bottomY: topHeight + PIPE_GAP,
          width: 52,
          passed: false,
        });
      }

      // 3. PIPES UPDATE & DRAWING
      const pipes = pipesRef.current;
      for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= PIPE_SPEED;

        // Pipe Colors: Clean Bank Blue / Teal themed pillars
        const pipeGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipe.width, 0);
        pipeGrad.addColorStop(0, '#0284c7');
        pipeGrad.addColorStop(0.5, '#0ea5e9');
        pipeGrad.addColorStop(1, '#0369a1');

        ctx.fillStyle = pipeGrad;
        ctx.strokeStyle = '#075985';
        ctx.lineWidth = 2;

        // Draw Top Pipe
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);
        // Top Pipe Cap
        ctx.fillRect(pipe.x - 3, pipe.topHeight - 16, pipe.width + 6, 16);
        ctx.strokeRect(pipe.x - 3, pipe.topHeight - 16, pipe.width + 6, 16);

        // Draw Bottom Pipe
        const bottomHeight = height - pipe.bottomY;
        ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, bottomHeight);
        ctx.strokeRect(pipe.x, pipe.bottomY, pipe.width, bottomHeight);
        // Bottom Pipe Cap
        ctx.fillRect(pipe.x - 3, pipe.bottomY, pipe.width + 6, 16);
        ctx.strokeRect(pipe.x - 3, pipe.bottomY, pipe.width + 6, 16);

        // Score Check
        const bird = birdRef.current;
        if (!pipe.passed && pipe.x + pipe.width < bird.x) {
          pipe.passed = true;
          scoreRef.current += 1;
          const newScore = scoreRef.current;
          setScore(newScore);
          playSound('point');

          // Check Win Condition at exactly WIN_SCORE (20)
          if (newScore >= WIN_SCORE) {
            winGame(newScore);
            return;
          }
        }

        // Collision Check (AABB box check)
        const hitTop =
          bird.x + bird.width - 4 > pipe.x &&
          bird.x + 4 < pipe.x + pipe.width &&
          bird.y + 4 < pipe.topHeight;

        const hitBottom =
          bird.x + bird.width - 4 > pipe.x &&
          bird.x + 4 < pipe.x + pipe.width &&
          bird.y + bird.height - 4 > pipe.bottomY;

        if (hitTop || hitBottom) {
          endGame(scoreRef.current);
          return;
        }

        // Remove offscreen pipes
        if (pipe.x + pipe.width < -30) {
          pipes.splice(i, 1);
        }
      }

      // 4. BIRD (VIETINBANK FLYING CARD / MASCOT) PHYSICS & DRAWING
      const bird = birdRef.current;
      bird.velocity += GRAVITY;
      bird.y += bird.velocity;

      // Floor & Ceiling Collision
      if (bird.y + bird.height >= height - 35) {
        bird.y = height - 35 - bird.height;
        endGame(scoreRef.current);
        return;
      }
      if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
      }

      // Rotation calculation
      bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 6, (bird.velocity * 0.08)));

      ctx.save();
      ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2);
      ctx.rotate(bird.rotation);

      // Draw Flying VietinBank Banking Card
      const cardW = bird.width;
      const cardH = bird.height;

      // Card Body (Navy with Gold Chip & Red VietinBank Accent)
      ctx.fillStyle = '#005596';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 4);
      ctx.fill();
      ctx.stroke();

      // Red Stripe
      ctx.fillStyle = '#ED1C24';
      ctx.fillRect(-cardW / 2 + 2, -cardH / 2 + 4, 6, cardH - 8);

      // Gold EMV Chip
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-cardW / 2 + 11, -cardH / 2 + 7, 7, 6);

      // Wings / Trail
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.ellipse(-cardW / 2 - 2, 0, 5, 8, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [gameState, endGame, winGame, playSound]);

  return (
    <div
      id="flappy-voucher-game"
      ref={containerRef}
      className={`space-y-6 ${isShaking ? 'animate-bounce' : ''}`}
    >
      {/* Top Bar with Rules & Back */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToMenu}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Menu chính
          </button>
          <span className="text-xs text-slate-400">/</span>
          <span className="text-xs font-bold text-slate-900">{BRAND_NAME} Kiosk Game</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? 'bg-sky-50 border-sky-200 text-[#005596]'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
            title="Bật/tắt âm thanh"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-xs hidden sm:inline">{soundEnabled ? 'Bật âm' : 'Tắt âm'}</span>
          </button>

          <button
            onClick={resetGame}
            className="p-2 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Làm mới</span>
          </button>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="relative max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        {/* Game Header Bar */}
        <div className="bg-gradient-to-r from-[#003966] to-[#005596] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              {GAME_TITLE}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs font-bold">
            <div className="bg-white/10 px-2.5 py-1 rounded-md text-sky-200">
              Kỷ lục: <span className="text-amber-300">{highScore}/20</span>
            </div>
            <div className="bg-white/20 px-2.5 py-1 rounded-md text-white">
              Điểm: <span className="text-amber-300 text-sm">{score}/20</span>
            </div>
          </div>
        </div>

        {/* Dynamic Encouragement & Progress Bar */}
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-xs font-bold text-[#005596] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{getEncouragementText(score)}</span>
          </div>

          <div className="w-full sm:w-48 flex items-center gap-2">
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-amber-500 h-full rounded-full transition-all duration-200"
                style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
              ></div>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0">
              {score}/{WIN_SCORE}
            </span>
          </div>
        </div>

        {/* Interactive Canvas Viewport */}
        <div
          className="relative w-full h-[400px] sm:h-[460px] bg-sky-100 flex items-center justify-center cursor-pointer select-none"
          onClick={gameState === 'playing' ? jump : undefined}
          onTouchStart={(e) => {
            // Prevent default touch behaviors like zoom/scroll
            e.preventDefault();
            if (gameState === 'playing') jump();
          }}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={460}
            className="w-full h-full object-cover block"
          />

          {/* START OVERLAY SCREEN */}
          {gameState === 'start' && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/90 text-white flex items-center justify-center shadow-lg border border-amber-300/40">
                <Trophy className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {contentData.gameData.gameTitle}
                </h3>
                <p className="text-xs sm:text-sm text-sky-100 max-w-sm">
                  {contentData.gameData.description}
                </p>
              </div>

              <div className="bg-white/10 px-4 py-2 rounded-xl text-xs font-medium text-amber-200 border border-white/20">
                {contentData.gameData.howToPlay}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-sm rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Bắt đầu chơi</span>
              </button>
            </div>
          )}

          {/* GAME WON OVERLAY SCREEN */}
          {gameState === 'won' && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl border-2 border-emerald-300">
                <Trophy className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-amber-300">
                  {contentData.gameData.winModal.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-100 max-w-sm font-medium">
                  {contentData.gameData.winModal.message}
                </p>
              </div>

              {/* Voucher Code Display Box */}
              <div className="bg-white text-slate-900 p-4 rounded-2xl shadow-2xl border-2 border-amber-400 w-full max-w-xs space-y-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#005596]">
                  MÃ VOUCHER NHẬN QUÀ CỦA BẠN
                </span>
                <div className="text-2xl font-black font-mono tracking-widest text-red-600">
                  {voucherCode}
                </div>
                <div className="text-[11px] text-slate-500 leading-snug">
                  {contentData.gameData.winModal.guide}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyVoucherCode(voucherCode);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  {copiedVoucher ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Đã chép mã</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Sao chép mã</span>
                    </>
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame();
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại</span>
                </button>
              </div>
            </div>
          )}

          {/* GAME LOST OVERLAY SCREEN */}
          {gameState === 'lost' && (
            <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-rose-400">
                  Rất tiếc!
                </h3>
                <p className="text-sm text-slate-100 font-semibold">
                  Bạn đã vượt qua <span className="text-amber-300 font-bold">{score}/20</span> thử thách
                </p>
                <p className="text-xs text-slate-300">
                  {contentData.gameData.loseModal.encourage}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startGame();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBackToMenu();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition-all"
                >
                  <Home className="w-4 h-4" />
                  <span>Về màn hình chính</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info: saved latest voucher */}
        {lastSavedVoucher && (
          <div className="bg-amber-50/70 p-3.5 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="font-bold">Mã quà tặng gần nhất đã nhận:</span>
              <span className="font-mono font-extrabold text-red-600 bg-white px-2 py-0.5 rounded border border-amber-300">
                {lastSavedVoucher.code}
              </span>
              <span className="text-[11px] text-amber-700">({lastSavedVoucher.date})</span>
            </div>
            <button
              onClick={() => copyVoucherCode(lastSavedVoucher.code)}
              className="text-[#005596] hover:underline font-semibold"
            >
              Sao chép
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
