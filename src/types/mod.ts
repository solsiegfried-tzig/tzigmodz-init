export type ModCategory =
  | "all"
  | "hud"
  | "weapons"
  | "vehicles"
  | "physics"
  | "shaders"
  | "scripts"
  | "skins"
  | "audio"
  | "tools";

export type TargetGame =
  | "Garry's Mod"
  | "GTA V"
  | "Minecraft"
  | "Source Engine"
  | "Cyberpunk 2077"
  | "Universal Mod";

export interface ModReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
  userUpvoted?: boolean;
}

export interface ModPresetConfig {
  id: string;
  name: string;
  description: string;
  config: Partial<ModCustomConfig>;
}

export interface ModCustomConfig {
  // Visual & HUD
  accentColor: string;
  secondaryColor: string;
  hudScale: number; // 0.5 to 2.0
  hudOpacity: number; // 20 to 100
  glowIntensity: number; // 0 to 100
  scanlines: boolean;
  vignette: number; // 0 to 100
  bloom: number; // 0 to 100
  crosshairStyle: "dot" | "cross" | "halo" | "cyber" | "tactical";
  crosshairColor: string;
  minimapShape: "circle" | "hexagon" | "square" | "radar";
  showFpsOverlay: boolean;
  themeStyle: "cyberpunk" | "stealth" | "matrix" | "synthwave" | "crimson";

  // Gameplay & Physics
  timeDilationFactor: number; // 0.1 to 2.0
  speedMultiplier: number; // 0.5 to 3.0
  recoilDamping: number; // 0 to 100%
  ragdollGravity: number; // 0.1 to 3.0
  sparkMultiplier: number; // 1 to 5
  cameraShake: number; // 0 to 100
  infiniteStamina: boolean;
  fovSlider: number; // 70 to 130

  // Audio & Sound
  masterVolume: number; // 0 to 100
  sfxTheme: "cybernetic" | "mechanical" | "arcade" | "cinematic";
  hitmarkerSound: boolean;
  pitchShift: number; // 0.5 to 2.0
  bassBoost: number; // 0 to 100
  spatialAudio: boolean;

  // Keybindings
  openMenuKey: string;
  toggleModKey: string;
  bulletTimeKey: string;
  actionKey: string;

  // Lua / JSON Script Config
  customScriptString: string;
  configJsonString: string;
}

export interface Mod {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: ModCategory;
  targetGame: TargetGame;
  version: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    badge?: string;
  };
  downloads: number;
  likes: number;
  rating: number;
  ratingCount: number;
  size: string;
  fileSizeBytes: number;
  banner: string;
  thumbnail: string;
  screenshots: string[];
  tags: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  price: number; // 0 for Free
  installed: boolean;
  enabled: boolean;
  loadPriority: number; // Lower = loads first (1, 2, 3...)
  customizable: boolean;
  defaultConfig: ModCustomConfig;
  userConfig: ModCustomConfig;
  presets?: ModPresetConfig[];
  changelog: {
    version: string;
    date: string;
    changes: string[];
  }[];
  dependencies: {
    name: string;
    version: string;
    installed: boolean;
  }[];
  reviews: ModReview[];
  luaCode?: string;
  conflictsWith?: string[]; // IDs of conflicting mods
  lastUpdated?: string;
}

export interface DownloadTask {
  modId: string;
  progress: number;
  speed: string;
  status: "downloading" | "extracting" | "installing" | "completed" | "error";
}
