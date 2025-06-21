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
    router.push("/organization/dashboard");
  };
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md space-y-6 border border-border"
      >
        <h1 className="text-2xl font-bold text-center text-foreground">
          Organization Onboarding
        </h1>
        <div>
          <Label htmlFor="name" className="text-foreground">
            Organization Name
          </Label>
          <Input
            id="name"
            value={orgData.name}
            onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
            placeholder="e.g. Unity"
            className="bg-background text-foreground border-border"
            required
          />
        </div>
        <div>
          <Label htmlFor="username" className="text-foreground">
            Username
          </Label>
          <Input
            id="username"
            value={orgData.username}
            onChange={(e) =>
              setOrgData({ ...orgData, username: e.target.value })
            }
            placeholder="e.g. unity-org"
            className="bg-background text-foreground border-border"
            required
          />
        </div>
        <div>
          <Label htmlFor="bio" className="text-foreground">
            Bio
          </Label>
          <Input
            id="bio"
            value={orgData.bio}
            onChange={(e) => setOrgData({ ...orgData, bio: e.target.value })}
            placeholder="Short description about your organization"
            className="bg-background text-foreground border-border"
            required
          />
        </div>
        <div>
          <Label htmlFor="category" className="text-foreground">
            Organization Category
          </Label>
          <Input
            id="category"
            value={orgData.category}
            onChange={(e) =>
              setOrgData({ ...orgData, category: e.target.value })
            }
            placeholder="e.g. Non-profit, School, Club"
            className="bg-background text-foreground border-border"
            required
          />
        </div>
        <div>
          <Label htmlFor="locality" className="text-foreground">
            Locality
          </Label>
          <Input
            id="locality"
            value={orgData.locality}
            onChange={(e) =>
              setOrgData({ ...orgData, locality: e.target.value })
            }
            placeholder="e.g. San Francisco, CA"
            className="bg-background text-foreground border-border"
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
