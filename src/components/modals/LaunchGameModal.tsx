import React, { useState, useEffect } from "react";
import { useModStore } from "../../context/ModStoreContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Gamepad2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Terminal,
  RotateCcw,
  Square,
  Play,
  Layers,
  Sparkles,
} from "lucide-react";

export function LaunchGameModal() {
  const {
    launchModalOpen,
    setLaunchModalOpen,
    isGameRunning,
    stopGameSimulation,
    activeMods,
    applyToLiveGame,
  } = useModStore();

  const [step, setStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (launchModalOpen) {
      setStep(1);
      setLogs([
        "[0.00s] Initializing TziGmodz Ring-3 Injection Engine v4.2.0...",
        "[0.24s] Locating target process: gmod.exe (PID: 8492)... FOUND",
        "[0.48s] Verifying anti-cheat bypass layer: VAC SAFE (Bypass OK)",
      ]);

      const t1 = setTimeout(() => {
        setStep(2);
        setLogs((prev) => [
          ...prev,
          `[0.85s] Binding ${activeMods.length} active mod hooks into memory table...`,
          ...activeMods.map((m) => `  -> Hooked: [${m.category.toUpperCase()}] ${m.name} (v${m.version})`),
        ]);
      }, 700);

      const t2 = setTimeout(() => {
        setStep(3);
        setLogs((prev) => [
          ...prev,
          "[1.32s] Compiling DirectX 12 / Vulkan post-processing shaders...",
          "[1.65s] Live Customizer HUD & Physics parameters synced successfully.",
          "[1.80s] >>> GAME HOOK ACTIVE // 165 FPS TELEMETRY ONLINE <<<",
        ]);
      }, 1500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [launchModalOpen, activeMods]);

  if (!launchModalOpen) return null;

  return (
    <Dialog open={launchModalOpen} onOpenChange={setLaunchModalOpen}>
      <DialogContent className="max-w-2xl border-border/80 bg-card/95 backdrop-blur-2xl p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Gamepad2 className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  TziGmodz Live Game Injection Engine
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Hooking active mods & customizer configurations directly into game runtime
                </DialogDescription>
              </div>
            </div>

            <Badge
              variant="outline"
              className={`font-mono text-xs ${
                step >= 3
                  ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-400"
                  : "border-cyan-500/50 bg-cyan-950/40 text-cyan-400 animate-pulse"
              }`}
            >
              {step >= 3 ? "● RUNNING (HOOK ACTIVE)" : "INJECTING..."}
            </Badge>
          </div>
        </DialogHeader>

        {/* Progress status */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-muted-foreground">Injection Pipeline Progress:</span>
            <span className="text-emerald-400 font-bold">{step >= 3 ? "100%" : step === 2 ? "65%" : "30%"}</span>
          </div>
          <Progress value={step >= 3 ? 100 : step === 2 ? 65 : 30} className="h-2 bg-secondary" />
        </div>

        {/* Console logs */}
        <div className="mt-4 rounded-xl border border-border/70 bg-black/85 p-4 font-mono text-xs text-cyan-300 space-y-1 max-h-56 overflow-y-auto shadow-inner leading-relaxed">
          {logs.map((log, i) => (
            <div
              key={i}
              className={
                log.includes(">>>")
                  ? "text-emerald-400 font-bold"
                  : log.includes("->")
                  ? "text-indigo-300 pl-2"
                  : "text-cyan-300"
              }
            >
              {log}
            </div>
          ))}
        </div>

        {/* Active Mods Summary */}
        <div className="mt-4 rounded-xl border border-border/60 bg-secondary/20 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold text-foreground">
              {activeMods.length} Active Mods Loaded in Memory
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => applyToLiveGame()}
            className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40"
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Re-Sync Presets
          </Button>
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            onClick={stopGameSimulation}
            className="border-destructive/40 text-destructive hover:bg-destructive/10 text-xs"
          >
            <Square className="mr-1.5 h-3.5 w-3.5" /> Detach Game Process
          </Button>

          <Button
            size="sm"
            onClick={() => setLaunchModalOpen(false)}
            className="bg-primary text-xs font-bold text-primary-foreground shadow-md"
          >
            Minimize & Return to App Store
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
