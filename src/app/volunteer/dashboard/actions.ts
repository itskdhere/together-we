"use server";

import { getUser } from "@civic/auth/nextjs";
import { dbConnect } from "@/lib/db";
import { Event } from "@/models/Events";
import { Organization } from "@/models/Organization";
import { User } from "@/models/User";
import { Volunteer } from "@/models/Volunteers";

export async function getVolunteerData() {
  try {
    await dbConnect();
    console.log("Database connected successfully");

    const user = await getUser();
    console.log("Civic user:", user);

    if (!user?.id || !user?.email) {
      return { error: "Not authenticated" };
    }

    // Get volunteer user
    const volunteerUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "volunteer",
      onboarded: true,
    });

    console.log("Volunteer user found:", volunteerUser);

    if (!volunteerUser) {
      return { error: "Volunteer user not found" };
    }

    // Get volunteer data
    const volunteerData = await Volunteer.findById(volunteerUser.data);
    console.log("Volunteer data found:", volunteerData);

    if (!volunteerData) {
      return { error: "Volunteer data not found" };
    }

    return {
      success: true,
      user: {
        id: volunteerUser._id.toString(),
        name: volunteerUser.name,
        email: volunteerUser.email,
        username: volunteerUser.username,
        civicId: volunteerUser.civicId,
        type: volunteerUser.type,
        dataId: volunteerUser.data?.toString(),
      },
      volunteer: {
        id: volunteerData._id.toString(),
        skills: volunteerData.skills,
        experienceCount: volunteerData.experience?.length || 0,
        badgesCount: volunteerData.badges?.length || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: `Failed to fetch volunteer: ${errorMessage}` };
  }
}

export async function getFeaturedEvents() {
  try {
    await dbConnect();
    console.log("Database connected for featured events");

    // Get current user to check joined status
    const user = await getUser();
    let currentVolunteerId = null;

    if (user?.id && user?.email) {
      const volunteerUser = await User.findOne({
        civicId: user.id,
        email: user.email,
        type: "volunteer",
        onboarded: true,
      });
      currentVolunteerId = volunteerUser?.data;
    }

    // Get all events and populate with organization data
    const events = await Event.find({})
      .sort({ startTime: 1 }) // Sort by start time ascending
      .limit(8) // Limit to 8 featured events
      .lean();

    // Get organization data for each event
    const eventsWithOrganizations = await Promise.all(
      events.map(async (event: any) => {
        // Find organization that has this event
        const organization = await Organization.findOne({
          events: event._id,
        });

        // Get organization user info
        let organizationName = "Unknown Organization";
        if (organization) {
          const orgUser = await User.findOne({
            data: organization._id,
            type: "organization",
          });
          organizationName =
            orgUser?.name || orgUser?.username || "Unknown Organization";
        }

        // Check if current user has already joined this event
        const isAlreadyJoined =
          currentVolunteerId &&
          event.joinedVolunteers?.some(
            (volunteerId: any) =>
              volunteerId.toString() === currentVolunteerId.toString()
          );

        return {
          id: event._id.toString(),
          name: event.name,
          description: event.description,
          organization: organizationName,
          category: organization?.category || "General",
          location: event.location,
          date: event.startTime.toISOString().split("T")[0], // Format as YYYY-MM-DD
          time: event.startTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          maxCapacity: event.volunteerCap,
          currentJoined: event.joinedVolunteers?.length || 0,
          requiredSkills: event.requiredSkills,
          startTime: event.startTime,
          endTime: event.endTime,
          isAlreadyJoined: isAlreadyJoined || false,
        };
      })
    );

    return {
      success: true,
      events: eventsWithOrganizations,
    };
  } catch (error) {
    console.error("Error fetching featured events:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: `Failed to fetch featured events: ${errorMessage}` };
  }
}

export async function joinEvent(eventId: string) {
  try {
    await dbConnect();
    console.log("Database connected for joining event");

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { error: "Not authenticated" };
    }

    // Get volunteer user
    const volunteerUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "volunteer",
      onboarded: true,
    });

    if (!volunteerUser) {
      return { error: "Volunteer user not found" };
    }

    // Get the event
    const event = await Event.findById(eventId);
    if (!event) {
      return { error: "Event not found" };
    }

    // Check if already joined
    const volunteerId = volunteerUser.data;
    if (event.joinedVolunteers?.includes(volunteerId)) {
      return { error: "Already joined this event" };
    }

    // Check if event is full
    if (
      event.joinedVolunteers &&
      event.joinedVolunteers.length >= event.volunteerCap
    ) {
      return { error: "Event is full" };
    }

    // Add volunteer to event
    await Event.findByIdAndUpdate(eventId, {
      $push: { joinedVolunteers: volunteerId },
    });

    // Track experience for the volunteer
    const organization = await Organization.findOne({ events: event._id });
    let organizationName = "Unknown Organization";
    if (organization) {
      const orgUser = await User.findOne({
        data: organization._id,
        type: "organization",
      });
      organizationName =
        orgUser?.name || orgUser?.username || "Unknown Organization";
    }

    // const experienceEntry = {
    //   eventName: event.name,
    //   organizationName,
    //   startTime: event.startTime,
    //   endTime: event.endTime,
    //   location: event.location,
    // };

    await Volunteer.findByIdAndUpdate(volunteerId, {
      $push: { experience: eventId },
    });

    return {
      success: true,
      message: "Successfully joined the event",
      currentJoined: (event.joinedVolunteers?.length || 0) + 1,
    };
  } catch (error) {
    console.error("Error joining event:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: `Failed to join event: ${errorMessage}` };
  }
}

