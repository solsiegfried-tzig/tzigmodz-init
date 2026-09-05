import { createFileRoute } from "@tanstack/react-router";
import { ModStoreProvider, useModStore } from "../context/ModStoreContext";
import { Navbar } from "../components/Navbar";
import { ModStoreView } from "../components/store/ModStoreView";
import { CustomizerStudio } from "../components/customizer/CustomizerStudio";
import { LibraryView } from "../components/library/LibraryView";
import { CreatorStudio } from "../components/creator/CreatorStudio";
import { SettingsView } from "../components/settings/SettingsView";
import { LaunchGameModal } from "../components/modals/LaunchGameModal";
import { PublishModModal } from "../components/modals/PublishModModal";
import { Toaster } from "../components/ui/sonner";
import {
  Gamepad2,
  Sliders,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Zap,
  Terminal,
  Layers,
  Flame,
  Heart,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: AppStoreMain,
});

function AppStoreContent() {
  const { activeTab, themeColor } = useModStore();

  return (
    <div
      data-theme={themeColor}
      className="min-h-screen bg-background text-foreground flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
      </div>

      {/* Top Navigation */}
      <Navbar />

      {/* Main Container Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === "store" && <ModStoreView />}
        {activeTab === "customizer" && <CustomizerStudio />}
        {activeTab === "library" && <LibraryView />}
        {activeTab === "creator" && <CreatorStudio />}
        {activeTab === "settings" && <SettingsView />}
      </main>

      {/* Modals */}
      <LaunchGameModal />
      <PublishModModal />

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/80 py-8 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-foreground">TziGmodz Modding App Store & Customizer</span>
            <span>• v4.2.0</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-muted-foreground">
              Built for Garry's Mod, GTA V, Source & Universal Sandbox Engines
            </span>
          </div>
        </div>
      </footer>

      {/* Sonner Toasts */}
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}

function AppStoreMain() {
  return (
    <ModStoreProvider>
      <AppStoreContent />
    </ModStoreProvider>
  );
}
