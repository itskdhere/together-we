// import { Organization } from "@/models/Organization";
// import { User } from "@/models/User";
// import { getUser } from "@civic/auth/nextjs";
// import { dbConnect } from "@/lib/db";

// export async function getOrganizationData() {
//   try {
//     await dbConnect();
//     console.log("Database connected successfully");

//     const user = await getUser();
//     console.log("Civic user:", user);

//     if (!user?.id || !user?.email) {
//       return { error: "Not authenticated" };
//     }

//     // Get organization user
//     const organizationUser = await User.findOne({
//       civicId: user.id,
//       email: user.email,
//       type: "organization",
//       onboarded: true,
//     });

//     console.log("Organization user found:", organizationUser);

//     if (!organizationUser) {
//       return { error: "Organization user not found" };
//     }

//     // Get organization data
//     const organizationData = await Organization.findById(organizationUser.data);
//     console.log("Organization data found:", organizationData);

//     if (!organizationData) {
//       return { error: "Organization data not found" };
//     }

//     return {
//       success: true,
//       user: {
//         id: organizationUser._id.toString(),
//         email: organizationUser.email,
//         username: organizationUser.username,
//         civicId: organizationUser.civicId,
//         type: organizationUser.type,
//         dataId: organizationUser.data?.toString(),
//       },
//       organization: {
//         id: organizationData._id.toString(),
//         category: organizationData.category,
//         locality: organizationData.locality,
//         eventsCount: organizationData.events?.length || 0,
//         eventIds:
//           organizationData.events?.map((id: any) => id.toString()) || [],
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching organization:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error";
//     return { error: `Failed to fetch organization: ${errorMessage}` };
//   }
// }
