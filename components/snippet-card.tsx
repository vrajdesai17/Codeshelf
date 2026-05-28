"use client";

import { useState } from "react";
import { Snippet } from "@/components/dashboard-client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { SnippetDialog } from "@/components/snippet-dialog";

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
}

export function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  const [copied, setCopied] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const preview = snippet.code.split("\n").slice(0, 10).join("\n");

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <Card
        onClick={() => setDetailOpen(true)}
        className="bg-slate-900 border-slate-800 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-900/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group overflow-hidden p-0"
      >
        <div className="p-4 pb-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-white text-sm leading-tight truncate flex-1">
              {snippet.title}
            </h3>
            <DropdownMenu>
              <DropdownMenuTrigger
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 shrink-0 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-white hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-slate-800 border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem
                  onClick={() => onEdit(snippet)}
                  className="text-slate-200 focus:bg-slate-700 focus:text-white cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(snippet.id)}
                  className="text-red-400 focus:bg-red-900/30 focus:text-red-300 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-xs font-mono">
              {snippet.language}
            </Badge>
            {snippet.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-slate-700 text-slate-400 text-xs"
              >
                {tag}
              </Badge>
            ))}
            {snippet.tags.length > 3 && (
              <span className="text-slate-600 text-xs">+{snippet.tags.length - 3}</span>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden max-h-36 mx-3 mb-3 rounded-lg border border-slate-800">
          <SyntaxHighlighter
            language={snippet.language}
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: "10px 12px",
              fontSize: "0.7rem",
              lineHeight: "1.5",
              background: "transparent",
              maxHeight: "144px",
              overflow: "hidden",
            }}
            wrapLines={false}
          >
            {preview}
          </SyntaxHighlighter>
          <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
        </div>

        <div className="px-4 pb-3 flex items-center justify-between">
          <span className="text-slate-600 text-xs">
            {new Date(snippet.createdAt).toLocaleDateString()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-slate-500 hover:text-white text-xs gap-1.5"
          >
            {copied ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </Card>

      <SnippetDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        snippet={snippet}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}
