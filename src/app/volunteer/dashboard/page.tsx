"use client";

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
      Environment: "bg-green-900/30 text-green-400 border-green-700",
      "Community Service": "bg-blue-900/30 text-blue-400 border-blue-700",
      "Social Care": "bg-purple-900/30 text-purple-400 border-purple-700",
      Education: "bg-yellow-900/30 text-yellow-400 border-yellow-700",
      Health: "bg-red-900/30 text-red-400 border-red-700",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-700 text-gray-300 border-gray-600"
    );
  };
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 shadow-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              {/* <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div> */}
              <span className="text-xl font-bold text-white">Unity</span>
            </div>{" "}
            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <Link
                href="/volunteer/dashboard"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === "dashboard"
                    ? "text-blue-400 bg-blue-900/30"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
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
                    ? "text-blue-400 bg-blue-900/30"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
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
                    ? "text-blue-400 bg-blue-900/30"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
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
                className="text-red-400 hover:text-red-300 hover:bg-gray-700"
                onClick={signOut}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>{" "}
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {" "}
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {userData?.user?.name || "Volunteer"}! 👋
          </h1>
          <p className="text-gray-400">
            Ready to make a difference in your community today?
          </p>
        </div>{" "}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-400">Loading dashboard...</span>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <h2 className="text-2xl font-semibold text-white mb-6">
              My Quick Stats
            </h2>{" "}
            <section className="mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-900/30 rounded-lg">
                        <Heart className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {stats.eventsJoined}
                        </p>
                        <p className="text-sm text-gray-400">Events Joined</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-900/30 rounded-lg">
                        <Clock className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {stats.hoursVolunteered}
                        </p>
                        <p className="text-sm text-gray-400">
                          Hours Volunteered
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-900/30 rounded-lg">
                        <Users className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {stats.organizationsHelped}
                        </p>
                        <p className="text-sm text-gray-400">
                          Organizations Helped
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>{" "}
            {/* Featured Events Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">
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
                <Card className="text-center py-12 bg-gray-800 border-gray-700">
                  <CardContent>
                    <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Events Available
                    </h3>
                    <p className="text-gray-400">
                      Check back later for new volunteer opportunities!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="hover:shadow-lg transition-shadow duration-200 bg-gray-800 border-gray-700"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg font-semibold line-clamp-2 text-white">
                            {event.name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400 font-medium">
                            {event.organization}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`w-fit border ${getCategoryColor(
                            event.category
                          )}`}
                        >
                          {event.category}
                        </Badge>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <Users className="h-4 w-4" />
                            <span>
                              {event.currentJoined}/{event.maxCapacity} joined
                            </span>
                          </div>{" "}
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
                          <div className="w-full bg-gray-700 rounded-full h-2">
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
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
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
