"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getAuthStatus } from "./actions";

export default function AuthCallback() {
  const router = useRouter();
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const response = await getAuthStatus();
        router.push(response.url);
      } catch (error) {
        console.error("Error checking auth status:", error);
        router.push("/signin");
      }
    }
    checkAuthStatus();
  }, [router]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="size-8 animate-spin text-zinc-500" />
        <h3 className="font-semibold text-xl">Logging you in...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
}
