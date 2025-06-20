"use server";

import { getUser } from "@civic/auth/nextjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { Organization } from "@/models/Organization";

export interface OrganizationOnboardInput {
  name: string;
  username: string;
  bio: string;
  category: string;
  locality: string;
}

export async function onboardOrganization({
  name,
  username,
  bio,
  category,
  locality,
}: OrganizationOnboardInput) {
  await dbConnect();

  const user = await getUser();
  if (!user?.id || !user?.email) {
    return { success: false, message: "Not authenticated" };
  }

  const existingUser = await User.findOne({
    civicId: user.id,
    email: user.email,
  });
  if (!existingUser) {
    return { success: false, message: "User not found" };
  }

  const existingusername = await User.findOne({
    username: username,
  });
  if (existingusername) {
    return { success: false, message: "Username already exists" };
  }

  const organization = new Organization({
    category,
    locality,
  });
  await organization.save();

  existingUser.name = name;
  existingUser.username = username;
  existingUser.bio = bio;
  existingUser.type = "organization";
  existingUser.onboarded = true;
  existingUser.data = organization._id;
  existingUser.updatedAt = new Date();
  await existingUser.save();

  return {
    success: true,
    message: "Organization onboarded",
  };
}
