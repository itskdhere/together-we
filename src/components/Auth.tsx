"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@civic/auth/react";
import { CivicAuthIframeContainer } from "@civic/auth/react";

export default function Auth() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      console.log(user);
      router.push("/callback");
    }
  }, [user, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[rgb(30,41,59)] ">
      <div className="w-full max-w-md mx-auto shadow-2xl rounded-xl overflow-hidden p-1">
        <CivicAuthIframeContainer />
      </div>
    </div>
  );
}
