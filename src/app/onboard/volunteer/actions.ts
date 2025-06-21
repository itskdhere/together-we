"use server";

import { getUser } from "@civic/auth/nextjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { Volunteer } from "@/models/Volunteers";

export interface VolunteerOnboardInput {
  name: string;
  username: string;
  bio: string;
  skills: string;
}

export async function onboardVolunteer({
  name,
  username,
  bio,
  skills,
}: VolunteerOnboardInput) {
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

  const volunteer = new Volunteer({
    skills: skills,
  });
  await volunteer.save();

  existingUser.name = name;
  existingUser.username = username;
  existingUser.bio = bio;
  existingUser.type = "volunteer";
  existingUser.onboarded = true;
  existingUser.data = volunteer._id;
  existingUser.updatedAt = new Date();
  await existingUser.save();

  return {
    success: true,
    message: "Volunteer onboarded",
  };
}