export async function leaveEvent(eventId: string) {
  try {
    await dbConnect();
    console.log("Database connected for leaving event");

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { error: "Not authenticated" };
    }

    // Get volunteer user
    const volunteerUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "volunteer",
      onboarded: true,
    });

    if (!volunteerUser) {
      return { error: "Volunteer user not found" };
    }

    // Get the event
    const event = await Event.findById(eventId);
    if (!event) {
      return { error: "Event not found" };
    }

    // Check if volunteer is in the event
    const volunteerId = volunteerUser.data;
    if (!event.joinedVolunteers?.includes(volunteerId)) {
      return { error: "Not joined to this event" };
    }

    // Remove volunteer from event
    await Event.findByIdAndUpdate(eventId, {
      $pull: { joinedVolunteers: volunteerId },
    });

    return {
      success: true,
      message: "Successfully left the event",
      currentJoined: Math.max((event.joinedVolunteers?.length || 1) - 1, 0),
    };
  } catch (error) {
    console.error("Error leaving event:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: `Failed to leave event: ${errorMessage}` };
  }
}

export async function getVolunteerStats() {
  try {
    await dbConnect();
    console.log("Database connected for volunteer stats");

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { error: "Not authenticated" };
    }

    // Get volunteer user
    const volunteerUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "volunteer",
      onboarded: true,
    });

    if (!volunteerUser) {
      return { error: "Volunteer user not found" };
    }

    const volunteerId = volunteerUser.data;

    // Count events joined
    const eventsJoined = await Event.countDocuments({
      joinedVolunteers: volunteerId,
    });

    // Get unique organizations helped
    const eventsWithOrgs = await Event.find({
      joinedVolunteers: volunteerId,
    }).lean();

    const organizationIds = new Set();
    for (const event of eventsWithOrgs) {
      const org = await Organization.findOne({ events: event._id });
      if (org) {
        organizationIds.add(org._id.toString());
      }
    }

    // Calculate estimated hours (assuming 3 hours per event on average)
    const estimatedHours = eventsJoined * 3;

    return {
      success: true,
      stats: {
        eventsJoined,
        hoursVolunteered: estimatedHours,
        organizationsHelped: organizationIds.size,
      },
    };
  } catch (error) {
    console.error("Error fetching volunteer stats:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: `Failed to fetch volunteer stats: ${errorMessage}` };
  }
}

export async function getMyEvents() {
  try {
    await dbConnect();
    console.log("Database connected for my events");

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { error: "Not authenticated" };
    }

    // Get volunteer user
    const volunteerUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "volunteer",
      onboarded: true,
    });

    if (!volunteerUser) {
      return { error: "Volunteer user not found" };
    }

    const volunteerId = volunteerUser.data; // Get events the volunteer has joined
    const events = await Event.find({
      joinedVolunteers: volunteerId,
    })
      .sort({ startTime: 1 })
      .lean();

    // Get organization data for each event
    const eventsWithOrganizations = await Promise.all(
      events.map(async (event: any) => {
        // Find organization that has this event
        const organization = await Organization.findOne({
          events: event._id,
        });

        // Get organization user info
        let organizationName = "Unknown Organization";
        if (organization) {
          const orgUser = await User.findOne({
            data: organization._id,
            type: "organization",
          });
          organizationName =
            orgUser?.name || orgUser?.username || "Unknown Organization";
        }

        return {
          id: event._id.toString(),
          name: event.name,
          description: event.description,
          organization: organizationName,
          category: organization?.category || "General",
          location: event.location,
          date: event.startTime.toISOString().split("T")[0],
          time: event.startTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          maxCapacity: event.volunteerCap,
          currentJoined: event.joinedVolunteers?.length || 0,
          requiredSkills: event.requiredSkills,
          startTime: event.startTime,
          endTime: event.endTime,
          status:
            new Date() > event.endTime
              ? "completed"
              : new Date() > event.startTime
              ? "ongoing"
              : "upcoming",
        };
      })
    );

    return {
      success: true,
      events: eventsWithOrganizations,
    };
  } catch (error) {
    console.error("Error fetching my events:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: `Failed to fetch my events: ${errorMessage}` };
  }
}
