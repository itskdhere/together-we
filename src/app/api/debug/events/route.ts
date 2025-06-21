import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Event } from "@/models/Events";
import { Organization } from "@/models/Organization";
import { User } from "@/models/User";
import { getUser } from "@civic/auth/nextjs";

export async function GET() {
  try {
    await dbConnect();
    
    const user = await getUser();
    if (!user?.id || !user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get all events
    const allEvents = await Event.find({});
    
    // Get organization user
    const organizationUser = await User.findOne({
      civicId: user.id,
      email: user.email,
      type: "organization",
      onboarded: true,
    });

    let organizationData = null;
    if (organizationUser) {
      organizationData = await Organization.findById(organizationUser.data);
    }

    return NextResponse.json({
      success: true,
      debug: {
        totalEvents: allEvents.length,
        allEvents: allEvents.map(e => ({
          id: e._id.toString(),
          name: e.name,
          location: e.location,
          startTime: e.startTime,
        })),
        organizationUser: organizationUser ? {
          id: organizationUser._id.toString(),
          email: organizationUser.email,
          type: organizationUser.type,
          dataId: organizationUser.data?.toString(),
        } : null,
        organization: organizationData ? {
          id: organizationData._id.toString(),
          eventsCount: organizationData.events?.length || 0,
          eventIds: organizationData.events?.map((id: any) => id.toString()) || [],
        } : null,
      }
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
}
