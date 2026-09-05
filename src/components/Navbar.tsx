import React, { useState } from "react";
import { useModStore, ActiveTab, ThemePalette } from "../context/ModStoreContext";
import {
  ShoppingBag,
  Sliders,
  Layers,
  Sparkles,
  Settings,
  Play,
  Volume2,
  VolumeX,
  Palette,
  Download,
  PlusCircle,
  Gamepad2,
  ShieldCheck,
  Check,
  Menu,
  X,
  Flame,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Progress } from "./ui/progress";

export function Navbar() {
  const {
    activeTab,
    setActiveTab,
    installedMods,
    selectedModForCustomizer,
    downloadQueue,
    themeColor,
    setThemeColor,
    soundEnabled,
    toggleSound,
    launchGameSimulation,
    isGameRunning,
    setPublishModalOpen,
  } = useModStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const themeOptions: { id: ThemePalette; name: string; color: string }[] = [
    { id: "cyan", name: "Cyber Neon", color: "bg-cyan-500" },
    { id: "emerald", name: "Matrix Green", color: "bg-emerald-500" },
    { id: "amber", name: "Solar Amber", color: "bg-amber-500" },
    { id: "purple", name: "Synthwave Violet", color: "bg-purple-500" },
    { id: "crimson", name: "Blood Fury", color: "bg-red-500" },
  ];

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: "store", label: "Mod Store", icon: ShoppingBag, badge: "Trending" },
    {
      id: "customizer",
      label: "Customizer Studio",
      icon: Sliders,
      badge: selectedModForCustomizer ? selectedModForCustomizer.name.split(" ")[0] : undefined,
    },
    { id: "library", label: "My Library", icon: Layers, badge: installedMods.length },
    { id: "creator", label: "Creator Studio", icon: Sparkles },
    { id: "settings", label: "Engine Config", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand & Engine status */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab("store")}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 ring-1 ring-white/20 transition-all group-hover:scale-105 group-hover:shadow-cyan-500/40">
              <Gamepad2 className="h-5 w-5 text-white animate-pulse" />
              <div className="absolute -inset-0.5 rounded-xl bg-cyan-400/20 blur-sm -z-10 group-hover:bg-cyan-400/40" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-foreground text-lg sm:text-xl">
                  TziG<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">modz</span>
                </span>
                <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider text-cyan-400 ring-1 ring-cyan-500/30">
                  STORE & STUDIO
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-medium">HOOK ACTIVE</span>
                <span className="text-muted-foreground/60">• v4.2.0-STABLE</span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Main Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/80 bg-card/60 p-1 backdrop-blur-md shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-1 ring-white/20"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono font-bold ${
                      isActive
                        ? "bg-black/30 text-primary-foreground"
                        : "bg-primary/15 text-primary border border-primary/20"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Download Queue Popover */}
          {downloadQueue.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative h-9 border-cyan-500/40 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-950/60"
                >
                  <Download className="h-4 w-4 animate-bounce" />
                  <span className="ml-1.5 text-xs font-mono">{downloadQueue.length}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 border-border bg-card/95 p-4 backdrop-blur-xl shadow-2xl" align="end">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Download className="h-4 w-4 text-cyan-400" /> Active Downloads
                  </h4>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {downloadQueue.length} items
                  </Badge>
                </div>
                <div className="space-y-3">
                  {downloadQueue.map((task) => (
                    <div key={task.modId} className="space-y-1.5 rounded-lg border border-border/60 bg-secondary/30 p-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground truncate max-w-[160px]">
                          Downloading Mod...
                        </span>
                        <span className="font-mono text-cyan-400 text-[11px]">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-1.5 bg-secondary" />
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                        <span>Speed: {task.speed}</span>
                        <span className="text-cyan-400 animate-pulse capitalize">{task.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                title="Change Color Theme"
              >
                <Palette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card/95 backdrop-blur-xl">
              <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Accent Theme
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {themeOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.id}
                  onClick={() => setThemeColor(opt.id)}
                  className="flex items-center justify-between cursor-pointer py-2 text-xs font-medium"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${opt.color}`} />
                    <span>{opt.name}</span>
                  </div>
                  {themeColor === opt.id && <Check className="h-3.5 w-3.5 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sound Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSound}
            className={`h-9 w-9 transition-colors ${
              soundEnabled ? "text-cyan-400 hover:text-cyan-300" : "text-muted-foreground"
            }`}
            title={soundEnabled ? "Audio FX Active" : "Audio FX Muted"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>

          {/* Publish Mod Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPublishModalOpen(true)}
            className="hidden sm:inline-flex h-9 border-dashed border-border/90 bg-secondary/40 text-xs font-semibold hover:border-primary hover:bg-secondary"
          >
            <PlusCircle className="mr-1.5 h-3.5 w-3.5 text-primary" />
            Publish Mod
          </Button>

          {/* Launch Game Injection Button */}
          <Button
            size="sm"
            onClick={launchGameSimulation}
            className="h-9 bg-gradient-to-r from-emerald-500 to-teal-600 font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 hover:shadow-emerald-500/40 ring-1 ring-white/20 transition-all active:scale-95"
          >
            <Play className={`mr-1.5 h-3.5 w-3.5 fill-white ${isGameRunning ? "animate-spin" : ""}`} />
            {isGameRunning ? "Game Running" : "Launch Game"}
          </Button>

          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-9 w-9 text-muted-foreground"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/95 px-4 py-3 backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-secondary/40 text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPublishModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-xs font-semibold"
            >
              <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
              Publish New Mod
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
