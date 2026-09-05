import React, { useState } from "react";
import { useModStore } from "../../context/ModStoreContext";
import { LiveGameCanvas } from "./LiveGameCanvas";
import { CodeEditorModal } from "./CodeEditorModal";
import { ModCustomConfig, ModPresetConfig, Mod } from "../../types/mod";
import {
  Sliders,
  Palette,
  Atom,
  Volume2,
  Keyboard,
  Code,
  Save,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
  Check,
  Plus,
  Trash2,
  Layers,
  Flame,
  Tv,
  Eye,
  Crosshair,
  Shield,
  Zap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { toast } from "sonner";

export function CustomizerStudio() {
  const {
    mods,
    installedMods,
    selectedModForCustomizer,
    setSelectedModForCustomizer,
    updateModConfig,
    resetModConfig,
    applyPreset,
    saveNewPreset,
    deletePreset,
    applyToLiveGame,
    exportConfigAsJson,
    importConfigFromJson,
    soundEnabled,
  } = useModStore();

  const [activeTab, setActiveTab] = useState<"visuals" | "physics" | "audio" | "keybinds" | "script">("visuals");
  const [savePresetModalOpen, setSavePresetModalOpen] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [newPresetDesc, setNewPresetDesc] = useState("");
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [codeMode, setCodeMode] = useState<"lua" | "json">("lua");

  // If no mod is selected, choose first installed or first available
  const currentMod = selectedModForCustomizer || installedMods[0] || mods[0];
  const config = currentMod?.userConfig || mods[0].defaultConfig;

  if (!currentMod) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground">No mod selected for customization.</p>
      </div>
    );
  }

  const handleUpdate = (partial: Partial<ModCustomConfig>) => {
    updateModConfig(currentMod.id, partial);
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPresetName.trim()) {
      toast.error("Please provide a preset name.");
      return;
    }
    saveNewPreset(currentMod.id, newPresetName, newPresetDesc || "Custom user tuned preset.");
    setNewPresetName("");
    setNewPresetDesc("");
    setSavePresetModalOpen(false);
  };

  const colorPalettes = [
    { name: "Cyan Cyber", hex: "#06b6d4" },
    { name: "Neon Pink", hex: "#ec4899" },
    { name: "Matrix Emerald", hex: "#10b981" },
    { name: "Solar Amber", hex: "#f59e0b" },
    { name: "Electric Purple", hex: "#a855f7" },
    { name: "Blood Crimson", hex: "#ef4444" },
    { name: "Ice White", hex: "#ffffff" },
  ];

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header Bar & Mod Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-3xl border border-border/70 bg-card/70 p-4 sm:p-6 backdrop-blur-xl shadow-xl">
        
        {/* Left: Mod title & Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
            <Sliders className="h-6 w-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                Live App Customizer Studio
              </span>
              <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/40">
                HOT-RELOAD ON
              </Badge>
            </div>
            
            {/* Mod Selector Dropdown */}
            <div className="mt-1 flex items-center gap-2">
              <Select
                value={currentMod.id}
                onValueChange={(id) => {
                  const m = mods.find((x) => x.id === id);
                  if (m) setSelectedModForCustomizer(m);
                }}
              >
                <SelectTrigger className="h-9 w-64 sm:w-80 bg-secondary/50 border-border/80 font-bold text-sm rounded-xl">
                  <SelectValue placeholder="Select Mod to Customize" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl">
                  {mods.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-xs font-medium">
                      {m.name} {m.installed ? "(Installed)" : "(Store Item)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSavePresetModalOpen(true)}
            className="h-9 text-xs font-semibold bg-secondary/40 border-border/70 hover:bg-secondary"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5 text-cyan-400" /> Save Preset
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => exportConfigAsJson(currentMod.id)}
            className="h-9 text-xs font-semibold bg-secondary/40 border-border/70 hover:bg-secondary"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export Config
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => resetModConfig(currentMod.id)}
            className="h-9 text-xs font-semibold border-border/70 text-muted-foreground hover:text-foreground"
            title="Reset configuration to default"
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>

          <Button
            size="sm"
            onClick={() => applyToLiveGame(currentMod.id)}
            className="h-9 bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 text-xs"
          >
            <Zap className="mr-1.5 h-3.5 w-3.5 fill-white" /> Apply to Game
          </Button>
        </div>
      </div>

      {/* Preset Quick-Bar */}
      {currentMod.presets && currentMod.presets.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-border/60 bg-card/40 p-3 backdrop-blur-md">
          <span className="text-[11px] font-mono text-muted-foreground uppercase font-bold mr-1 shrink-0 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Presets:
          </span>
          {currentMod.presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(currentMod.id, preset.id)}
              className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-primary/60 hover:bg-secondary hover:shadow-md"
            >
              <span>{preset.name}</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                — {preset.description.split(".")[0]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Two-Column Layout: Controls (Left) + Live Canvas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Tuner Controls (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-border/70 bg-card/70 backdrop-blur-xl shadow-xl p-5 space-y-5">
          
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-4 bg-secondary/50 p-1">
              <TabsTrigger value="visuals" className="text-xs font-bold flex items-center gap-1">
                <Palette className="h-3.5 w-3.5" /> Visuals
              </TabsTrigger>
              <TabsTrigger value="physics" className="text-xs font-bold flex items-center gap-1">
                <Atom className="h-3.5 w-3.5" /> Physics
              </TabsTrigger>
              <TabsTrigger value="audio" className="text-xs font-bold flex items-center gap-1">
                <Volume2 className="h-3.5 w-3.5" /> Audio
              </TabsTrigger>
              <TabsTrigger value="script" className="text-xs font-bold flex items-center gap-1">
                <Code className="h-3.5 w-3.5" /> Script
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Visuals & HUD */}
            <TabsContent value="visuals" className="mt-5 space-y-5">
              
              {/* Primary & Secondary Color Matrix */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Primary Hologram Color</span>
                  <span className="font-mono text-cyan-400">{config.accentColor}</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {colorPalettes.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => handleUpdate({ accentColor: c.hex })}
                      className={`h-7 w-7 rounded-lg border-2 transition-transform hover:scale-110 ${
                        config.accentColor === c.hex ? "border-white ring-2 ring-primary/40 scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => handleUpdate({ accentColor: e.target.value })}
                    className="h-7 w-7 cursor-pointer rounded-lg border border-border bg-transparent"
                    title="Custom Hex Picker"
                  />
                </div>
              </div>

              {/* Secondary Accent */}
              <div className="space-y-3">
                <Label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Secondary Shield Accent</span>
                  <span className="font-mono text-pink-400">{config.secondaryColor}</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {colorPalettes.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => handleUpdate({ secondaryColor: c.hex })}
                      className={`h-7 w-7 rounded-lg border-2 transition-transform hover:scale-110 ${
                        config.secondaryColor === c.hex ? "border-white ring-2 ring-pink-500/40 scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Sliders: Scale & Opacity */}
              <div className="space-y-4 pt-2 border-t border-border/50">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">HUD Scale</span>
                    <span className="font-mono text-muted-foreground">{config.hudScale.toFixed(2)}x</span>
                  </div>
                  <Slider
                    value={[config.hudScale]}
                    min={0.6}
                    max={1.6}
                    step={0.05}
                    onValueChange={([val]) => handleUpdate({ hudScale: val })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">HUD Transparency Opacity</span>
                    <span className="font-mono text-muted-foreground">{config.hudOpacity}%</span>
                  </div>
                  <Slider
                    value={[config.hudOpacity]}
                    min={20}
                    max={100}
                    step={5}
                    onValueChange={([val]) => handleUpdate({ hudOpacity: val })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">Neon Glow Bloom Intensity</span>
                    <span className="font-mono text-cyan-400 font-bold">{config.glowIntensity}%</span>
                  </div>
                  <Slider
                    value={[config.glowIntensity]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={([val]) => handleUpdate({ glowIntensity: val })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">Vignette Darkness Factor</span>
                    <span className="font-mono text-muted-foreground">{config.vignette}%</span>
                  </div>
                  <Slider
                    value={[config.vignette]}
                    min={0}
                    max={90}
                    step={5}
                    onValueChange={([val]) => handleUpdate({ vignette: val })}
                  />
                </div>
              </div>

              {/* Crosshair Selector */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <Label className="text-xs font-bold text-foreground">
                  Crosshair Reticle Model
                </Label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(["dot", "cross", "halo", "cyber", "tactical"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => handleUpdate({ crosshairStyle: style })}
                      className={`rounded-xl border p-2 text-center transition-all ${
                        config.crosshairStyle === style
                          ? "border-primary bg-primary/20 text-primary font-bold shadow-sm"
                          : "border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <span className="text-[11px] capitalize">{style}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimap Shape Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-foreground">
                  Radar Minimap Frame Shape
                </Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(["hexagon", "circle", "square", "radar"] as const).map((shape) => (
                    <button
                      key={shape}
                      onClick={() => handleUpdate({ minimapShape: shape })}
                      className={`rounded-xl border p-2 text-center transition-all ${
                        config.minimapShape === shape
                          ? "border-cyan-500 bg-cyan-500/20 text-cyan-400 font-bold shadow-sm"
                          : "border-border/60 bg-secondary/30 text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      <span className="text-[11px] capitalize">{shape}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-semibold text-foreground">CRT Holographic Scanlines</Label>
                    <p className="text-[10px] text-muted-foreground">Simulate retro-futuristic CRT monitor rasterization</p>
                  </div>
                  <Switch
                    checked={config.scanlines}
                    onCheckedChange={(checked) => handleUpdate({ scanlines: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-semibold text-foreground">Telemetry & FPS Overlay</Label>
                    <p className="text-[10px] text-muted-foreground">Show real-time ping, frame time, and FPS</p>
                  </div>
                  <Switch
                    checked={config.showFpsOverlay}
                    onCheckedChange={(checked) => handleUpdate({ showFpsOverlay: checked })}
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: Physics & Gameplay */}
            <TabsContent value="physics" className="mt-5 space-y-5">
              <div className="space-y-4">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">Bullet Time Dilation Scale</span>
                    <span className="font-mono text-cyan-400 font-bold">{(config.timeDilationFactor || 1.0).toFixed(2)}x Speed</span>
                  </div>
                  <Slider
                    value={[config.timeDilationFactor]}
                    min={0.1}
                    max={2.0}
                    step={0.05}
                    onValueChange={([val]) => handleUpdate({ timeDilationFactor: val })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">Recoil Compensation & Damping</span>
                    <span className="font-mono text-emerald-400 font-bold">{config.recoilDamping}%</span>
                  </div>
                  <Slider
                    value={[config.recoilDamping]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={([val]) => handleUpdate({ recoilDamping: val })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">Ragdoll Momentum & Gravity</span>
                    <span className="font-mono text-indigo-400 font-bold">{(config.ragdollGravity || 1.0).toFixed(2)}G</span>
                  </div>
                  <Slider
                    value={[config.ragdollGravity]}
                    min={0.2}
                    max={2.5}
                    step={0.1}
                    onValueChange={([val]) => handleUpdate({ ragdollGravity: val })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">Weapon Camera Shake Factor</span>
                    <span className="font-mono text-amber-400 font-bold">{config.cameraShake}%</span>
                  </div>
                  <Slider
                    value={[config.cameraShake]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={([val]) => handleUpdate({ cameraShake: val })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">Dynamic Camera FOV</span>
                    <span className="font-mono text-muted-foreground">{config.fovSlider}°</span>
                  </div>
                  <Slider
                    value={[config.fovSlider || 90]}
                    min={70}
                    max={120}
                    step={1}
                    onValueChange={([val]) => handleUpdate({ fovSlider: val })}
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: Audio & Sound */}
            <TabsContent value="audio" className="mt-5 space-y-5">
              <div className="space-y-4">
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">Master Mod Sound Volume</span>
                    <span className="font-mono text-cyan-400 font-bold">{config.masterVolume}%</span>
                  </div>
                  <Slider
                    value={[config.masterVolume]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={([val]) => handleUpdate({ masterVolume: val })}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-foreground">Sub-Bass Boost Level</span>
                    <span className="font-mono text-purple-400 font-bold">{config.bassBoost}%</span>
                  </div>
                  <Slider
                    value={[config.bassBoost]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={([val]) => handleUpdate({ bassBoost: val })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-foreground">
                    Soundpack Theme
                  </Label>
                  <Select
                    value={config.sfxTheme}
                    onValueChange={(val) => handleUpdate({ sfxTheme: val as typeof config.sfxTheme })}
                  >
                    <SelectTrigger className="h-9 text-xs bg-secondary/50 rounded-xl">
                      <SelectValue placeholder="Select SFX theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-card/95 backdrop-blur-xl">
                      <SelectItem value="cybernetic">Cybernetic High-Tech</SelectItem>
                      <SelectItem value="mechanical">Mechanical Tactical</SelectItem>
                      <SelectItem value="cinematic">Cinematic Blockbuster</SelectItem>
                      <SelectItem value="arcade">Retro 8-Bit Arcade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-semibold text-foreground">Tactical Hitmarker Clicks</Label>
                      <p className="text-[10px] text-muted-foreground">Play snappy confirmation audio on bullet hits</p>
                    </div>
                    <Switch
                      checked={config.hitmarkerSound}
                      onCheckedChange={(checked) => handleUpdate({ hitmarkerSound: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-xs font-semibold text-foreground">Binaural 3D Spatial Audio</Label>
                      <p className="text-[10px] text-muted-foreground">Enable HRTF distance occlusion filter</p>
                    </div>
                    <Switch
                      checked={config.spatialAudio}
                      onCheckedChange={(checked) => handleUpdate({ spatialAudio: checked })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: Script & Bytecode */}
            <TabsContent value="script" className="mt-5 space-y-4">
              <div className="rounded-2xl border border-border/60 bg-secondary/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Code className="h-4 w-4 text-cyan-400" /> Lua Runtime Hook Code
                  </h4>
                  <Badge variant="outline" className="font-mono text-[10px] text-emerald-400 border-emerald-500/40">
                    GMOD HOOK COMPLIANT
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground">
                  Inspect or write live Lua bytecode hooks that execute inside the sandbox engine with zero reload overhead.
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setCodeMode("lua");
                      setCodeModalOpen(true);
                    }}
                    className="flex-1 bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-950/90 text-xs font-semibold"
                  >
                    <Code className="mr-1.5 h-3.5 w-3.5" /> Edit Lua Hook Code
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => {
                      setCodeMode("json");
                      setCodeModalOpen(true);
                    }}
                    className="flex-1 bg-secondary/60 border border-border/60 text-xs font-semibold"
                  >
                    View JSON Schema
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Live Interactive Game Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <LiveGameCanvas
            config={config}
            modName={currentMod.name}
            soundEnabled={soundEnabled}
          />
        </div>
      </div>

      {/* Save Preset Dialog */}
      <Dialog open={savePresetModalOpen} onOpenChange={setSavePresetModalOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-2xl border-border/80 p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Save Customizer Preset</DialogTitle>
            <DialogDescription className="text-xs">
              Save your current color palette, physics, and HUD tuning as a reusable preset for {currentMod.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePreset} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Preset Name</Label>
              <Input
                placeholder="e.g. Ultra Cyber Overdrive"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Description</Label>
              <Input
                placeholder="e.g. High glow cyan HUD with low recoil"
                value={newPresetDesc}
                onChange={(e) => setNewPresetDesc(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSavePresetModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-primary text-xs font-bold text-primary-foreground">
                Save Preset
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Code Editor Modal */}
      <CodeEditorModal
        open={codeModalOpen}
        onClose={() => setCodeModalOpen(false)}
        code={codeMode === "lua" ? config.customScriptString || "" : config.configJsonString || ""}
        onSave={(newCode) => {
          if (codeMode === "lua") {
            handleUpdate({ customScriptString: newCode });
          } else {
            handleUpdate({ configJsonString: newCode });
          }
        }}
        modName={currentMod.name}
        language={codeMode}
      />
    </div>
  );
}
