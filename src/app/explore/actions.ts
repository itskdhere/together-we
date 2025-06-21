// "use server";

// import { dbConnect } from "@/lib/db";
// import { Event } from "@/models/Events";
// import { Organization } from "@/models/Organization";
// import { User } from "@/models/User";
// import { getUser } from "@civic/auth/nextjs";

// export async function getAllEvents() {
//   try {
//     await dbConnect();
//     console.log("Database connected for explore events");

//     // Get current user to check joined status (optional - for unauthenticated users)
//     const user = await getUser();
//     let currentVolunteerId = null;

//     if (user?.id && user?.email) {
//       const volunteerUser = await User.findOne({
//         civicId: user.id,
//         email: user.email,
//         type: "volunteer",
//         onboarded: true,
//       });
//       currentVolunteerId = volunteerUser?.data;
//     }

//     // Get all events sorted by start time
//     const events = await Event.find({})
//       .sort({ startTime: 1 }) // Sort by start time ascending
//       .lean();

//     // Get organization data for each event
//     const eventsWithOrganizations = await Promise.all(
//       events.map(async (event: any) => {
//         // Find organization that has this event
//         const organization = await Organization.findOne({
//           events: event._id,
//         });

//         // Get organization user info
//         let organizationName = "Unknown Organization";
//         if (organization) {
//           const orgUser = await User.findOne({
//             data: organization._id,
//             type: "organization",
//           });
//           organizationName =
//             orgUser?.name || orgUser?.username || "Unknown Organization";
//         }

//         // Check if current user has already joined this event
//         const isAlreadyJoined =
//           currentVolunteerId &&
//           event.joinedVolunteers?.some(
//             (volunteerId: any) =>
//               volunteerId.toString() === currentVolunteerId.toString()
//           );

//         // Parse required skills string to array
//         const requiredSkillsArray = event.requiredSkills
//           ? event.requiredSkills.split(",").map((skill: string) => skill.trim())
//           : [];

//         return {
//           id: event._id.toString(),
//           name: event.name,
//           description: event.description,
//           organization: organizationName,
//           category: organization?.category || "General",
//           location: event.location,
//           date: event.startTime.toISOString().split("T")[0], // Format as YYYY-MM-DD
//           time: event.startTime.toLocaleTimeString("en-US", {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//           }),
//           maxCapacity: event.volunteerCap,
//           currentJoined: event.joinedVolunteers?.length || 0,
//           requiredSkills: requiredSkillsArray,
//           startTime: event.startTime,
//           endTime: event.endTime,
//           isAlreadyJoined: isAlreadyJoined || false,
//         };
//       })
//     );

//     return {
//       success: true,
//       events: eventsWithOrganizations,
//     };
//   } catch (error) {
//     console.error("Error fetching all events:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     return { error: `Failed to fetch events: ${errorMessage}` };
//   }
// }

// export async function searchEvents(
//   searchQuery: string,
//   categoryFilter: string = "all"
// ) {
//   try {
//     await dbConnect();
//     console.log("Database connected for search events");

//     // Build search criteria
//     let searchCriteria: any = {};

//     // Add text search if query provided
//     if (searchQuery && searchQuery.trim() !== "") {
//       searchCriteria.$or = [
//         { name: { $regex: searchQuery, $options: "i" } },
//         { description: { $regex: searchQuery, $options: "i" } },
//         { location: { $regex: searchQuery, $options: "i" } },
//         { requiredSkills: { $regex: searchQuery, $options: "i" } },
//       ];
//     }

//     // Get events based on search criteria
//     const events = await Event.find(searchCriteria)
//       .sort({ startTime: 1 })
//       .lean();

//     // Get organization data and filter by category if needed
//     const eventsWithOrganizations = await Promise.all(
//       events.map(async (event: any) => {
//         const organization = await Organization.findOne({
//           events: event._id,
//         });

//         // Skip if category filter doesn't match
//         if (
//           categoryFilter !== "all" &&
//           organization?.category !== categoryFilter
//         ) {
//           return null;
//         }

//         let organizationName = "Unknown Organization";
//         if (organization) {
//           const orgUser = await User.findOne({
//             data: organization._id,
//             type: "organization",
//           });
//           organizationName =
//             orgUser?.name || orgUser?.username || "Unknown Organization";
//         }

//         // Parse required skills string to array
//         const requiredSkillsArray = event.requiredSkills
//           ? event.requiredSkills.split(",").map((skill: string) => skill.trim())
//           : [];

//         return {
//           id: event._id.toString(),
//           name: event.name,
//           description: event.description,
//           organization: organizationName,
//           category: organization?.category || "General",
//           location: event.location,
//           date: event.startTime.toISOString().split("T")[0],
//           time: event.startTime.toLocaleTimeString("en-US", {
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: true,
//           }),
//           maxCapacity: event.volunteerCap,
//           currentJoined: event.joinedVolunteers?.length || 0,
//           requiredSkills: requiredSkillsArray,
//           startTime: event.startTime,
//           endTime: event.endTime,
//         };
//       })
//     );

//     // Filter out null values (events that didn't match category filter)
//     const filteredEvents = eventsWithOrganizations.filter(
//       (event) => event !== null
//     );

//     return {
//       success: true,
//       events: filteredEvents,
//     };
//   } catch (error) {
//     console.error("Error searching events:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     return { error: `Failed to search events: ${errorMessage}` };
//   }
// }

// export async function joinEventFromExplore(eventId: string) {
//   try {
//     await dbConnect();
//     console.log("Database connected for joining event from explore");

//     const user = await getUser();
//     if (!user?.id || !user?.email) {
//       return { error: "Please sign in to join events" };
//     }

//     // Get volunteer user
//     const volunteerUser = await User.findOne({
//       civicId: user.id,
//       email: user.email,
//       type: "volunteer",
//       onboarded: true,
//     });

//     if (!volunteerUser) {
//       return { error: "Please complete volunteer onboarding first" };
//     }

//     // Get the event
//     const event = await Event.findById(eventId);
//     if (!event) {
//       return { error: "Event not found" };
//     }

//     // Check if already joined
//     const volunteerId = volunteerUser.data;
//     if (event.joinedVolunteers?.includes(volunteerId)) {
//       return { error: "Already joined this event" };
//     }

//     // Check if event is full
//     if (
//       event.joinedVolunteers &&
//       event.joinedVolunteers.length >= event.volunteerCap
//     ) {
//       return { error: "Event is full" };
//     }

//     // Add volunteer to event
//     await Event.findByIdAndUpdate(eventId, {
//       $push: { joinedVolunteers: volunteerId },
//     });

//     // Track experience for the volunteer
//     const { Volunteer } = await import("@/models/Volunteers");
//     await Volunteer.findByIdAndUpdate(volunteerId, {
//       $push: { experience: eventId },
//     });

//     return {
//       success: true,
//       message: "Successfully joined the event",
//       currentJoined: (event.joinedVolunteers?.length || 0) + 1,
//     };
//   } catch (error) {
//     console.error("Error joining event from explore:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     return { error: `Failed to join event: ${errorMessage}` };
//   }
// }
