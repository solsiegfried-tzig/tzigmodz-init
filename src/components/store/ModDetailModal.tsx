import React, { useState } from "react";
import { Mod } from "../../types/mod";
import { useModStore } from "../../context/ModStoreContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import {
  Star,
  Download,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  MessageSquare,
  ThumbsUp,
  Share2,
  ExternalLink,
  Code,
  Sparkles,
  Layers,
  Flame,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface ModDetailModalProps {
  mod: Mod | null;
  onClose: () => void;
}

export function ModDetailModal({ mod, onClose }: ModDetailModalProps) {
  const {
    installMod,
    uninstallMod,
    downloadQueue,
    openCustomizerForMod,
    addReview,
    voteReviewHelpful,
  } = useModStore();

  const [activeImage, setActiveImage] = useState<string>("");
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  if (!mod) return null;

  const currentImage = activeImage || mod.banner || mod.thumbnail;
  const isDownloading = downloadQueue.some((t) => t.modId === mod.id);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Please enter a review comment.");
      return;
    }
    addReview(mod.id, newRating, newComment, authorName || "Community Modder");
    setNewComment("");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success("Mod link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Dialog open={!!mod} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-border/80 bg-card/95 p-0 backdrop-blur-2xl shadow-2xl">
        
        {/* Banner Hero */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black/60">
          <img
            src={currentImage}
            alt={mod.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          
          {/* Top badges on hero */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-black/60 text-cyan-400 border-cyan-500/40 backdrop-blur-md uppercase text-xs font-bold font-mono">
              {mod.category}
            </Badge>
            <Badge className="bg-black/60 text-white backdrop-blur-md border border-white/10 font-mono text-xs">
              {mod.targetGame}
            </Badge>
          </div>

          {/* Top right actions */}
          <div className="absolute top-4 right-12 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="bg-black/50 backdrop-blur-md border-white/20 text-white text-xs hover:bg-black/80"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5 mr-1" />}
              {copiedLink ? "Copied" : "Share"}
            </Button>
          </div>

          {/* Bottom Title bar on banner */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={mod.author.avatar}
                    alt={mod.author.name}
                    className="h-6 w-6 rounded-full object-cover ring-2 ring-primary/60"
                  />
                  <span className="text-xs font-medium text-white/90 drop-shadow">
                    By {mod.author.name}
                  </span>
                  {mod.author.verified && (
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  )}
                  {mod.author.badge && (
                    <span className="rounded bg-primary/20 px-1.5 py-0.2 text-[10px] font-mono text-primary-foreground border border-primary/30">
                      {mod.author.badge}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md tracking-tight">
                  {mod.name}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {mod.installed ? (
                  <>
                    <Button
                      onClick={() => {
                        onClose();
                        openCustomizerForMod(mod);
                      }}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-500"
                    >
                      <Sliders className="mr-1.5 h-4 w-4" />
                      Customize in Studio
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => uninstallMod(mod.id)}
                      className="border-destructive/40 text-destructive hover:bg-destructive/10 text-xs"
                    >
                      Uninstall
                    </Button>
                  </>
                ) : (
                  <Button
                    disabled={isDownloading}
                    onClick={() => installMod(mod.id)}
                    className="bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:bg-primary/90"
                  >
                    <Download className="mr-1.5 h-4 w-4" />
                    {isDownloading ? "Downloading..." : mod.price > 0 ? `Buy for $${mod.price}` : "Install Mod Free"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery thumbnails strip */}
        {mod.screenshots && mod.screenshots.length > 1 && (
          <div className="flex items-center gap-2 px-6 pt-3 pb-1 overflow-x-auto border-b border-border/40">
            {mod.screenshots.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  currentImage === img
                    ? "border-primary ring-2 ring-primary/30 scale-105"
                    : "border-border/60 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Body & Tabs */}
        <div className="p-6">
          
          {/* Quick Stat Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3 text-center">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">Rating</span>
              <div className="mt-1 flex items-center justify-center gap-1 font-bold text-amber-400 text-sm">
                <Star className="h-4 w-4 fill-amber-400" />
                <span>{mod.rating.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground font-normal font-mono">
                  ({mod.ratingCount})
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3 text-center">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">Downloads</span>
              <div className="mt-1 font-mono font-bold text-foreground text-sm">
                {mod.downloads.toLocaleString()}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3 text-center">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">File Size</span>
              <div className="mt-1 font-mono font-bold text-foreground text-sm">
                {mod.size}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-secondary/30 p-3 text-center">
              <span className="text-[11px] font-mono text-muted-foreground uppercase">Latest Version</span>
              <div className="mt-1 font-mono font-bold text-cyan-400 text-sm">
                v{mod.version}
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary/40 p-1">
              <TabsTrigger value="overview" className="text-xs font-semibold">
                Overview & Features
              </TabsTrigger>
              <TabsTrigger value="customizer" className="text-xs font-semibold">
                Customizer Options
              </TabsTrigger>
              <TabsTrigger value="changelog" className="text-xs font-semibold">
                Changelog ({mod.changelog?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs font-semibold">
                Reviews ({mod.reviews?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Overview */}
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                <h4 className="text-sm font-bold text-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {mod.longDescription || mod.description}
                </p>
              </div>

              {/* Tags & Engine */}
              <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                <h4 className="text-sm font-bold text-foreground mb-2">Tags & Keywords</h4>
                <div className="flex flex-wrap gap-1.5">
                  {mod.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="font-mono text-xs">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Dependencies */}
              <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-cyan-400" /> System Dependencies
                </h4>
                {mod.dependencies && mod.dependencies.length > 0 ? (
                  <div className="space-y-2">
                    {mod.dependencies.map((dep, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs rounded-lg bg-card/60 p-2 border border-border/50">
                        <span className="font-medium text-foreground">{dep.name} ({dep.version})</span>
                        <span className="flex items-center gap-1 text-emerald-400 font-mono">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Installed & Verified
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground font-mono">
                    No external dependencies required. Standalone mod.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* TAB 2: Customizer Options */}
            <TabsContent value="customizer" className="mt-4 space-y-4">
              <div className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" /> Supported Customizer Controls
                  </h4>
                  <Button
                    size="sm"
                    onClick={() => {
                      onClose();
                      openCustomizerForMod(mod);
                    }}
                    className="bg-primary text-xs font-bold text-primary-foreground"
                  >
                    Open Studio
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  This mod fully integrates with the **TziGmodz Live Customizer Studio**. You can adjust the following parameters in real-time with visual simulation:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/40 bg-card/40 p-3">
                    <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-cyan-400" /> Visual & Color Engine
                    </div>
                    <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                      <li>Accent & Hologram Color Matrix</li>
                      <li>HUD Scale (0.5x to 2.0x) & Opacity</li>
                      <li>Scanline rasterization & Bloom intensity</li>
                      <li>Crosshair reticle models & Reticle sizing</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-border/40 bg-card/40 p-3">
                    <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-indigo-400" /> Physics & Telemetry
                    </div>
                    <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                      <li>Time dilation bullet-time multipliers</li>
                      <li>Recoil dampening & Camera shake</li>
                      <li>Ragdoll gravitational drag</li>
                      <li>Dynamic radar blip refresh rate</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-border/40 bg-card/40 p-3">
                    <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-amber-400" /> Audio & Sound Synthesis
                    </div>
                    <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                      <li>Master soundpack volume</li>
                      <li>Spatial 3D surround sound toggle</li>
                      <li>Synthesized hitmarker click sounds</li>
                      <li>Custom audio pitch shifting</li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-border/40 bg-card/40 p-3">
                    <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-purple-400" /> Script & Code Tweaker
                    </div>
                    <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                      <li>Direct Lua / JSON configuration editor</li>
                      <li>Hot-reload hook injection into live engine</li>
                      <li>Import / Export custom preset files</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: Changelog */}
            <TabsContent value="changelog" className="mt-4 space-y-3">
              {mod.changelog && mod.changelog.length > 0 ? (
                mod.changelog.map((log, idx) => (
                  <div key={idx} className="rounded-xl border border-border/60 bg-secondary/20 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-bold text-cyan-400 text-sm">{log.version}</span>
                      <span className="font-mono text-xs text-muted-foreground">{log.date}</span>
                    </div>
                    <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                      {log.changes.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-border/60 bg-secondary/20 p-6 text-center text-xs text-muted-foreground font-mono">
                  Initial release v{mod.version}.
                </div>
              )}
            </TabsContent>

            {/* TAB 4: Reviews */}
            <TabsContent value="reviews" className="mt-4 space-y-5">
              
              {/* Add review form */}
              <form onSubmit={handlePostReview} className="rounded-xl border border-border/60 bg-secondary/30 p-4 space-y-3">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4 text-primary" /> Write a Review
                </h4>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-muted-foreground mr-2">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-0.5 transition-transform hover:scale-125 focus:outline-none"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            star <= newRating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <Input
                    placeholder="Your creator nickname (optional)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="h-8 text-xs bg-background/60"
                  />
                </div>

                <Textarea
                  placeholder="Share your experience, performance feedback, or customizer preset tips..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[70px] text-xs bg-background/60"
                />

                <div className="flex justify-end">
                  <Button type="submit" size="sm" className="text-xs font-bold">
                    Submit Review
                  </Button>
                </div>
              </form>

              {/* Reviews list */}
              <div className="space-y-3">
                {mod.reviews && mod.reviews.length > 0 ? (
                  mod.reviews.map((rev) => (
                    <div key={rev.id} className="rounded-xl border border-border/50 bg-secondary/20 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.avatar}
                            alt={rev.author}
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-primary/40"
                          />
                          <div>
                            <div className="font-bold text-xs text-foreground">{rev.author}</div>
                            <div className="text-[10px] font-mono text-muted-foreground">{rev.date}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < rev.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>

                      <div className="mt-3 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => voteReviewHelpful(mod.id, rev.id)}
                          className={`flex items-center gap-1 text-[11px] font-mono transition-colors ${
                            rev.userUpvoted
                              ? "text-primary font-bold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span>Helpful ({rev.helpfulCount})</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-border/60 bg-secondary/20 p-8 text-center text-xs text-muted-foreground">
                    No reviews yet. Be the first to review this mod!
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
