import React, { useState } from "react";
import { useModStore } from "../../context/ModStoreContext";
import { ModCategory, TargetGame } from "../../types/mod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Sparkles, PlusCircle, Upload, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export function PublishModModal() {
  const { publishModalOpen, setPublishModalOpen, publishNewMod } = useModStore();

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<ModCategory>("hud");
  const [targetGame, setTargetGame] = useState<TargetGame>("Garry's Mod");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("Custom, Mod, TziGmodz");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a mod name.");
      return;
    }

    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);

    publishNewMod({
      name,
      tagline: tagline || "Custom mod created with TziGmodz Studio.",
      category,
      targetGame,
      version: "1.0.0",
      size: "14.2 MB",
      description: description || "Custom community mod creation.",
      longDescription: description,
      tags: tagList,
      banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80",
    });

    setName("");
    setTagline("");
    setDescription("");
    setPublishModalOpen(false);
  };

  return (
    <Dialog open={publishModalOpen} onOpenChange={setPublishModalOpen}>
      <DialogContent className="max-w-lg border-border/80 bg-card/95 backdrop-blur-2xl p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">
                Publish Mod to App Store
              </DialogTitle>
              <DialogDescription className="text-xs">
                Upload and distribute your custom mod to the community catalog
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Mod / App Name *</Label>
            <Input
              placeholder="e.g. Apex Drift Physics Suite"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-xs bg-secondary/40"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Tagline</Label>
            <Input
              placeholder="e.g. Realistic tire physics and turbo anti-lag"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="text-xs bg-secondary/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ModCategory)}>
                <SelectTrigger className="text-xs bg-secondary/40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl">
                  <SelectItem value="hud">HUD & Overhauls</SelectItem>
                  <SelectItem value="weapons">Weapons & Armory</SelectItem>
                  <SelectItem value="vehicles">Vehicles & Physics</SelectItem>
                  <SelectItem value="physics">Physics & Time</SelectItem>
                  <SelectItem value="shaders">RTX & Shaders</SelectItem>
                  <SelectItem value="scripts">Scripts & Hooks</SelectItem>
                  <SelectItem value="audio">Audio Packs</SelectItem>
                  <SelectItem value="tools">Sandbox Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Target Game</Label>
              <Select value={targetGame} onValueChange={(v) => setTargetGame(v as TargetGame)}>
                <SelectTrigger className="text-xs bg-secondary/40">
                  <SelectValue placeholder="Game" />
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
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Description</Label>
            <Textarea
              placeholder="Features, hotkeys, and installation notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-xs min-h-[70px] bg-secondary/40"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Tags (Comma-separated)</Label>
            <Input
              placeholder="Physics, Drift, Speed, Lua"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="text-xs bg-secondary/40 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPublishModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-xs font-bold text-primary-foreground shadow-md"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Publish Now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
