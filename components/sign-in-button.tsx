"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";

interface SignInButtonProps {
  size?: "default" | "sm" | "lg";
  variant?: "signout";
}

export function SignInButton({ size = "default", variant }: SignInButtonProps) {
  if (variant === "signout") {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-slate-400 hover:text-white"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign out
      </Button>
    );
  }

  return (
    <Button
      size={size}
      onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold"
    >
      <LogIn className="w-4 h-4 mr-2" />
      Sign in with Google
    </Button>
  );
}
