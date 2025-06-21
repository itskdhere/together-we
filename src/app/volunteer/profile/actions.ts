"use server";

import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { Volunteer, IVolunteer } from "@/models/Volunteers";
import { Event } from "@/models/Events";
import { getUser } from "@civic/auth/nextjs"; // Assuming this function exists to get the current user

export async function getProfileData() {
  try {
    await dbConnect();

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { error: "Not authenticated" };
    }
    const volunteerUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "volunteer",
    }).populate({
      path: "data",
      model: "Volunteer",
    });

    if (!volunteerUser) {
      return { error: "Volunteer not found" };
    }

    const volunteerData = volunteerUser.data as IVolunteer;
    console.log(volunteerData);

    return {
      success: true,
      profile: {
        name: volunteerUser.name || "",
        email: volunteerUser.email,
        bio: volunteerUser.bio || "",
        skills: volunteerData.skills || "",
      },
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: `Failed to fetch profile data: ${errorMessage}` };
  }
}

export async function updateProfileData(formData: {
  name: string;
  bio: string;
  skills: string;
}) {
  try {
    await dbConnect();

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { error: "Not authenticated" };
    }

    const volunteerUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "volunteer",
    });

    if (!volunteerUser) {
      return { error: "Volunteer not found" };
    }

    await User.findByIdAndUpdate(volunteerUser._id, {
      name: formData.name,
    });

    await Volunteer.findByIdAndUpdate(volunteerUser.data, {
      skills: formData.skills,
      bio: formData.bio,
    });

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: `Failed to update profile data: ${errorMessage}` };
  }
}

export async function getRecentActivity() {
  try {
    await dbConnect();

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { error: "Not authenticated" };
    }

    const volunteerUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "volunteer",
    }).populate({
      path: "data",
      model: "Volunteer",
    });

    if (!volunteerUser) {
      return { error: "Volunteer not found" };
    }

    const volunteerData = volunteerUser.data as IVolunteer;

    // Get events where this volunteer participated
    const recentEvents = await Event.find({
      joinedVolunteers: volunteerData._id,
    })
      .sort({ startTime: -1 })
      .limit(5)
      .select("name startTime endTime");

    const activities = recentEvents.map((event) => {
      const isCompleted = event.endTime < new Date();
      const daysAgo = Math.floor(
        (Date.now() - event.startTime.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        id: event._id.toString(),
        title: isCompleted ? `Completed ${event.name}` : `Joined ${event.name}`,
        timeAgo:
          daysAgo === 0
            ? "Today"
            : daysAgo === 1
            ? "1 day ago"
            : `${daysAgo} days ago`,
        type: isCompleted ? "completed" : "joined",
      };
    });

    // Get volunteer stats
    const totalEvents = await Event.countDocuments({
      joinedVolunteers: volunteerData._id,
    });

    const completedEvents = await Event.countDocuments({
      joinedVolunteers: volunteerData._id,
      endTime: { $lt: new Date() },
    }); // Calculate hours volunteered (assuming each event is 4 hours on average)
    const hoursVolunteered = completedEvents * 4;

    // For now, set organizations helped to a default value since we don't have org data
    const organizationsHelped = Math.min(completedEvents, 3);

    return {
      success: true,
      activities,
      stats: {
        eventsJoined: totalEvents,
        hoursVolunteered,
        organizationsHelped,
      },
    };
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: `Failed to fetch recent activity: ${errorMessage}` };
  }
}
