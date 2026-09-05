import React, { useState, useMemo } from "react";
import { useModStore } from "../../context/ModStoreContext";
import { ModCard } from "./ModCard";
import { ModDetailModal } from "./ModDetailModal";
import { ModCategory, TargetGame, Mod } from "../../types/mod";
import {
  Search,
  SlidersHorizontal,
  Flame,
  Sparkles,
  Layers,
  CheckCircle2,
  Filter,
  Gamepad2,
  TrendingUp,
  LayoutGrid,
  List,
  Crosshair,
  Car,
  Atom,
  Eye,
  Terminal,
  Volume2,
  Wrench,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Download,
  Sliders,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function ModStoreView() {
  const {
    mods,
    selectedCategory,
    setSelectedCategory,
    selectedGame,
    setSelectedGame,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedModForDetail,
    setSelectedModForDetail,
    openCustomizerForMod,
    installMod,
    downloadQueue,
  } = useModStore();

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [filterInstalledOnly, setFilterInstalledOnly] = useState(false);

  const categories: { id: ModCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "all", label: "All Mods", icon: Layers },
    { id: "hud", label: "HUD & Overhauls", icon: Eye },
    { id: "physics", label: "Physics & Time", icon: Atom },
    { id: "shaders", label: "RTX & Shaders", icon: Sparkles },
    { id: "weapons", label: "Weapons & Armory", icon: Crosshair },
    { id: "vehicles", label: "Vehicles & Drift", icon: Car },
    { id: "scripts", label: "Scripts & Hooks", icon: Terminal },
    { id: "audio", label: "Spatial Audio", icon: Volume2 },
    { id: "tools", label: "Modder Tools", icon: Wrench },
  ];

  const gameEngines: (TargetGame | "all")[] = [
    "all",
    "Garry's Mod",
    "Source Engine",
    "GTA V",
    "Cyberpunk 2077",
    "Universal Mod",
  ];

  const featuredMods = useMemo(() => {
    return mods.filter((m) => m.isFeatured || m.isTrending);
  }, [mods]);

  const currentHeroMod = featuredMods[featuredIndex % featuredMods.length] || mods[0];

  const filteredMods = useMemo(() => {
    return mods
      .filter((m) => {
        if (selectedCategory !== "all" && m.category !== selectedCategory) return false;
        if (selectedGame !== "all" && m.targetGame !== selectedGame) return false;
        if (filterInstalledOnly && !m.installed) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = m.name.toLowerCase().includes(q);
          const matchTagline = m.tagline.toLowerCase().includes(q);
          const matchTags = m.tags.some((t) => t.toLowerCase().includes(q));
          const matchAuthor = m.author.name.toLowerCase().includes(q);
          if (!matchName && !matchTagline && !matchTags && !matchAuthor) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popular") return b.downloads - a.downloads;
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        if (sortBy === "size") return a.fileSizeBytes - b.fileSizeBytes;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [mods, selectedCategory, selectedGame, filterInstalledOnly, searchQuery, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Featured Hero Banner */}
      {currentHeroMod && (
        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-card via-card/80 to-card/40 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <img
            src={currentHeroMod.banner}
            alt={currentHeroMod.name}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-40 mix-blend-luminosity scale-105 transition-all duration-700 hover:scale-100 hover:opacity-60"
          />

          <div className="relative z-20 max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 font-bold uppercase tracking-wider text-[11px] text-white shadow-lg shadow-cyan-500/30">
                <Sparkles className="mr-1 h-3.5 w-3.5" /> Featured Spotlight
              </Badge>
              <Badge variant="outline" className="font-mono text-xs text-cyan-400 border-cyan-500/40 bg-black/40 backdrop-blur-md">
                {currentHeroMod.targetGame}
              </Badge>
              <span className="text-xs font-mono text-muted-foreground">
                ★ {currentHeroMod.rating.toFixed(2)} ({currentHeroMod.ratingCount} reviews)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
              {currentHeroMod.name}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 line-clamp-2 leading-relaxed">
              {currentHeroMod.tagline || currentHeroMod.description}
            </p>

            {/* Hero Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {currentHeroMod.installed ? (
                <Button
                  onClick={() => openCustomizerForMod(currentHeroMod)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-500 transition-all text-sm"
                >
                  <Sliders className="mr-2 h-4 w-4" />
                  Customize App in Studio
                </Button>
              ) : (
                <Button
                  onClick={() => installMod(currentHeroMod.id)}
                  className="bg-primary font-bold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 text-sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Get Mod • Free
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => setSelectedModForDetail(currentHeroMod)}
                className="border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/70 text-sm"
              >
                View Full Specs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {/* Slide controls */}
              {featuredMods.length > 1 && (
                <div className="flex items-center gap-1.5 ml-auto">
                  {featuredMods.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setFeaturedIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        featuredIndex % featuredMods.length === i
                          ? "w-6 bg-primary"
                          : "w-2 bg-white/30 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Search, Filter & Controls Bar */}
      <div className="space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search mods, weapons, HUDs, shaders, authors, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-card/60 border-border/70 backdrop-blur-md rounded-xl text-sm focus-visible:ring-primary/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Engine & Sort Selectors */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Target Game Filter */}
            <Select value={selectedGame} onValueChange={(val) => setSelectedGame(val as TargetGame | "all")}>
              <SelectTrigger className="h-11 w-44 bg-card/60 border-border/70 text-xs font-medium rounded-xl">
                <Gamepad2 className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Game Engine" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl">
                <SelectItem value="all">All Game Engines</SelectItem>
                <SelectItem value="Garry's Mod">Garry's Mod</SelectItem>
                <SelectItem value="Source Engine">Source Engine</SelectItem>
                <SelectItem value="GTA V">GTA V</SelectItem>
                <SelectItem value="Cyberpunk 2077">Cyberpunk 2077</SelectItem>
                <SelectItem value="Universal Mod">Universal Mod</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Filter */}
            <Select value={sortBy} onValueChange={(val) => setSortBy(val as typeof sortBy)}>
              <SelectTrigger className="h-11 w-40 bg-card/60 border-border/70 text-xs font-medium rounded-xl">
                <TrendingUp className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-card/95 backdrop-blur-xl">
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="newest">Newly Added</SelectItem>
                <SelectItem value="size">Smallest Size</SelectItem>
                <SelectItem value="name">Alphabetical</SelectItem>
              </SelectContent>
            </Select>

            {/* Installed Only Toggle Pill */}
            <Button
              variant={filterInstalledOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterInstalledOnly(!filterInstalledOnly)}
              className="h-11 rounded-xl text-xs font-semibold"
            >
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              {filterInstalledOnly ? "Installed" : "All Items"}
            </Button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === "all" ? mods.length : mods.filter((m) => m.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 ring-1 ring-white/20"
                    : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/50"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono ${
                    isSelected ? "bg-black/30 text-white" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Results Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-foreground">
            Available Apps & Mods
          </h2>
          <Badge variant="secondary" className="font-mono text-xs">
            {filteredMods.length} {filteredMods.length === 1 ? "result" : "results"}
          </Badge>
        </div>

        {(searchQuery || selectedCategory !== "all" || selectedGame !== "all" || filterInstalledOnly) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedGame("all");
              setFilterInstalledOnly(false);
            }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* Mod Cards Grid */}
      {filteredMods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredMods.map((mod) => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/60 text-muted-foreground">
            <Search className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-foreground">No matching mods found</h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search terms, changing the target game engine, or switching category filters.
          </p>
          <Button
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedGame("all");
              setFilterInstalledOnly(false);
            }}
            className="mt-4 text-xs font-semibold"
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Modal for Mod Details */}
      <ModDetailModal
        mod={selectedModForDetail}
        onClose={() => setSelectedModForDetail(null)}
      />
    </div>
  );
}
