import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Mod, ModCategory, ModCustomConfig, ModPresetConfig, TargetGame, DownloadTask, ModReview } from "../types/mod";
import { INITIAL_MODS, defaultModConfig } from "../data/initialMods";
import { playSound } from "../lib/audio-fx";
import { toast } from "sonner";

export type ActiveTab = "store" | "customizer" | "library" | "creator" | "settings";
export type ThemePalette = "cyan" | "emerald" | "amber" | "purple" | "crimson";

interface ModStoreContextType {
  mods: Mod[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCategory: ModCategory;
  setSelectedCategory: (cat: ModCategory) => void;
  selectedGame: TargetGame | "all";
  setSelectedGame: (game: TargetGame | "all") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: "popular" | "rating" | "newest" | "size" | "name";
  setSortBy: (sort: "popular" | "rating" | "newest" | "size" | "name") => void;

  selectedModForDetail: Mod | null;
  setSelectedModForDetail: (mod: Mod | null) => void;
  selectedModForCustomizer: Mod | null;
  setSelectedModForCustomizer: (mod: Mod | null) => void;

  downloadQueue: DownloadTask[];
  themeColor: ThemePalette;
  setThemeColor: (theme: ThemePalette) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  isGameRunning: boolean;
  launchModalOpen: boolean;
  setLaunchModalOpen: (open: boolean) => void;
  publishModalOpen: boolean;
  setPublishModalOpen: (open: boolean) => void;

  // Computed metrics
  installedMods: Mod[];
  activeMods: Mod[];
  totalInstalledStorageBytes: number;
  conflictingMods: Mod[];

  // Actions
  installMod: (modId: string) => void;
  uninstallMod: (modId: string) => void;
  toggleModEnabled: (modId: string) => void;
  updateModConfig: (modId: string, partialConfig: Partial<ModCustomConfig>) => void;
  resetModConfig: (modId: string) => void;
  applyPreset: (modId: string, presetId: string) => void;
  saveNewPreset: (modId: string, name: string, description: string) => void;
  deletePreset: (modId: string, presetId: string) => void;
  reorderModPriority: (fromIndex: number, toIndex: number) => void;
  resolveConflicts: () => void;
  addReview: (modId: string, rating: number, comment: string, authorName?: string) => void;
  voteReviewHelpful: (modId: string, reviewId: string) => void;
  publishNewMod: (modData: Partial<Mod>) => string;
  applyToLiveGame: (modId?: string) => void;
  launchGameSimulation: () => void;
  stopGameSimulation: () => void;
  cleanModCache: () => void;
  updateAllMods: () => void;
  exportConfigAsJson: (modId: string) => void;
  importConfigFromJson: (modId: string, jsonString: string) => boolean;
  openCustomizerForMod: (mod: Mod) => void;
}

const ModStoreContext = createContext<ModStoreContextType | undefined>(undefined);

const STORAGE_KEY = "tzigmodz_store_state_v1";

export function ModStoreProvider({ children }: { children: React.ReactNode }) {
  const [mods, setMods] = useState<Mod[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error("Failed to load mods from localStorage:", e);
      }
    }
    return INITIAL_MODS;
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>("store");
  const [selectedCategory, setSelectedCategory] = useState<ModCategory>("all");
  const [selectedGame, setSelectedGame] = useState<TargetGame | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "newest" | "size" | "name">("popular");
  const [selectedModForDetail, setSelectedModForDetail] = useState<Mod | null>(null);
  const [selectedModForCustomizer, setSelectedModForCustomizerState] = useState<Mod | null>(() => {
    const installed = INITIAL_MODS.filter((m) => m.installed);
    return installed[0] || INITIAL_MODS[0];
  });
  const [downloadQueue, setDownloadQueue] = useState<DownloadTask[]>([]);
  const [themeColor, setThemeColorState] = useState<ThemePalette>("cyan");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mods));
      } catch (e) {
        console.error("Failed to save to localStorage:", e);
      }
    }
  }, [mods]);

  // Keep selectedModForCustomizer in sync if mods list updates
  useEffect(() => {
    if (selectedModForCustomizer) {
      const updated = mods.find((m) => m.id === selectedModForCustomizer.id);
      if (updated && updated !== selectedModForCustomizer) {
        setSelectedModForCustomizerState(updated);
      }
    } else {
      const firstInstalled = mods.find((m) => m.installed) || mods[0];
      if (firstInstalled) {
        setSelectedModForCustomizerState(firstInstalled);
      }
    }
  }, [mods, selectedModForCustomizer]);

  const installedMods = useMemo(() => {
    return mods.filter((m) => m.installed).sort((a, b) => a.loadPriority - b.loadPriority);
  }, [mods]);

  const activeMods = useMemo(() => {
    return mods.filter((m) => m.installed && m.enabled).sort((a, b) => a.loadPriority - b.loadPriority);
  }, [mods]);

  const totalInstalledStorageBytes = useMemo(() => {
    return installedMods.reduce((sum, m) => sum + (m.fileSizeBytes || 25000000), 0);
  }, [installedMods]);

  const conflictingMods = useMemo(() => {
    // Check if multiple active mods modify the same primary hooks
    const active = mods.filter((m) => m.installed && m.enabled);
    const hudMods = active.filter((m) => m.category === "hud");
    if (hudMods.length > 1) {
      return hudMods;
    }
    return [];
  }, [mods]);

  const setActiveTab = (tab: ActiveTab) => {
    playSound("click", soundEnabled);
    setActiveTabState(tab);
  };

  const setSelectedModForCustomizer = (mod: Mod | null) => {
    playSound("click", soundEnabled);
    setSelectedModForCustomizerState(mod);
  };

  const openCustomizerForMod = (mod: Mod) => {
    if (!mod.installed) {
      // Auto install first
      installMod(mod.id);
    }
    setSelectedModForCustomizerState(mod);
    setActiveTabState("customizer");
    playSound("powerup", soundEnabled);
    toast.success(`Opened "${mod.name}" in Customizer Studio!`);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSound("toggle", true);
    toast.info(next ? "Audio SFX Enabled" : "Audio SFX Muted");
  };

  const setThemeColor = (theme: ThemePalette) => {
    setThemeColorState(theme);
    playSound("toggle", soundEnabled);
    toast.success(`Theme switched to ${theme.toUpperCase()}`);
  };

  const installMod = (modId: string) => {
    const targetMod = mods.find((m) => m.id === modId);
    if (!targetMod) return;

    if (targetMod.installed) {
      toast.info(`"${targetMod.name}" is already installed!`);
      return;
    }

    // Add to download queue
    playSound("install", soundEnabled);
    const newTask: DownloadTask = {
      modId,
      progress: 5,
      speed: "18.4 MB/s",
      status: "downloading",
    };

    setDownloadQueue((prev) => [...prev.filter((t) => t.modId !== modId), newTask]);
    toast.loading(`Downloading "${targetMod.name}"...`, { id: `dl-${modId}` });

    // Progress simulation
    let currentProgress = 5;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 20) + 15;
      if (currentProgress < 100) {
        setDownloadQueue((prev) =>
          prev.map((t) => (t.modId === modId ? { ...t, progress: currentProgress } : t))
        );
      } else {
        clearInterval(interval);
        setDownloadQueue((prev) =>
          prev.map((t) => (t.modId === modId ? { ...t, progress: 100, status: "installing" } : t))
        );

        setTimeout(() => {
          setMods((prev) =>
            prev.map((m) => {
              if (m.id === modId) {
                return {
                  ...m,
                  installed: true,
                  enabled: true,
                  downloads: m.downloads + 1,
                  loadPriority: prev.filter((p) => p.installed).length + 1,
                };
              }
              return m;
            })
          );

          setDownloadQueue((prev) => prev.filter((t) => t.modId !== modId));
          playSound("success", soundEnabled);
          toast.success(`"${targetMod.name}" installed and ready!`, { id: `dl-${modId}` });
        }, 600);
      }
    }, 250);
  };

  const uninstallMod = (modId: string) => {
    const targetMod = mods.find((m) => m.id === modId);
    if (!targetMod) return;

    setMods((prev) =>
      prev.map((m) => {
        if (m.id === modId) {
          return { ...m, installed: false, enabled: false };
        }
        return m;
      })
    );
    playSound("toggle", soundEnabled);
    toast.info(`Uninstalled "${targetMod.name}". Storage freed: ${targetMod.size}`);
  };

  const toggleModEnabled = (modId: string) => {
    setMods((prev) =>
      prev.map((m) => {
        if (m.id === modId) {
          const next = !m.enabled;
          playSound("toggle", soundEnabled);
          toast(next ? `Enabled: ${m.name}` : `Disabled: ${m.name}`);
          return { ...m, enabled: next };
        }
        return m;
      })
    );
  };

  const updateModConfig = (modId: string, partialConfig: Partial<ModCustomConfig>) => {
    setMods((prev) =>
      prev.map((m) => {
        if (m.id === modId) {
          const updated = {
            ...m,
            userConfig: {
              ...m.userConfig,
              ...partialConfig,
            },
          };
          return updated;
        }
        return m;
      })
    );
  };

  const resetModConfig = (modId: string) => {
    setMods((prev) =>
      prev.map((m) => {
        if (m.id === modId) {
          playSound("toggle", soundEnabled);
          toast.info(`Reset "${m.name}" configuration to factory defaults.`);
          return {
            ...m,
            userConfig: { ...m.defaultConfig },
          };
        }
        return m;
      })
    );
  };

  const applyPreset = (modId: string, presetId: string) => {
    const targetMod = mods.find((m) => m.id === modId);
    if (!targetMod || !targetMod.presets) return;

    const preset = targetMod.presets.find((p) => p.id === presetId);
    if (!preset) return;

    setMods((prev) =>
      prev.map((m) => {
        if (m.id === modId) {
          return {
            ...m,
            userConfig: {
              ...m.userConfig,
              ...preset.config,
            },
          };
        }
        return m;
      })
    );
    playSound("apply", soundEnabled);
    toast.success(`Preset "${preset.name}" applied successfully!`);
  };

  const saveNewPreset = (modId: string, name: string, description: string) => {
    const targetMod = mods.find((m) => m.id === modId);
    if (!targetMod) return;

    const newPreset: ModPresetConfig = {
      id: `preset-${Date.now()}`,
      name,
      description,
      config: { ...targetMod.userConfig },
    };

    setMods((prev) =>
      prev.map((m) => {
        if (m.id === modId) {
          return {
            ...m,
            presets: [...(m.presets || []), newPreset],
          };
        }
        return m;
      })
    );
    playSound("success", soundEnabled);
    toast.success(`Saved custom preset "${name}"!`);
  };

  const deletePreset = (modId: string, presetId: string) => {
    setMods((prev) =>
      prev.map((m) => {
        if (m.id === modId && m.presets) {
          return {
            ...m,
            presets: m.presets.filter((p) => p.id !== presetId),
          };
        }
        return m;
      })
    );
    playSound("toggle", soundEnabled);
    toast.info("Preset deleted.");
  };

  const reorderModPriority = (fromIndex: number, toIndex: number) => {
    const installed = [...installedMods];
    const [moved] = installed.splice(fromIndex, 1);
    installed.splice(toIndex, 0, moved);

    // Update priorities
    const priorityMap = new Map<string, number>();
    installed.forEach((m, idx) => {
      priorityMap.set(m.id, idx + 1);
    });

    setMods((prev) =>
      prev.map((m) => {
        if (priorityMap.has(m.id)) {
          return { ...m, loadPriority: priorityMap.get(m.id)! };
        }
        return m;
      })
    );
    playSound("toggle", soundEnabled);
    toast.success("Mod load order updated!");
  };

  const resolveConflicts = () => {
    // If conflicting HUD mods, keep top priority HUD mod enabled and disable the rest
    const active = mods.filter((m) => m.installed && m.enabled);
    const hudMods = active.filter((m) => m.category === "hud");
    if (hudMods.length > 1) {
      const topHud = hudMods.sort((a, b) => a.loadPriority - b.loadPriority)[0];
      setMods((prev) =>
        prev.map((m) => {
          if (m.category === "hud" && m.installed && m.id !== topHud.id) {
            return { ...m, enabled: false };
          }
          return m;
        })
      );
      playSound("success", soundEnabled);
      toast.success(`Resolved! Set "${topHud.name}" as primary HUD.`);
    } else {
      toast.info("No active mod conflicts detected.");
    }
  };

  const addReview = (modId: string, rating: number, comment: string, authorName = "TziG Commander") => {
    const newReview: ModReview = {
      id: `rev-${Date.now()}`,
      author: authorName,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      rating,
      date: "Just now",
      comment,
      helpfulCount: 0,
      userUpvoted: false,
    };

    setMods((prev) =>
      prev.map((m) => {
        if (m.id === modId) {
          const newReviews = [newReview, ...m.reviews];
          const newAvgRating = Number(
            (newReviews.reduce((sum, r) => sum + r.rating, 0) / newReviews.length).toFixed(2)
          );
          return {
            ...m,
            reviews: newReviews,
            rating: newAvgRating,
            ratingCount: m.ratingCount + 1,
          };
        }
        return m;
      })
    );
    playSound("success", soundEnabled);
    toast.success("Review posted successfully!");
  };

  const voteReviewHelpful = (modId: string, reviewId: string) => {
    setMods((prev) =>
      prev.map((m) => {
        if (m.id === modId) {
          return {
            ...m,
            reviews: m.reviews.map((r) => {
              if (r.id === reviewId) {
                const upvoted = !r.userUpvoted;
                return {
                  ...r,
                  userUpvoted: upvoted,
                  helpfulCount: upvoted ? r.helpfulCount + 1 : r.helpfulCount - 1,
                };
              }
              return r;
            }),
          };
        }
        return m;
      })
    );
    playSound("click", soundEnabled);
  };

  const publishNewMod = (modData: Partial<Mod>): string => {
    const newId = `mod-custom-${Date.now()}`;
    const newMod: Mod = {
      id: newId,
      name: modData.name || "Custom TziG Mod",
      tagline: modData.tagline || "Custom community creation",
      description: modData.description || "A custom mod created in TziGmodz Creator Studio.",
      longDescription: modData.longDescription || modData.description || "Custom mod details.",
      category: modData.category || "scripts",
      targetGame: modData.targetGame || "Garry's Mod",
      version: modData.version || "1.0.0",
      author: {
        name: modData.author?.name || "You (Creator)",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        verified: true,
        badge: "Community Creator",
      },
      downloads: 1,
      likes: 1,
      rating: 5.0,
      ratingCount: 1,
      size: modData.size || "15.0 MB",
      fileSizeBytes: 15728640,
      banner: modData.banner || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&auto=format&fit=crop&q=80",
      thumbnail: modData.thumbnail || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80",
      screenshots: [
        modData.banner || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
      ],
      tags: modData.tags || ["Custom", "Community", "TziGmodz"],
      isNew: true,
      price: modData.price || 0,
      installed: true,
      enabled: true,
      loadPriority: installedMods.length + 1,
      customizable: true,
      defaultConfig: { ...defaultModConfig, ...modData.defaultConfig },
      userConfig: { ...defaultModConfig, ...modData.userConfig },
      changelog: [
        {
          version: modData.version || "1.0.0",
          date: new Date().toISOString().split("T")[0],
          changes: ["Initial release to TziGmodz App Store"],
        },
      ],
      dependencies: [],
      reviews: [],
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    setMods((prev) => [newMod, ...prev]);
    setSelectedModForCustomizerState(newMod);
    playSound("powerup", soundEnabled);
    toast.success(`Published "${newMod.name}" to the App Store & Library!`);
    return newId;
  };

  const applyToLiveGame = (modId?: string) => {
    const target = modId ? mods.find((m) => m.id === modId) : selectedModForCustomizer;
    playSound("apply", soundEnabled);
    toast.success(
      target
        ? `Injected "${target.name}" settings into live game memory!`
        : "Live hooks recompiled and applied to game process!"
    );
  };

  const launchGameSimulation = () => {
    playSound("powerup", soundEnabled);
    setLaunchModalOpen(true);
    setIsGameRunning(true);
  };

  const stopGameSimulation = () => {
    setIsGameRunning(false);
    setLaunchModalOpen(false);
    toast.info("Game process detached.");
  };

  const cleanModCache = () => {
    playSound("toggle", soundEnabled);
    toast.success("Cleared 1.4 GB temp shaders and bytecode cache!");
  };

  const updateAllMods = () => {
    playSound("install", soundEnabled);
    toast.success("All installed mods are up-to-date (v2026.4 Compatible).");
  };

  const exportConfigAsJson = (modId: string) => {
    const target = mods.find((m) => m.id === modId);
    if (!target) return;

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(target.userConfig, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${target.name.toLowerCase().replace(/\s+/g, "_")}_config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    playSound("success", soundEnabled);
    toast.success(`Exported ${target.name} configuration JSON file!`);
  };

  const importConfigFromJson = (modId: string, jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      updateModConfig(modId, parsed);
      playSound("success", soundEnabled);
      toast.success("Config JSON imported and applied!");
      return true;
    } catch {
      toast.error("Invalid JSON configuration format.");
      return false;
    }
  };

  return (
    <ModStoreContext.Provider
      value={{
        mods,
        activeTab,
        setActiveTab,
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
        selectedModForCustomizer,
        setSelectedModForCustomizer,
        downloadQueue,
        themeColor,
        setThemeColor,
        soundEnabled,
        toggleSound,
        isGameRunning,
        launchModalOpen,
        setLaunchModalOpen,
        publishModalOpen,
        setPublishModalOpen,
        installedMods,
        activeMods,
        totalInstalledStorageBytes,
        conflictingMods,
        installMod,
        uninstallMod,
        toggleModEnabled,
        updateModConfig,
        resetModConfig,
        applyPreset,
        saveNewPreset,
        deletePreset,
        reorderModPriority,
        resolveConflicts,
        addReview,
        voteReviewHelpful,
        publishNewMod,
        applyToLiveGame,
        launchGameSimulation,
        stopGameSimulation,
        cleanModCache,
        updateAllMods,
        exportConfigAsJson,
        importConfigFromJson,
        openCustomizerForMod,
      }}
    >
      {children}
    </ModStoreContext.Provider>
  );
}

export function useModStore() {
  const context = useContext(ModStoreContext);
  if (!context) {
    throw new Error("useModStore must be used within a ModStoreProvider");
  }
  return context;
}
