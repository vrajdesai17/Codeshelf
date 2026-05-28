"use client";

import { useState } from "react";
import { Snippet } from "@/components/dashboard-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Pencil, Trash2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface SnippetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
}

export function SnippetDialog({
  open,
  onOpenChange,
  snippet,
  onEdit,
  onDelete,
}: SnippetDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleEdit = () => {
    onOpenChange(false);
    onEdit(snippet);
  };

  const handleDelete = () => {
    onOpenChange(false);
    onDelete(snippet.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 pr-8">
            <DialogTitle className="text-white text-lg leading-snug">
              {snippet.title}
            </DialogTitle>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="text-slate-400 hover:text-white h-8 px-2"
              >
                <Pencil className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 px-2"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-xs font-mono">
              {snippet.language}
            </Badge>
            {snippet.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-slate-600 text-slate-400 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto relative rounded-lg border border-slate-700 mt-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="absolute top-2 right-2 z-10 h-7 px-2.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 gap-1.5"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <SyntaxHighlighter
            language={snippet.language}
            style={oneDark}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: "16px",
              fontSize: "0.8rem",
              lineHeight: "1.6",
              background: "transparent",
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>

        <p className="text-slate-600 text-xs pt-1">
          Created {new Date(snippet.createdAt).toLocaleDateString()} · Updated{" "}
          {new Date(snippet.updatedAt).toLocaleDateString()}
        </p>
      </DialogContent>
    </Dialog>
  );
}
