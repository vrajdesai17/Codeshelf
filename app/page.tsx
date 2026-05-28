import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/sign-in-button";
import { BookMarked, Search, Tag, Zap } from "lucide-react";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-emerald-400" />
          <span className="font-semibold text-lg tracking-tight">CodeShelf</span>
        </div>
        <SignInButton />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8 border border-emerald-500/20">
          <Zap className="w-3.5 h-3.5" />
          Personal snippet manager
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6 max-w-2xl leading-tight">
          Save and search your{" "}
          <span className="text-emerald-400">code snippets</span>
        </h1>

        <p className="text-slate-400 text-xl max-w-lg mb-10 leading-relaxed">
          Paste any code, tag it, and find it in seconds. Syntax highlighting for 15+ languages. Your personal Gist.
        </p>

        <SignInButton size="lg" />

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full text-left">
          {[
            {
              icon: <BookMarked className="w-5 h-5 text-emerald-400" />,
              title: "Save anything",
              desc: "Title, language, tags — organized your way.",
            },
            {
              icon: <Search className="w-5 h-5 text-emerald-400" />,
              title: "Search fast",
              desc: "Real-time search across title, tags, and code.",
            },
            {
              icon: <Tag className="w-5 h-5 text-emerald-400" />,
              title: "Tag everything",
              desc: "Slice and dice your library with flexible tags.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5"
            >
              <div className="mb-3">{f.icon}</div>
              <div className="font-semibold text-white mb-1">{f.title}</div>
              <div className="text-slate-400 text-sm">{f.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
