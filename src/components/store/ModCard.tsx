import React from "react";
import { Mod } from "../../types/mod";
import { useModStore } from "../../context/ModStoreContext";
import {
  Download,
  Sliders,
  Check,
  Star,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  Flame,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ModCardProps {
  mod: Mod;
}

export function ModCard({ mod }: ModCardProps) {
  const {
    installMod,
    downloadQueue,
    setSelectedModForDetail,
    openCustomizerForMod,
  } = useModStore();

  const isDownloading = downloadQueue.some((t) => t.modId === mod.id);
  const currentTask = downloadQueue.find((t) => t.modId === mod.id);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "hud":
        return "border-cyan-500/40 text-cyan-400 bg-cyan-950/40";
      case "physics":
        return "border-indigo-500/40 text-indigo-400 bg-indigo-950/40";
      case "shaders":
        return "border-amber-500/40 text-amber-400 bg-amber-950/40";
      case "weapons":
        return "border-red-500/40 text-red-400 bg-red-950/40";
      case "vehicles":
        return "border-emerald-500/40 text-emerald-400 bg-emerald-950/40";
      case "scripts":
        return "border-purple-500/40 text-purple-400 bg-purple-950/40";
      default:
        return "border-border text-muted-foreground bg-secondary/40";
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
      
      {/* Top Media / Thumbnail */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/40">
        <img
          src={mod.banner || mod.thumbnail}
          alt={mod.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className={`text-[10px] uppercase font-bold tracking-wider backdrop-blur-md ${getCategoryColor(
              mod.category
            )}`}
          >
            {mod.category}
          </Badge>

          {mod.isFeatured && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-bold text-white shadow-md">
              <Sparkles className="mr-1 h-3 w-3" /> Featured
            </Badge>
          )}

          {mod.isTrending && (
            <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-[10px] font-bold text-white shadow-md">
              <Flame className="mr-1 h-3 w-3" /> Trending
            </Badge>
          )}
        </div>

        {/* Top Right: Game Engine */}
        <div className="absolute top-2.5 right-2.5">
          <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-mono font-medium text-white/90 backdrop-blur-md ring-1 ring-white/10">
            {mod.targetGame}
          </span>
        </div>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/30 backdrop-blur-xs">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setSelectedModForDetail(mod)}
            className="shadow-xl ring-1 ring-white/30 text-xs font-semibold backdrop-blur-md"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            Quick View & Specs
          </Button>
        </div>

        {/* Bottom meta strip on image */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-white/80 font-mono">
          <span className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
            v{mod.version}
          </span>
          <span className="bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
            {mod.size}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          {/* Author */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={mod.author.avatar}
              alt={mod.author.name}
              className="h-5 w-5 rounded-full object-cover ring-1 ring-primary/40"
            />
            <span className="text-xs font-medium text-muted-foreground truncate">
              {mod.author.name}
            </span>
            {mod.author.verified && (
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400 shrink-0" title="Verified Creator" />
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedModForDetail(mod)}
            className="cursor-pointer text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1"
          >
            {mod.name}
          </h3>

          {/* Tagline */}
          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {mod.tagline || mod.description}
          </p>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-1">
            {mod.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary/60 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Ratings & Downloads stats */}
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1 font-semibold text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
            <span>{mod.rating.toFixed(1)}</span>
            <span className="text-[10px] text-muted-foreground font-normal">
              ({mod.ratingCount})
            </span>
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px]">
            <Download className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{(mod.downloads / 1000).toFixed(1)}k</span>
          </div>
        </div>

        {/* Actions bar */}
        <div className="mt-4 flex items-center gap-2">
          {mod.installed ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openCustomizerForMod(mod)}
                className="flex-1 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 text-xs font-bold"
              >
                <Sliders className="mr-1.5 h-3.5 w-3.5" />
                Customize App
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedModForDetail(mod)}
                className="px-2.5 text-muted-foreground hover:text-foreground"
                title="View details"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : isDownloading ? (
            <Button
              disabled
              size="sm"
              className="w-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-semibold"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 animate-bounce" />
              Installing... {currentTask?.progress || 0}%
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => installMod(mod.id)}
              className="w-full bg-primary font-bold text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90 text-xs transition-all"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              {mod.price > 0 ? `$${mod.price} • Install` : "Free • Get Mod"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
