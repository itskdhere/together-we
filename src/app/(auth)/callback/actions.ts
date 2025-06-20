"use server";

import { getUser } from "@civic/auth/nextjs";
import { User } from "@/models/User";
import { dbConnect } from "@/lib/db";

export async function getAuthStatus() {
  try {
    await dbConnect();

    const user = await getUser();

    if (!user?.id || !user?.email) {
      return {
        success: false,
        url: "/signin",
      };
    }

    const { id, name, email, picture, updated_at } = user;

    const existingUser = await User.findOne({
      civicId: id,
      email: email,
    });

    if (!existingUser) {
      const userData = new User({
        name: name,
        email: email,
        civicId: id,
        picture: picture,
        createdAt: new Date(),
        updatedAt: updated_at ? new Date(updated_at) : new Date(),
      });
      await userData.save();
      return {
        success: true,
        url: "/onboard",
      };
    }

    return {
      success: true,
      url: "/dashboard",
    };
  } catch (error) {
    console.error("Failed to save user to database:", error);
    throw error;
  }
}
