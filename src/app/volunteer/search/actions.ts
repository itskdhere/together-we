"use server";

import { dbConnect } from "@/lib/db";
import { Event } from "@/models/Events";
import { Organization } from "@/models/Organization";
import { User } from "@/models/User";

export async function searchEvents(searchQuery: string) {
  try {
    await dbConnect();

    const events = await Event.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .sort({ startTime: 1 })
      .lean();

    const eventsWithOrganizations = await Promise.all(
      events.map(async (event: any) => {
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
        };
      })
    );

    return {
      success: true,
      events: eventsWithOrganizations,
    };
  } catch (error) {
    console.error("Error searching events:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return { error: `Failed to search events: ${errorMessage}` };
  }
}
