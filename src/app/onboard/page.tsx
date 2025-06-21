"use client";

import { useRouter } from "next/navigation";
import { useState, useId } from "react";
import { useUser } from "@civic/auth/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2, Users } from "lucide-react";

export default function Onboard() {
  const id = useId();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { user } = useUser();

  const handleContinue = () => {
    if (selectedRole === "volunteer") {
      router.push("/onboard/volunteer");
    } else if (selectedRole === "organization") {
      router.push("/onboard/organization");
    }
  };
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Hello {user?.name || "there"}!{" "}
          </h1>
          <p className="text-muted-foreground">
            Welcome to our platform. Let's get you set up based on how you'd
            like to participate.
          </p>
        </div>
        {/* Role Selection */}{" "}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            How would you like to get involved?
          </h2>

          <RadioGroup
            className="gap-4"
            value={selectedRole}
            onValueChange={setSelectedRole}
          >
            {" "}
            {/* Volunteer Option */}
            <div className="border-border bg-card/50 backdrop-blur-sm has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-4 rounded-md border p-6 shadow-lg outline-none transition-colors hover:bg-card/70">
              <RadioGroupItem
                value="volunteer"
                id={`${id}-volunteer`}
                aria-describedby={`${id}-volunteer-description`}
                className="order-1 after:absolute after:inset-0"
              />
              <div className="flex grow items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div className="grid grow gap-1">
                  <Label
                    htmlFor={`${id}-volunteer`}
                    className="text-base font-medium text-foreground"
                  >
                    Volunteer
                  </Label>
                  <p
                    id={`${id}-volunteer-description`}
                    className="text-muted-foreground text-sm"
                  >
                    I want to help out with events and activities in my
                    community.
                  </p>
                </div>
              </div>
            </div>
            {/* Organization Option */}
            <div className="border-border bg-card/50 backdrop-blur-sm has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-4 rounded-md border p-6 shadow-lg outline-none transition-colors hover:bg-card/70">
              <RadioGroupItem
                value="organization"
                id={`${id}-organization`}
                aria-describedby={`${id}-organization-description`}
                className="order-1 after:absolute after:inset-0"
              />
              <div className="flex grow items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
                  <Building2 className="h-6 w-6 text-green-400" />
                </div>
                <div className="grid grow gap-1">
                  <Label
                    htmlFor={`${id}-organization`}
                    className="text-base font-medium text-foreground"
                  >
                    Organization
                  </Label>
                  <p
                    id={`${id}-organization-description`}
                    className="text-muted-foreground text-sm"
                  >
                    I want to create and manage events to bring people together.
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>

          {/* Continue Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedRole}
              size="lg"
              className="min-w-32"
            >
              Continue
            </Button>
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
