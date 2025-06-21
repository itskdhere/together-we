"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser } from "@civic/auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Home,
  Search,
  User,
  Calendar,
  MapPin,
  Clock,
  Users,
  Heart,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  getFeaturedEvents,
  getVolunteerData,
  getVolunteerStats,
  joinEvent,
} from "./actions";

interface EventData {
  id: string;
  name: string;
  organization: string;
  category: string;
  location: string;
  date: string;
  time: string;
  maxCapacity: number;
  currentJoined: number;
  description: string;
  requiredSkills: string;
  isAlreadyJoined: boolean;
}

export default function VolunteerDashboard() {
  const router = useRouter();
  const { signOut } = useUser();
  const [featuredEvents, setFeaturedEvents] = useState<EventData[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    eventsJoined: 0,
    hoursVolunteered: 0,
    organizationsHelped: 0,
  });
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all data in parallel
      const [eventsResult, volunteerResult, statsResult] = await Promise.all([
        getFeaturedEvents(),
        getVolunteerData(),
        getVolunteerStats(),
      ]);

      if (eventsResult.success) {
        setFeaturedEvents(eventsResult.events);
      } else {
        toast.error(eventsResult.error || "Failed to load events");
      }

      if (volunteerResult.success) {
        setUserData(volunteerResult);
      } else {
        toast.error(volunteerResult.error || "Failed to load volunteer data");
      }

      if (statsResult.success) {
        setStats(statsResult.stats);
      } else {
        toast.error(statsResult.error || "Failed to load stats");
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };
  const handleJoinEvent = async (eventId: string) => {
    try {
      const result = await joinEvent(eventId);

      if (result.success) {
        toast.success(result.message);
        // Update the event in the local state
        setFeaturedEvents((prev) =>
          prev.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  currentJoined: result.currentJoined,
                  isAlreadyJoined: true,
                }
              : event
          )
        );
        // Refresh stats
        const statsResult = await getVolunteerStats();
        if (statsResult.success) {
          setStats(statsResult.stats);
        }
      } else {
        toast.error(result.error || "Failed to join event");
      }
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("Failed to join event");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Environment: "bg-green-100 text-green-800",
      "Community Service": "bg-blue-100 text-blue-800",
      "Social Care": "bg-purple-100 text-purple-800",
      Education: "bg-yellow-100 text-yellow-800",
      Health: "bg-red-100 text-red-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div> */}
              <span className="text-xl font-bold text-gray-900">Unity</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <Link
                href="/volunteer/dashboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === "dashboard"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/volunteer/search"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === "search"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("search")}
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Link>
              <Link
                href="/volunteer/profile"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-400 hover:bg-gray-50"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>{" "}
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData?.user?.name || "Volunteer"}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to make a difference in your community today?
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading dashboard...</span>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              My Quick Stats
            </h2>
            <section className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Heart className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.eventsJoined}
                        </p>
                        <p className="text-sm text-gray-600">Events Joined</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.hoursVolunteered}
                        </p>
                        <p className="text-sm text-gray-600">
                          Hours Volunteered
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.organizationsHelped}
                        </p>
                        <p className="text-sm text-gray-600">
                          Organizations Helped
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Featured Events Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Featured Events
                </h2>
                {/* <Button
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <span>View All</span>
                  <ChevronRight className="h-4 w-4" />
                </Button> */}
              </div>

              {featuredEvents.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Events Available
                    </h3>
                    <p className="text-gray-600">
                      Check back later for new volunteer opportunities!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="hover:shadow-lg transition-shadow duration-200"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg font-semibold line-clamp-2">
                            {event.name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 font-medium">
                            {event.organization}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`w-fit ${getCategoryColor(
                            event.category
                          )}`}
                        >
                          {event.category}
                        </Badge>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>
                              {event.currentJoined}/{event.maxCapacity} joined
                            </span>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Capacity</span>
                            <span>
                              {Math.round(
                                (event.currentJoined / event.maxCapacity) * 100
                              )}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${
                                  (event.currentJoined / event.maxCapacity) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>{" "}
                        <Button
                          className={`w-full ${
                            event.isAlreadyJoined
                              ? "bg-green-500 hover:bg-green-600"
                              : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                          }`}
                          onClick={() => handleJoinEvent(event.id)}
                          disabled={
                            event.currentJoined >= event.maxCapacity ||
                            event.isAlreadyJoined
                          }
                        >
                          {event.isAlreadyJoined
                            ? "Already Joined"
                            : event.currentJoined >= event.maxCapacity
                            ? "Event Full"
                            : "Join Event"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
