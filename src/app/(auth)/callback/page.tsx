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
    <div className="w-full flex justify-center bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center gap-2 mt-24">
        <Loader2 className="size-8 animate-spin text-gray-400" />
        <h3 className="font-semibold text-xl text-white">Logging you in...</h3>
        <p className="text-gray-300">You will be redirected automatically.</p>
      </div>
    </div>
  );
}
