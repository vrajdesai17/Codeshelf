"use client";

import { useState, useEffect } from "react";
import { Snippet } from "@/components/dashboard-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "c",
  "cpp",
  "html",
  "css",
  "sql",
  "bash",
  "yaml",
  "json",
  "markdown",
] as const;

interface SnippetEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet: Snippet | null;
  onSave: (data: {
    title: string;
    code: string;
    language: string;
    tags: string[];
  }) => Promise<void>;
}

export function SnippetEditor({
  open,
  onOpenChange,
  snippet,
  onSave,
}: SnippetEditorProps) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(snippet?.title ?? "");
      setCode(snippet?.code ?? "");
      setLanguage(snippet?.language ?? "javascript");
      setTagsInput(snippet?.tags.join(", ") ?? "");
      setError("");
    }
  }, [open, snippet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Title is required"); return; }
    if (!code.trim()) { setError("Code is required"); return; }

    setSaving(true);
    setError("");
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      await onSave({ title: title.trim(), code, language, tags });
    } catch {
      setError("Failed to save snippet. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">
            {snippet ? "Edit Snippet" : "New Snippet"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Snippet title"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Select value={language} onValueChange={(v) => v && setLanguage(v)}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:ring-emerald-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {LANGUAGES.map((lang) => (
                    <SelectItem
                      key={lang}
                      value={lang}
                      className="text-slate-200 focus:bg-slate-700 focus:text-white"
                    >
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-[2]">
              <Input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Tags (comma-separated, e.g. react, hooks, utils)"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="font-mono text-sm bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500 min-h-64 resize-y"
            spellCheck={false}
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-white"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-400 text-white"
            >
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {saving ? "Saving..." : snippet ? "Save Changes" : "Create Snippet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
