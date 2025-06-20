"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { onboardOrganization } from "./actions";

interface IOrgOnboard {
  name: string;
  username: string;
  bio: string;
  category: string;
  locality: string;
}

export default function OrganizationOnboard() {
  const [loading, setLoading] = useState(false);
  const [orgData, setOrgData] = useState<IOrgOnboard>({
    name: "",
    username: "",
    bio: "",
    category: "",
    locality: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await onboardOrganization(orgData);
    if (!res.success) {
      setLoading(false);
      toast.error(res.message || "Failed to onboard organization");
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
        <h1 className="text-2xl font-bold text-center">
          Organization Onboarding
        </h1>
        <div>
          <Label htmlFor="name">Organization Name</Label>
          <Input
            id="name"
            value={orgData.name}
            onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
            placeholder="e.g. Together We"
            required
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={orgData.username}
            onChange={(e) =>
              setOrgData({ ...orgData, username: e.target.value })
            }
            placeholder="e.g. togetherweorg"
            required
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            value={orgData.bio}
            onChange={(e) => setOrgData({ ...orgData, bio: e.target.value })}
            placeholder="Short description about your organization"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Organization Category</Label>
          <Input
            id="category"
            value={orgData.category}
            onChange={(e) =>
              setOrgData({ ...orgData, category: e.target.value })
            }
            placeholder="e.g. Non-profit, School, Club"
            required
          />
        </div>
        <div>
          <Label htmlFor="locality">Locality</Label>
          <Input
            id="locality"
            value={orgData.locality}
            onChange={(e) =>
              setOrgData({ ...orgData, locality: e.target.value })
            }
            placeholder="e.g. San Francisco, CA"
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
