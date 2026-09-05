import React, { useState } from "react";
import { useModStore } from "../../context/ModStoreContext";
import { ModCategory, TargetGame } from "../../types/mod";
import {
  Sparkles,
  TrendingUp,
  Download,
  Star,
  Users,
  Code,
  Sliders,
  PlusCircle,
  FileText,
  Upload,
  CheckCircle2,
  Terminal,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
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

export function CreatorStudio() {
  const { mods, publishNewMod, openCustomizerForMod } = useModStore();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<ModCategory>("hud");
  const [targetGame, setTargetGame] = useState<TargetGame>("Garry's Mod");
  const [version, setVersion] = useState("1.0.0");
  const [size, setSize] = useState("18.4 MB");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("Cyberpunk, HUD, Tactical, Lua");
  const [selectedBannerPreset, setSelectedBannerPreset] = useState("https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80");
  const [luaCode, setLuaCode] = useState(`-- Custom TziGmodz Script Payload
hook.Add("RenderScreenspaceEffects", "CustomMod_Hook", function()
    -- Dynamic Customizer parameters injected automatically
    DrawColorModify({
        ["$pp_colour_addr"] = 0,
        ["$pp_colour_addg"] = 0,
        ["$pp_colour_addb"] = 0.05,
        ["$pp_colour_brightness"] = 0,
        ["$pp_colour_contrast"] = 1.15,
        ["$pp_colour_colour"] = 1.3,
    })
end)`);

  const bannerPresets = [
    { name: "Cyber City", url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80" },
    { name: "Neon Grid", url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80" },
    { name: "Matrix Code", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80" },
    { name: "Drift Supercar", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80" },
    { name: "Tactical Armory", url: "https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=1000&auto=format&fit=crop&q=80" },
  ];

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a mod title.");
      return;
    }

    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);

    publishNewMod({
      name,
      tagline: tagline || "A custom mod created in TziGmodz Studio.",
      category,
      targetGame,
      version,
      size,
      description: description || "Custom user creation.",
      longDescription: description,
      banner: selectedBannerPreset,
      thumbnail: selectedBannerPreset,
      tags: tagList,
      luaCode,
      author: {
        name: "You (Creator)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        badge: "Mod Creator",
      },
    });

    // Reset form
    setName("");
    setTagline("");
    setDescription("");
  };

  const totalDownloads = mods.reduce((acc, m) => acc + m.downloads, 0);
  const avgRating = (mods.reduce((acc, m) => acc + m.rating, 0) / mods.length).toFixed(2);

  return (
    <div className="space-y-8 pb-20">
      
      {/* Creator Analytics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="rounded-3xl border border-border/70 bg-card/70 p-5 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono font-bold uppercase">Total Community Reach</span>
            <Download className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3 text-2xl font-black font-mono text-foreground">
            {totalDownloads.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3" /> +14.2% this week
          </span>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card/70 p-5 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono font-bold uppercase">Average Creator Rating</span>
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-3 text-2xl font-black font-mono text-amber-400">
            ★ {avgRating} / 5.0
          </div>
          <span className="text-[11px] text-muted-foreground font-mono mt-1">
            Across 14,000+ community reviews
          </span>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card/70 p-5 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono font-bold uppercase">Active Hook Users</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-3 text-2xl font-black font-mono text-foreground">
            42,810
          </div>
          <span className="text-[11px] text-indigo-400 font-mono mt-1">
            Live in multiplayer sessions
          </span>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card/70 p-5 backdrop-blur-xl shadow-xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-mono font-bold uppercase">Creator Verification</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-lg font-bold font-mono text-emerald-400">
            TIER 3 DEVELOPER
          </div>
          <span className="text-[11px] text-muted-foreground font-mono mt-1">
            Zero-sandbox review bypass enabled
          </span>
        </div>
      </div>

      {/* Publish Form */}
      <div className="rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <PlusCircle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Publish Mod to TziGmodz App Store</h2>
            <p className="text-xs text-muted-foreground">
              Define mod metadata, target engine compatibility, and attach customizable sliders.
            </p>
          </div>
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          
          {/* Row 1: Title & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground">Mod / App Name *</Label>
              <Input
                placeholder="e.g. TziG Neon HUD Overhaul v4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary/40 text-xs"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground">Catchy Tagline</Label>
              <Input
                placeholder="e.g. Ultra-crisp dynamic radar and health matrix"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="bg-secondary/40 text-xs"
              />
            </div>
          </div>

          {/* Row 2: Category, Game Engine, Version, Size */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground">Category</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as ModCategory)}>
                <SelectTrigger className="bg-secondary/40 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl">
                  <SelectItem value="hud">HUD & Overhauls</SelectItem>
                  <SelectItem value="weapons">Weapons & Armory</SelectItem>
                  <SelectItem value="vehicles">Vehicles & Physics</SelectItem>
                  <SelectItem value="physics">Physics & Bullet Time</SelectItem>
                  <SelectItem value="shaders">RTX & Shaders</SelectItem>
                  <SelectItem value="scripts">Scripts & Hooks</SelectItem>
                  <SelectItem value="audio">Audio Packs</SelectItem>
                  <SelectItem value="tools">Sandbox Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground">Target Game</Label>
              <Select value={targetGame} onValueChange={(val) => setTargetGame(val as TargetGame)}>
                <SelectTrigger className="bg-secondary/40 text-xs">
                  <SelectValue placeholder="Engine" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl">
                  <SelectItem value="Garry's Mod">Garry's Mod</SelectItem>
                  <SelectItem value="Source Engine">Source Engine</SelectItem>
                  <SelectItem value="GTA V">GTA V</SelectItem>
                  <SelectItem value="Cyberpunk 2077">Cyberpunk 2077</SelectItem>
                  <SelectItem value="Universal Mod">Universal Mod</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground">Version</Label>
              <Input
                placeholder="1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="bg-secondary/40 text-xs font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground">Estimated Size</Label>
              <Input
                placeholder="24.5 MB"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="bg-secondary/40 text-xs font-mono"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">Description & Key Features</Label>
            <Textarea
              placeholder="Describe your mod features, customizable controls, performance stats, and recommended configs..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] bg-secondary/40 text-xs leading-relaxed"
            />
          </div>

          {/* Banner Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-cyan-400" /> Choose Cover Banner Preset
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {bannerPresets.map((preset, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedBannerPreset(preset.url)}
                  className={`relative aspect-video overflow-hidden rounded-xl border-2 transition-all ${
                    selectedBannerPreset === preset.url
                      ? "border-primary ring-2 ring-primary/40 scale-105"
                      : "border-border/60 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] font-mono text-white">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground">Tags (Comma-separated)</Label>
            <Input
              placeholder="HUD, Tactical, Cyberpunk, 4K, Lua"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-secondary/40 text-xs font-mono"
            />
          </div>

          {/* Lua Payload */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground flex items-center gap-2">
              <Code className="h-4 w-4 text-cyan-400" /> Runtime Lua / Script Hook Payload
            </Label>
            <Textarea
              value={luaCode}
              onChange={(e) => setLuaCode(e.target.value)}
              className="font-mono text-xs min-h-[120px] bg-black/80 text-cyan-300 leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t border-border/60">
            <Button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 text-sm px-6"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Publish Mod to Store
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
