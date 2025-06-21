"use server";

import { getUser } from "@civic/auth/nextjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { Organization } from "@/models/Organization";
import { Event } from "@/models/Events";

export interface CreateVolunteerOpportunityInput {
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  isRemote: boolean;
  onlineInstructions?: string;
  volunteersNeeded: number;
  skillsRequired: string[];
  ageRequirement?: string;
  backgroundCheckRequired: boolean;
  trainingProvided: boolean;
  applicationDeadline?: string;
  tags: string[];
  isRecurring: boolean;
  recurringPattern?: string;
  contactEmail: string;
  contactPhone?: string;
}

export async function createVolunteerOpportunity(
  data: CreateVolunteerOpportunityInput
) {
  try {
    await dbConnect();

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { success: false, message: "Not authenticated" };
    }

    // Find the organization user
    const organizationUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "organization",
      onboarded: true,
    });

    if (!organizationUser) {
      return {
        success: false,
        message: "Organization not found or not onboarded",
      };
    }

    // Create start and end DateTime objects
    const startDateTime = new Date(`${data.date}T${data.startTime}`);
    const endDateTime = data.endTime
      ? new Date(`${data.date}T${data.endTime}`)
      : new Date(startDateTime.getTime() + 3 * 60 * 60 * 1000); // Default 3 hours if no end time

    // Prepare required skills as comma-separated string (matching the model)
    const requiredSkillsString = data.skillsRequired.join(", ");

    // Create the event/opportunity
    const newEvent = new Event({
      name: data.title,
      description: data.description,
      volunteerCap: data.volunteersNeeded,
      location: data.isRemote ? "Remote/Virtual" : data.location,
      requiredSkills: requiredSkillsString,
      startTime: startDateTime,
      endTime: endDateTime,
      joinedVolunteers: [], // Empty array initially
    });
    await newEvent.save();
    console.log("Created new event:", newEvent._id, newEvent.name);

    // Add the event to the organization's events array
    const organization = await Organization.findById(organizationUser.data);
    if (organization) {
      organization.events = organization.events || [];
      organization.events.push(newEvent._id);
      await organization.save();
      console.log(
        "Added event to organization. Total events:",
        organization.events.length
      );
    } else {
      console.log("Organization not found for user:", organizationUser.data);
    }

    return {
      success: true,
      message: "Volunteer opportunity created successfully",
      eventId: newEvent._id.toString(),
    };
  } catch (error) {
    console.error("Error creating volunteer opportunity:", error);
    return {
      success: false,
      message: "Failed to create volunteer opportunity. Please try again.",
    };
  }
}

export async function getOrganizationEvents() {
  try {
    await dbConnect();

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { success: false, message: "Not authenticated", events: [] };
    }

    console.log("Fetching events for user:", user.email);

    // Find the organization user
    const organizationUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "organization",
      onboarded: true,
    });

    if (!organizationUser) {
      console.log("Organization user not found");
      return { success: false, message: "Organization not found", events: [] };
    }

    console.log("Organization user found:", organizationUser._id);
    console.log("Organization data ID:", organizationUser.data); // Get the organization and populate events
    const organization = await Organization.findById(
      organizationUser.data
    ).populate({
      path: "events",
      model: "Event",
    });

    if (!organization) {
      console.log("Organization document not found");
      return { success: false, message: "Organization not found", events: [] };
    }

    let events = organization.events || [];
    console.log("Found organization:", organization._id);
    console.log("Events count:", events.length);
    console.log("Raw events:", events);

    // If populate didn't work properly, try to fetch events manually
    if (
      events.length === 0 &&
      organization.events &&
      organization.events.length > 0
    ) {
      console.log("Populate might have failed, trying manual fetch...");
      const eventIds = organization.events;
      events = await Event.find({ _id: { $in: eventIds } });
      console.log("Manually fetched events:", events.length);
    }

    // Format events for frontend
    const formattedEvents = events.map((event: any) => {
      console.log("Formatting event:", event);
      return {
        id: event._id.toString(),
        title: event.name,
        description: event.description,
        volunteersNeeded: event.volunteerCap,
        volunteersRegistered: event.joinedVolunteers
          ? event.joinedVolunteers.length
          : 0,
        location: event.location,
        requiredSkills: event.requiredSkills,
        startTime: event.startTime,
        endTime: event.endTime,
        status:
          event.joinedVolunteers?.length >= event.volunteerCap
            ? "full"
            : new Date(event.endTime) < new Date()
            ? "completed"
            : "active",
      };
    });

    console.log("Formatted events:", formattedEvents);

    return {
      success: true,
      events: formattedEvents,
    };
  } catch (error) {
    console.error("Error fetching organization events:", error);
    return {
      success: false,
      message: "Failed to fetch events",
      events: [],
    };
  }
}

