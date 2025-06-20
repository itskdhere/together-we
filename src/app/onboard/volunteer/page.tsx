"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { onboardVolunteer } from "./actions";

interface IVolunteerOnboard {
  name: string;
  username: string;
  bio: string;
  skills: string;
}

export default function VolunteerOnboard() {
  const [loading, setLoading] = useState(false);
  const [volData, setVolData] = useState<IVolunteerOnboard>({
    name: "",
    username: "",
    bio: "",
    skills: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await onboardVolunteer(volData);
    if (!res.success) {
      setLoading(false);
      toast.error(res.message || "Failed to onboard volunteer");
      return;
    }
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Volunteer Onboarding</h1>
        <div>
          <Label htmlFor="name">Volunteer Name</Label>
          <Input
            id="name"
            value={volData.name}
            onChange={(e) => setVolData({ ...volData, name: e.target.value })}
            placeholder="e.g. Jane Doe"
            required
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={volData.username}
            onChange={(e) =>
              setVolData({ ...volData, username: e.target.value })
            }
            placeholder="e.g. janedoe123"
            required
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            value={volData.bio}
            onChange={(e) => setVolData({ ...volData, bio: e.target.value })}
            placeholder="Short description about yourself"
            required
          />
        </div>
        <div>
          <Label htmlFor="skills">Skills or Areas of Focus</Label>
          <Input
            id="skills"
            value={volData.skills}
            onChange={(e) => setVolData({ ...volData, skills: e.target.value })}
            placeholder="e.g. Community Development, Education"
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </div>
  );
}
