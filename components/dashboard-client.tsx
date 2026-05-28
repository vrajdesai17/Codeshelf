"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { SnippetCard } from "@/components/snippet-card";
import { SnippetEditor } from "@/components/snippet-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Code2 } from "lucide-react";
import { toast } from "sonner";

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export function DashboardClient() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSnippets = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/snippets${q ? `?search=${encodeURIComponent(q)}` : ""}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSnippets(data);
    } catch {
      toast.error("Failed to load snippets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSnippets(value), 300);
  };

  const handleCreate = () => {
    setEditingSnippet(null);
    setEditorOpen(true);
  };

  const handleEdit = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    const prev = snippets;
    setSnippets((s) => s.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Snippet deleted");
    } catch {
      setSnippets(prev);
      toast.error("Failed to delete snippet");
    }
  };

  const handleSave = async (data: {
    title: string;
    code: string;
    language: string;
    tags: string[];
  }) => {
    if (editingSnippet) {
      const res = await fetch(`/api/snippets/${editingSnippet.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setSnippets((s) => s.map((x) => (x.id === updated.id ? updated : x)));
      toast.success("Snippet updated");
    } else {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create");
      const created = await res.json();
      setSnippets((s) => [created, ...s]);
      toast.success("Snippet saved");
    }
    setEditorOpen(false);
  };

  return (
    <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by title, tag, or code..."
            className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
          />
        </div>
        <Button
          onClick={handleCreate}
          className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Snippet
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-52 rounded-xl bg-slate-900 border border-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Code2 className="w-12 h-12 text-slate-700 mb-4" />
          <p className="text-slate-400 text-lg font-medium mb-2">
            {search ? "No snippets match your search" : "No snippets yet"}
          </p>
          <p className="text-slate-600 text-sm mb-6">
            {search ? "Try a different keyword" : "Save your first snippet to get started"}
          </p>
          {!search && (
            <Button
              onClick={handleCreate}
              className="bg-emerald-500 hover:bg-emerald-400 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create your first snippet
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {snippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <SnippetEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        snippet={editingSnippet}
        onSave={handleSave}
      />
    </main>
  );
}