export async function getOrganizationStats() {
  try {
    await dbConnect();

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { success: false, message: "Not authenticated" };
    }

    // Find the organization user
    const organizationUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "organization",
      onboarded: true,
    });

    if (!organizationUser) {
      return { success: false, message: "Organization not found" };
    } // Get the organization and populate events with joined volunteers
    const organization = await Organization.findById(
      organizationUser.data
    ).populate({
      path: "events",
      model: "Event",
      populate: {
        path: "joinedVolunteers",
        model: "Volunteer",
      },
    });

    if (!organization) {
      return { success: false, message: "Organization not found" };
    }

    const events = organization.events || [];

    // Calculate statistics
    const totalVolunteers = new Set();
    let activeOpportunities = 0;
    let completedProjects = 0;
    let totalHoursLogged = 0;

    events.forEach((event: any) => {
      // Count unique volunteers across all events
      if (event.joinedVolunteers) {
        event.joinedVolunteers.forEach((volunteer: any) => {
          totalVolunteers.add(volunteer._id.toString());
        });
      }

      // Count active vs completed opportunities
      if (new Date(event.endTime) < new Date()) {
        completedProjects++;
        // Estimate hours logged (difference between start and end time * number of volunteers)
        const duration =
          (new Date(event.endTime).getTime() -
            new Date(event.startTime).getTime()) /
          (1000 * 60 * 60);
        const volunteersCount = event.joinedVolunteers
          ? event.joinedVolunteers.length
          : 0;
        totalHoursLogged += duration * volunteersCount;
      } else {
        activeOpportunities++;
      }
    });

    return {
      success: true,
      stats: {
        totalVolunteers: totalVolunteers.size,
        activeOpportunities,
        completedProjects,
        totalHoursLogged: Math.round(totalHoursLogged),
        growthRate: 18.5, // This would need to be calculated based on historical data
      },
    };
  } catch (error) {
    console.error("Error fetching organization stats:", error);
    return {
      success: false,
      message: "Failed to fetch statistics",
    };
  }
}

export async function deleteVolunteerOpportunity(eventId: string) {
  try {
    await dbConnect();

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { success: false, message: "Not authenticated" };
    }

    // Find the organization user
    const organizationUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "organization",
      onboarded: true,
    });

    if (!organizationUser) {
      return { success: false, message: "Organization not found" };
    }

    // Find and delete the event
    const event = await Event.findById(eventId);
    if (!event) {
      return { success: false, message: "Event not found" };
    }

    // Remove event from organization's events array
    const organization = await Organization.findById(organizationUser.data);
    if (organization && organization.events) {
      organization.events = organization.events.filter(
        (id: any) => id.toString() !== eventId
      );
      await organization.save();
    }

    // Delete the event
    await Event.findByIdAndDelete(eventId);

    return {
      success: true,
      message: "Volunteer opportunity deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting volunteer opportunity:", error);
    return {
      success: false,
      message: "Failed to delete volunteer opportunity",
    };
  }
}

export async function updateVolunteerOpportunity(
  eventId: string,
  data: Partial<CreateVolunteerOpportunityInput>
) {
  try {
    await dbConnect();

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { success: false, message: "Not authenticated" };
    }

    // Find the organization user
    const organizationUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "organization",
      onboarded: true,
    });

    if (!organizationUser) {
      return { success: false, message: "Organization not found" };
    }

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return { success: false, message: "Event not found" };
    }

    // Update event fields
    const updateData: any = {};

    if (data.title) updateData.name = data.title;
    if (data.description) updateData.description = data.description;
    if (data.volunteersNeeded) updateData.volunteerCap = data.volunteersNeeded;
    if (data.location !== undefined) {
      updateData.location = data.isRemote ? "Remote/Virtual" : data.location;
    }
    if (data.skillsRequired) {
      updateData.requiredSkills = data.skillsRequired.join(", ");
    }
    if (data.date && data.startTime) {
      updateData.startTime = new Date(`${data.date}T${data.startTime}`);
    }
    if (data.date && data.endTime) {
      updateData.endTime = new Date(`${data.date}T${data.endTime}`);
    }

    await Event.findByIdAndUpdate(eventId, updateData);

    return {
      success: true,
      message: "Volunteer opportunity updated successfully",
    };
  } catch (error) {
    console.error("Error updating volunteer opportunity:", error);
    return {
      success: false,
      message: "Failed to update volunteer opportunity",
    };
  }
}

export async function deleteAllVolunteerOpportunities() {
  try {
    await dbConnect();

    const user = await getUser();
    if (!user?.id || !user?.email) {
      return { success: false, message: "Not authenticated" };
    }

    // Find the organization user
    const organizationUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "organization",
      onboarded: true,
    });

    if (!organizationUser) {
      return { success: false, message: "Organization not found" };
    }

    // Find the organization and get all events
    const organization = await Organization.findById(organizationUser.data);
    if (
      !organization ||
      !organization.events ||
      organization.events.length === 0
    ) {
      return { success: true, message: "No opportunities to delete" };
    }

    // Delete all events
    const eventIds = organization.events;
    await Event.deleteMany({ _id: { $in: eventIds } });

    // Clear the events array from organization
    organization.events = [];
    await organization.save();

    console.log(
      `Deleted ${eventIds.length} volunteer opportunities for organization ${organization._id}`
    );

    return {
      success: true,
      message: `Successfully deleted ${eventIds.length} volunteer opportunities`,
      deletedCount: eventIds.length,
    };
  } catch (error) {
    console.error("Error deleting all volunteer opportunities:", error);
    return {
      success: false,
      message: "Failed to delete volunteer opportunities",
    };
  }
}
