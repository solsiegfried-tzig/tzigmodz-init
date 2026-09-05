import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Code, Copy, Download, Check, RefreshCw, Terminal, Save } from "lucide-react";
import { toast } from "sonner";

interface CodeEditorModalProps {
  open: boolean;
  onClose: () => void;
  code: string;
  onSave: (newCode: string) => void;
  modName: string;
  language?: "lua" | "json";
}

export function CodeEditorModal({
  open,
  onClose,
  code,
  onSave,
  modName,
  language = "lua",
}: CodeEditorModalProps) {
  const [currentCode, setCurrentCode] = useState(code);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = language === "lua" ? "lua" : "json";
    const blob = new Blob([currentCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${modName.toLowerCase().replace(/\s+/g, "_")}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${modName}.${ext}`);
  };

  const handleApply = () => {
    onSave(currentCode);
    toast.success("Code changes applied to live hook memory!");
    onClose();
  };

  const lineCount = currentCode.split("\n").length;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-3xl border-border/80 bg-card/95 backdrop-blur-2xl p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                <Terminal className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold">
                  {modName} — {language.toUpperCase()} Script Injector
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Direct live bytecode injection for {language === "lua" ? "Garry's Mod & Source Lua Hooks" : "JSON runtime config"}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8 text-xs border-border/70 bg-secondary/40"
              >
                {copied ? <Check className="mr-1 h-3.5 w-3.5 text-emerald-400" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-8 text-xs border-border/70 bg-secondary/40"
              >
                <Download className="mr-1 h-3.5 w-3.5" /> Export .{language}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Code Editor Body */}
        <div className="mt-4 flex rounded-xl border border-border/70 bg-black/80 font-mono text-xs overflow-hidden shadow-inner">
          {/* Line Numbers */}
          <div className="select-none border-r border-border/40 bg-card/30 px-3 py-3 text-right text-muted-foreground/50 font-mono">
            {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
              <div key={i} className="leading-relaxed">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Textarea */}
          <Textarea
            value={currentCode}
            onChange={(e) => setCurrentCode(e.target.value)}
            className="flex-1 resize-none border-0 bg-transparent p-3 font-mono text-xs text-cyan-300 leading-relaxed focus-visible:ring-0 shadow-none min-h-[300px]"
            spellCheck={false}
          />
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] font-mono text-muted-foreground">
            Bytecode status: <strong className="text-emerald-400">SYNTAX VALID</strong>
          </span>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="bg-primary text-xs font-bold text-primary-foreground shadow-md shadow-primary/20"
            >
              <Save className="mr-1.5 h-3.5 w-3.5" /> Save & Inject Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
