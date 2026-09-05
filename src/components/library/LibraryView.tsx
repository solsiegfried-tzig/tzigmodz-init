import React, { useState } from "react";
import { useModStore } from "../../context/ModStoreContext";
import { Mod } from "../../types/mod";
import {
  Layers,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Power,
  ShieldCheck,
  Zap,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight,
  Database,
  Filter,
} from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Input } from "../ui/input";
import { toast } from "sonner";

export function LibraryView() {
  const {
    installedMods,
    activeMods,
    totalInstalledStorageBytes,
    conflictingMods,
    toggleModEnabled,
    uninstallMod,
    reorderModPriority,
    resolveConflicts,
    cleanModCache,
    updateAllMods,
    openCustomizerForMod,
    setActiveTab,
  } = useModStore();

  const [searchQuery, setSearchQuery] = useState("");

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const maxStorageBytes = 20 * 1024 * 1024 * 1024; // 20 GB
  const storagePercentage = Math.min(100, Math.round((totalInstalledStorageBytes / maxStorageBytes) * 100));

  const filteredInstalled = installedMods.filter((m) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header & Storage Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Installed count */}
        <div className="rounded-3xl border border-border/70 bg-card/70 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-muted-foreground">
              Installed Packages
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-foreground">
                {installedMods.length}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                / {activeMods.length} active in memory
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[10px] font-mono">
                ● LIVE HOOK SYNCED
              </Badge>
            </div>
          </div>
        </div>

        {/* Card 2: Modded Storage Breakdown */}
        <div className="rounded-3xl border border-border/70 bg-card/70 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-muted-foreground">
              Modded Game Storage
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <HardDrive className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black font-mono text-foreground">
                {formatBytes(totalInstalledStorageBytes)}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {storagePercentage}% of 20 GB
              </span>
            </div>
            <Progress value={storagePercentage} className="mt-2 h-2 bg-secondary" />
          </div>
        </div>

        {/* Card 3: Quick Maintenance Tools */}
        <div className="rounded-3xl border border-border/70 bg-card/70 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-muted-foreground">
              Maintenance Actions
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={cleanModCache}
              className="flex-1 text-xs font-semibold bg-secondary/40 border-border/70"
            >
              <Database className="mr-1.5 h-3.5 w-3.5 text-cyan-400" /> Clean Cache
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={updateAllMods}
              className="flex-1 text-xs font-semibold bg-secondary/40 border-border/70"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5 text-emerald-400" /> Check Updates
            </Button>
          </div>
        </div>
      </div>

      {/* Conflict Alert Banner (If Any) */}
      {conflictingMods.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/40 bg-amber-950/20 p-4 backdrop-blur-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-300">
                Potential Hook Conflict Detected ({conflictingMods.length} HUD Overhauls Active)
              </h4>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Multiple HUD mods are competing for the main screen paint hook. The higher load priority mod will take precedence.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={resolveConflicts}
            className="bg-amber-500 font-bold text-black hover:bg-amber-400 text-xs shrink-0 shadow-md"
          >
            Auto-Resolve Conflict
          </Button>
        </div>
      )}

      {/* Library Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search within installed library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 bg-card/60 border-border/70 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("store")}
            className="text-xs font-bold bg-primary/10 border-primary/40 text-primary hover:bg-primary/20"
          >
            + Browse More Mods
          </Button>
        </div>
      </div>

      {/* Installed Mods List with Priority Arranging */}
      {filteredInstalled.length > 0 ? (
        <div className="space-y-3">
          {filteredInstalled.map((mod, index) => (
            <div
              key={mod.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 backdrop-blur-md ${
                mod.enabled
                  ? "border-border/80 bg-card/75 shadow-md hover:border-primary/50"
                  : "border-border/40 bg-card/30 opacity-60"
              }`}
            >
              
              {/* Left Info */}
              <div className="flex items-center gap-4">
                
                {/* Priority order controls */}
                <div className="flex flex-col items-center justify-center gap-0.5 text-muted-foreground font-mono text-[10px]">
                  <button
                    disabled={index === 0}
                    onClick={() => reorderModPriority(index, index - 1)}
                    className="p-1 rounded hover:bg-secondary disabled:opacity-30"
                    title="Move higher in load priority"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <span className="font-bold text-xs text-foreground">{index + 1}</span>
                  <button
                    disabled={index === filteredInstalled.length - 1}
                    onClick={() => reorderModPriority(index, index + 1)}
                    className="p-1 rounded hover:bg-secondary disabled:opacity-30"
                    title="Move lower in load priority"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Mod Thumbnail */}
                <img
                  src={mod.thumbnail || mod.banner}
                  alt={mod.name}
                  className="h-14 w-20 rounded-xl object-cover ring-1 ring-border shrink-0"
                />

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-foreground">{mod.name}</h3>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase py-0">
                      {mod.category}
                    </Badge>
                    <span className="text-[11px] font-mono text-cyan-400">v{mod.version}</span>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {mod.tagline || mod.description}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                    <span>Engine: <strong className="text-foreground">{mod.targetGame}</strong></span>
                    <span>•</span>
                    <span>Size: {mod.size}</span>
                  </div>
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                
                {/* Enable / Disable Switch */}
                <div className="flex items-center gap-2 pr-2 border-r border-border/50">
                  <span className="text-xs font-mono text-muted-foreground">
                    {mod.enabled ? "Active" : "Disabled"}
                  </span>
                  <Switch
                    checked={mod.enabled}
                    onCheckedChange={() => toggleModEnabled(mod.id)}
                  />
                </div>

                {/* Customize Button */}
                <Button
                  size="sm"
                  onClick={() => openCustomizerForMod(mod)}
                  className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 text-xs font-bold"
                >
                  <Sliders className="mr-1.5 h-3.5 w-3.5" /> Customize
                </Button>

                {/* Uninstall Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => uninstallMod(mod.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Uninstall mod"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
          <Layers className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-base font-bold text-foreground">No mods installed in library</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Visit the Mod Store to discover, download, and customize mods for your games.
          </p>
          <Button
            onClick={() => setActiveTab("store")}
            className="mt-4 bg-primary text-xs font-bold text-primary-foreground"
          >
            Browse Mod Store
          </Button>
        </div>
      )}
    </div>
  );
}
