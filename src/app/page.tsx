"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="text-center">
      <h1>Landing Page</h1>
      <br />
      <button onClick={() => router.push("/signup")}>Get Started</button>
      <br />
      <button onClick={() => router.push("/signin")}>Login</button>
    </div>
  );
}
