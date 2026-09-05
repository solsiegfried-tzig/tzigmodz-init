import React, { useState, useEffect, useRef } from "react";
import { ModCustomConfig } from "../../types/mod";
import { playSound } from "../../lib/audio-fx";
import {
  Activity,
  Crosshair as CrosshairIcon,
  Flame,
  Radio,
  Zap,
  Shield,
  Heart,
  Maximize2,
  Sparkles,
  Camera,
  Layers,
  Volume2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface LiveGameCanvasProps {
  config: ModCustomConfig;
  modName: string;
  soundEnabled: boolean;
}

export function LiveGameCanvas({ config, modName, soundEnabled }: LiveGameCanvasProps) {
  const [scene, setScene] = useState<"cyberpunk" | "source" | "battlefield" | "garage" | "matrix">("cyberpunk");
  const [isFiring, setIsFiring] = useState(false);
  const [bulletTimeActive, setBulletTimeActive] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [ammoCount, setAmmoCount] = useState(30);
  const [health, setHealth] = useState(88);
  const [shield, setShield] = useState(95);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const scenes = {
    cyberpunk: {
      name: "Neon Alley 2077",
      bg: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
    },
    source: {
      name: "Source Test Grid",
      bg: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    },
    battlefield: {
      name: "Wasteland Combat",
      bg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    },
    garage: {
      name: "Drift Underground",
      bg: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80",
    },
    matrix: {
      name: "Matrix Wireframe",
      bg: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    },
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleFire = () => {
    if (ammoCount <= 0) {
      setAmmoCount(30);
      playSound("click", soundEnabled);
      return;
    }
    setAmmoCount((prev) => prev - 1);
    setIsFiring(true);
    setShakeIntensity(config.cameraShake * 0.15);
    playSound("shoot", soundEnabled);

    if (config.hitmarkerSound) {
      setTimeout(() => playSound("beep", soundEnabled), 120);
    }

    setTimeout(() => {
      setIsFiring(false);
      setShakeIntensity(0);
    }, 120);
  };

  const toggleBulletTime = () => {
    const next = !bulletTimeActive;
    setBulletTimeActive(next);
    playSound(next ? "laser" : "toggle", soundEnabled);
  };

  const triggerSparkFx = () => {
    setShakeIntensity(config.cameraShake * 0.25);
    playSound("laser", soundEnabled);
    setTimeout(() => setShakeIntensity(0), 200);
  };

  // Render crosshair based on style
  const renderCrosshair = () => {
    const color = config.crosshairColor || config.accentColor || "#06b6d4";
    const glow = config.glowIntensity;

    const styleMap = {
      dot: (
        <div
          className="h-2.5 w-2.5 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 ${glow * 0.2}px ${color}`,
          }}
        />
      ),
      cross: (
        <div className="relative h-6 w-6">
          <div
            className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2"
            style={{ backgroundColor: color, boxShadow: `0 0 ${glow * 0.15}px ${color}` }}
          />
          <div
            className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
            style={{ backgroundColor: color, boxShadow: `0 0 ${glow * 0.15}px ${color}` }}
          />
          <div
            className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: "#ffffff" }}
          />
        </div>
      ),
      halo: (
        <div className="relative flex items-center justify-center">
          <div
            className="h-8 w-8 rounded-full border-2"
            style={{
              borderColor: color,
              boxShadow: `0 0 ${glow * 0.2}px ${color}`,
            }}
          />
          <div
            className="h-1.5 w-1.5 rounded-full absolute"
            style={{ backgroundColor: color }}
          />
        </div>
      ),
      cyber: (
        <div className="relative h-10 w-10 flex items-center justify-center">
          {/* Outer diamond brackets */}
          <div
            className="absolute inset-0 border border-dashed rounded-lg rotate-45 opacity-70"
            style={{ borderColor: color }}
          />
          <div
            className="absolute h-4 w-4 border-2 rounded-full"
            style={{ borderColor: color, boxShadow: `0 0 ${glow * 0.2}px ${color}` }}
          />
          <div className="h-1 w-1 rounded-full bg-white" />
          {/* Tick lines */}
          <div className="absolute top-0 w-0.5 h-1.5" style={{ backgroundColor: color }} />
          <div className="absolute bottom-0 w-0.5 h-1.5" style={{ backgroundColor: color }} />
          <div className="absolute left-0 h-0.5 w-1.5" style={{ backgroundColor: color }} />
          <div className="absolute right-0 h-0.5 w-1.5" style={{ backgroundColor: color }} />
        </div>
      ),
      tactical: (
        <div className="relative h-8 w-8 flex items-center justify-center">
          <div
            className="absolute inset-0 border-2 rounded-sm"
            style={{ borderColor: color, boxShadow: `0 0 ${glow * 0.15}px ${color}` }}
          />
          <div
            className="absolute h-2 w-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="absolute -top-3 text-[8px] font-mono font-bold" style={{ color }}>
            100m
          </span>
        </div>
      ),
    };

    return styleMap[config.crosshairStyle] || styleMap.cyber;
  };

  // Render radar shape
  const getRadarShapeClass = () => {
    switch (config.minimapShape) {
      case "circle":
        return "rounded-full";
      case "square":
        return "rounded-xl";
      case "radar":
        return "rounded-full border-dashed";
      case "hexagon":
      default:
        return "rounded-2xl";
    }
  };

  return (
    <div className="space-y-3">
      
      {/* Top Simulation Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/70 bg-card/60 p-2.5 backdrop-blur-md">
        
        {/* Environment scenes */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-muted-foreground uppercase font-semibold mr-1">
            Scene:
          </span>
          {(Object.keys(scenes) as (keyof typeof scenes)[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                setScene(key);
                playSound("click", soundEnabled);
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                scene === key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {scenes[key].name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Live interaction triggers */}
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleFire}
            className="h-8 text-xs font-bold border-red-500/40 bg-red-950/30 text-red-400 hover:bg-red-950/60"
          >
            <CrosshairIcon className="mr-1 h-3.5 w-3.5" /> Fire (Recoil Test)
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={toggleBulletTime}
            className={`h-8 text-xs font-bold transition-all ${
              bulletTimeActive
                ? "border-cyan-400 bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
                : "border-cyan-500/40 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-950/60"
            }`}
          >
            <Zap className="mr-1 h-3.5 w-3.5" /> Bullet Time {bulletTimeActive ? "ON" : "OFF"}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={triggerSparkFx}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
            title="Trigger particle spark"
          >
            <Sparkles className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Live Interactive Game Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onClick={handleFire}
        className="group relative aspect-[16/9] w-full overflow-hidden rounded-3xl border-2 border-border/80 bg-black shadow-2xl transition-all cursor-crosshair select-none"
        style={{
          transform: shakeIntensity > 0 ? `translate(${(Math.random() - 0.5) * shakeIntensity}px, ${(Math.random() - 0.5) * shakeIntensity}px)` : "none",
        }}
      >
        {/* Background Image */}
        <img
          src={scenes[scene].bg}
          alt="Game Scene"
          className={`h-full w-full object-cover transition-all duration-300 ${
            bulletTimeActive ? "scale-105 saturate-150 contrast-125" : "scale-100"
          }`}
          style={{
            filter: `brightness(${100 + (config.bloom - 50) * 0.4}%) contrast(${100 + (config.bloom - 50) * 0.3}%)`,
          }}
        />

        {/* Dynamic Vignette shader */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity"
          style={{
            background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${config.vignette / 100}) 100%)`,
          }}
        />

        {/* Scanlines shader */}
        {config.scanlines && (
          <div className="pointer-events-none absolute inset-0 scanlines-overlay opacity-80" />
        )}

        {/* Bullet Time Matrix Overlay */}
        {bulletTimeActive && (
          <div className="pointer-events-none absolute inset-0 bg-cyan-500/15 backdrop-blur-[1px] animate-pulse">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full border border-cyan-400/60 bg-black/70 px-4 py-1 text-xs font-mono font-bold text-cyan-300 tracking-widest backdrop-blur-md">
              BULLET-TIME ACTIVE // DILATION {(config.timeDilationFactor || 0.25).toFixed(2)}x
            </div>
          </div>
        )}

        {/* Muzzle Flash FX */}
        {isFiring && (
          <div className="pointer-events-none absolute inset-0 bg-amber-400/20 backdrop-blur-xs flex items-center justify-center">
            <div
              className="h-32 w-32 rounded-full bg-amber-300/60 blur-xl animate-ping"
              style={{
                boxShadow: `0 0 80px ${config.accentColor || "#06b6d4"}`,
              }}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* DYNAMIC HUD OVERLAYS (Controlled in Real-Time by userConfig) */}
        {/* ========================================================================= */}

        {/* Top Left: Mod & Engine Telemetry Status */}
        <div
          className="absolute top-4 left-4 flex flex-col gap-1 transition-all"
          style={{
            opacity: config.hudOpacity / 100,
            transform: `scale(${config.hudScale})`,
            transformOrigin: "top left",
          }}
        >
          <div
            className="flex items-center gap-2 rounded-xl border bg-black/60 px-3 py-1.5 backdrop-blur-md shadow-lg"
            style={{
              borderColor: `${config.accentColor}50`,
              boxShadow: `0 0 ${config.glowIntensity * 0.15}px ${config.accentColor}30`,
            }}
          >
            <div
              className="h-2 w-2 rounded-full animate-ping"
              style={{ backgroundColor: config.accentColor }}
            />
            <span className="font-mono text-[11px] font-bold text-white tracking-wider">
              {modName.toUpperCase()}
            </span>
            <Badge variant="outline" className="border-white/20 text-[10px] font-mono text-white/80 py-0">
              ACTIVE HOOK
            </Badge>
          </div>

          {config.showFpsOverlay && (
            <div className="flex items-center gap-3 px-1 text-[10px] font-mono text-white/80 drop-shadow">
              <span>FPS: <strong className="text-emerald-400">165.2</strong></span>
              <span>PING: <strong className="text-cyan-400">12ms</strong></span>
              <span>FRAME: <strong className="text-amber-400">6.04ms</strong></span>
            </div>
          )}
        </div>

        {/* Top Right: Holographic Mini-Map Radar */}
        <div
          className="absolute top-4 right-4 transition-all"
          style={{
            opacity: config.hudOpacity / 100,
            transform: `scale(${config.hudScale})`,
            transformOrigin: "top right",
          }}
        >
          <div
            className={`relative h-28 w-28 sm:h-32 sm:w-32 border-2 bg-black/75 p-2 backdrop-blur-md shadow-2xl flex items-center justify-center overflow-hidden ${getRadarShapeClass()}`}
            style={{
              borderColor: config.accentColor,
              boxShadow: `0 0 ${config.glowIntensity * 0.2}px ${config.accentColor}40`,
            }}
          >
            {/* Radar Grid Circles */}
            <div
              className="absolute inset-2 rounded-full border border-dashed opacity-40"
              style={{ borderColor: config.accentColor }}
            />
            <div
              className="absolute inset-6 rounded-full border opacity-30"
              style={{ borderColor: config.accentColor }}
            />

            {/* Radar Sweep Animation */}
            <div
              className="absolute inset-0 origin-center animate-spin"
              style={{
                animationDuration: "3s",
                background: `conic-gradient(from 0deg, transparent 0deg, transparent 270deg, ${config.accentColor}60 360deg)`,
              }}
            />

            {/* Player Center Marker */}
            <div
              className="h-2 w-2 rounded-full z-10"
              style={{ backgroundColor: "#ffffff", boxShadow: `0 0 6px #ffffff` }}
            />

            {/* Simulated Enemy & Friendly Blips */}
            <div className="absolute top-6 left-8 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="absolute bottom-8 right-6 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
            <div className="absolute top-10 right-10 h-1.5 w-1.5 rounded-full bg-cyan-400" />

            {/* North Indicator */}
            <span
              className="absolute top-1 text-[9px] font-mono font-bold"
              style={{ color: config.accentColor }}
            >
              N
            </span>
          </div>
        </div>

        {/* Center: Dynamic Crosshair Reticle (Follows mouse slightly) */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
          style={{
            left: `${mousePos.x}%`,
            top: `${mousePos.y}%`,
            transform: `translate(-50%, -50%) scale(${isFiring ? 1.4 : 1.0})`,
          }}
        >
          {renderCrosshair()}
        </div>

        {/* Bottom Left: Bio-Vitals Health & Shield Matrix */}
        <div
          className="absolute bottom-4 left-4 space-y-2 transition-all"
          style={{
            opacity: config.hudOpacity / 100,
            transform: `scale(${config.hudScale})`,
            transformOrigin: "bottom left",
          }}
        >
          <div
            className="w-56 sm:w-64 rounded-2xl border-2 bg-black/80 p-3 backdrop-blur-xl shadow-2xl"
            style={{
              borderColor: `${config.accentColor}80`,
              boxShadow: `0 0 ${config.glowIntensity * 0.2}px ${config.accentColor}30`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-white/80 mb-2">
              <span className="flex items-center gap-1" style={{ color: config.accentColor }}>
                <Activity className="h-3 w-3 animate-pulse" /> BIO-LINK MATRIX
              </span>
              <span>STATUS: OPTIMAL</span>
            </div>

            {/* Health Bar */}
            <div className="space-y-1 mb-2">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                <span className="flex items-center gap-1 text-white">
                  <Heart className="h-3 w-3 fill-red-500 text-red-500" /> VITALITY
                </span>
                <span className="text-white">{health}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${health}%`,
                    backgroundColor: config.accentColor,
                    boxShadow: `0 0 ${config.glowIntensity * 0.15}px ${config.accentColor}`,
                  }}
                />
              </div>
            </div>

            {/* Shield / Armor Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                <span className="flex items-center gap-1 text-white">
                  <Shield className="h-3 w-3 fill-blue-400 text-blue-400" /> SHIELD OVERCHARGE
                </span>
                <span className="text-white">{shield}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${shield}%`,
                    backgroundColor: config.secondaryColor || "#ec4899",
                    boxShadow: `0 0 ${config.glowIntensity * 0.15}px ${config.secondaryColor}`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Right: Weapon Ammunition & Fire Mode */}
        <div
          className="absolute bottom-4 right-4 transition-all"
          style={{
            opacity: config.hudOpacity / 100,
            transform: `scale(${config.hudScale})`,
            transformOrigin: "bottom right",
          }}
        >
          <div
            className="rounded-2xl border-2 bg-black/80 px-4 py-3 backdrop-blur-xl shadow-2xl flex items-center gap-4"
            style={{
              borderColor: `${config.accentColor}80`,
              boxShadow: `0 0 ${config.glowIntensity * 0.2}px ${config.accentColor}30`,
            }}
          >
            <div>
              <div className="text-[10px] font-mono font-bold text-white/60">
                PLASMA RIFLE MK-IV
              </div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-2xl sm:text-3xl font-black font-mono tracking-tight"
                  style={{
                    color: ammoCount <= 5 ? "#ef4444" : config.accentColor,
                    textShadow: `0 0 10px ${config.accentColor}80`,
                  }}
                >
                  {ammoCount.toString().padStart(2, "0")}
                </span>
                <span className="text-xs font-mono font-bold text-white/50">
                  / 120
                </span>
              </div>
            </div>

            <div className="border-l border-white/20 pl-3 text-right">
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-white">
                AUTO-BURST
              </span>
              <div className="mt-1 text-[9px] font-mono text-emerald-400 font-bold">
                RECOIL -{config.recoilDamping}%
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Click Hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-0.5 text-[10px] font-mono text-white/60 backdrop-blur-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          Click anywhere in viewport to test weapon recoil & sound
        </div>
      </div>
    </div>
  );
}
