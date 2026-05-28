import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard-client";
import { BookMarked } from "lucide-react";
import { SignInButton } from "@/components/sign-in-button";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10 bg-slate-950/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-emerald-400" />
          <span className="font-semibold text-lg tracking-tight">CodeShelf</span>
        </div>
        <div className="flex items-center gap-3">
          {session.user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ?? "User"}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-slate-400 text-sm hidden sm:block">
            {session.user.name}
          </span>
          <SignInButton variant="signout" size="sm" />
        </div>
      </header>
      <DashboardClient />
    </div>
  );
}
