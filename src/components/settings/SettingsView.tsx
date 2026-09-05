import React, { useState } from "react";
import { useModStore, ThemePalette } from "../../context/ModStoreContext";
import {
  Settings,
  FolderOpen,
  Shield,
  Cpu,
  Monitor,
  Volume2,
  VolumeX,
  Palette,
  Check,
  Save,
  RotateCcw,
  HardDrive,
  Flame,
  Zap,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

export function SettingsView() {
  const {
    themeColor,
    setThemeColor,
    soundEnabled,
    toggleSound,
    cleanModCache,
  } = useModStore();

  const [gameDir, setGameDir] = useState("C:\\Program Files (x86)\\Steam\\steamapps\\common\\GarrysMod");
  const [injectionMethod, setInjectionMethod] = useState("direct_hook");
  const [autoUpdateMods, setAutoUpdateMods] = useState(true);
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [antiCheatSafeMode, setAntiCheatSafeMode] = useState(true);
  const [maxFpsCap, setMaxFpsCap] = useState("240");

  const handleSave = () => {
    toast.success("Engine configuration saved!");
  };

  const themes: { id: ThemePalette; name: string; color: string }[] = [
    { id: "cyan", name: "Cyber Neon", color: "bg-cyan-500" },
    { id: "emerald", name: "Matrix Green", color: "bg-emerald-500" },
    { id: "amber", name: "Solar Amber", color: "bg-amber-500" },
    { id: "purple", name: "Synthwave Violet", color: "bg-purple-500" },
    { id: "crimson", name: "Blood Fury", color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3 rounded-3xl border border-border/70 bg-card/70 p-6 backdrop-blur-xl shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">TziGmodz Core Engine Settings</h2>
          <p className="text-xs text-muted-foreground">
            Manage injection pipelines, sandbox directories, shader acceleration, and visual theme.
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        
        {/* Section 1: Game Directory & Injection */}
        <div className="rounded-3xl border border-border/70 bg-card/70 p-6 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-cyan-400" /> Game Directory & Engine Target
          </h3>

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground">Sandbox Executable Path</Label>
            <div className="flex gap-2">
              <Input
                value={gameDir}
                onChange={(e) => setGameDir(e.target.value)}
                className="bg-secondary/40 text-xs font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Directory verified: Garry's Mod v2026.4 found.")}
                className="text-xs font-semibold shrink-0"
              >
                Browse...
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">Injection Hook Method</Label>
              <Select value={injectionMethod} onValueChange={setInjectionMethod}>
                <SelectTrigger className="bg-secondary/40 text-xs font-mono">
                  <SelectValue placeholder="Injection Method" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl">
                  <SelectItem value="direct_hook">Direct Hook (Zero-Latency Ring 3)</SelectItem>
                  <SelectItem value="lua_loader">Source Lua Auto-Loader</SelectItem>
                  <SelectItem value="vulkan_layer">DirectX 12 / Vulkan Layer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-foreground">Render Engine Max FPS</Label>
              <Select value={maxFpsCap} onValueChange={setMaxFpsCap}>
                <SelectTrigger className="bg-secondary/40 text-xs font-mono">
                  <SelectValue placeholder="Max FPS" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl">
                  <SelectItem value="144">144 FPS</SelectItem>
                  <SelectItem value="165">165 FPS (Default)</SelectItem>
                  <SelectItem value="240">240 FPS (Esports)</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Section 2: Security & Anti-Cheat */}
        <div className="rounded-3xl border border-border/70 bg-card/70 p-6 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-400" /> Security & Multiplayer Protection
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground">VAC / Anti-Cheat Safe Mode</Label>
                <p className="text-[10px] text-muted-foreground">Only inject client-side HUDs and graphics shaders during multiplayer</p>
              </div>
              <Switch
                checked={antiCheatSafeMode}
                onCheckedChange={setAntiCheatSafeMode}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground">Auto-Update Subscribed Mods</Label>
                <p className="text-[10px] text-muted-foreground">Automatically download patch releases in the background</p>
              </div>
              <Switch
                checked={autoUpdateMods}
                onCheckedChange={setAutoUpdateMods}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground">Hardware GPU Acceleration</Label>
                <p className="text-[10px] text-muted-foreground">Use Vulkan/DirectX compute shaders for live customizer previews</p>
              </div>
              <Switch
                checked={hardwareAcceleration}
                onCheckedChange={setHardwareAcceleration}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Visual Appearance & Theme */}
        <div className="rounded-3xl border border-border/70 bg-card/70 p-6 backdrop-blur-xl space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Palette className="h-4 w-4 text-purple-400" /> Interface & Audio Customization
          </h3>

          <div className="space-y-3">
            <Label className="text-xs font-semibold text-foreground">Accent Color Theme</Label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeColor(t.id)}
                  className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-bold transition-all ${
                    themeColor === t.id
                      ? "border-primary bg-primary/20 text-primary shadow-md ring-1 ring-primary/40"
                      : "border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <div className={`h-3.5 w-3.5 rounded-full ${t.color}`} />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground">High-Tech Audio SFX</Label>
                <p className="text-[10px] text-muted-foreground">Tactile feedback sounds on buttons, downloads, and customizer sliders</p>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={toggleSound}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={cleanModCache}
            className="text-xs font-semibold border-destructive/40 text-destructive hover:bg-destructive/10"
          >
            Clear Temp Cache & Rebuild Shader DB
          </Button>

          <Button
            onClick={handleSave}
            className="bg-primary text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20"
          >
            <Save className="mr-1.5 h-3.5 w-3.5" /> Save Engine Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
