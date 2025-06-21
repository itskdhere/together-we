"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Calendar,
  Target,
  TrendingUp,
  Plus,
  BarChart3,
  Activity,
  UserCheck,
  Clock,
  MapPin,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getOrganizationEvents,
  getOrganizationStats,
  deleteAllVolunteerOpportunities,
  deleteVolunteerOpportunity,
  getOrganizationVolunteers,
} from "../events/new/actions";
import { useUser } from "@civic/auth/react";

interface DashboardStats {
  totalVolunteers: number;
  activeOpportunities: number;
  completedProjects: number;
  totalHoursLogged: number;
  growthRate: number;
}

interface VolunteerOpportunity {
  id: string;
  title: string;
  date: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
  status: "active" | "full" | "completed";
  category: string;
  location: string;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  deadline: string;
}

interface Volunteer {
  id: string;
  name: string;
  username: string;
  email: string;
  skills: string;
  eventsJoined: number;
  completedEvents: number;
  totalHours: number;
  status: "active" | "completed";
  joinedDate: Date;
  bio: string;
}

interface VolunteerSummary {
  totalVolunteers: number;
  activeVolunteers: number;
  totalHours: number;
  averageEvents: number;
}

export default function OrganizationDashboard() {
  const { user, signOut } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [stats, setStats] = useState<DashboardStats>({
    totalVolunteers: 0,
    activeOpportunities: 0,
    completedProjects: 0,
    totalHoursLogged: 0,
    growthRate: 0,
  });
  const [recentOpportunities, setRecentOpportunities] = useState<
    VolunteerOpportunity[]
  >([]);
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [volunteerSummary, setVolunteerSummary] = useState<VolunteerSummary>({
    totalVolunteers: 0,
    activeVolunteers: 0,
    totalHours: 0,
    averageEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Fetching dashboard data...");

      // Fetch organization events
      const eventsResult = await getOrganizationEvents();
      console.log("Events result:", eventsResult);

      if (eventsResult.success) {
        // Transform events to match the interface
        const transformedEvents = eventsResult.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: new Date(event.startTime).toLocaleDateString(),
          volunteersNeeded: event.volunteersNeeded,
          volunteersRegistered: event.volunteersRegistered,
          status: event.status,
          category: "Community Service", // You might want to add category to the Event model
          location: event.location,
        }));
        console.log("Transformed events:", transformedEvents);
        setRecentOpportunities(transformedEvents.slice(0, 4)); // Show only recent 4
      }

      // Fetch organization stats
      const statsResult = await getOrganizationStats();
      console.log("Stats result:", statsResult);

      if (statsResult.success && statsResult.stats) {
        setStats(statsResult.stats);

        // Set goals based on current stats
        setActiveGoals([
          {
            id: "1",
            title: "Recruit 1000 Volunteers",
            progress: statsResult.stats.totalVolunteers,
            target: 1000,
            deadline: "2025-12-31",
          },
          {
            id: "2",
            title: "Complete 50 Projects",
            progress: statsResult.stats.completedProjects,
            target: 50,
            deadline: "2025-11-30",
          },
          {
            id: "3",
            title: "Log 5000 Volunteer Hours",
            progress: statsResult.stats.totalHoursLogged,
            target: 5000,
            deadline: "2025-12-31",
          },
        ]);
      }

      // Fetch volunteers data
      const volunteersResult = await getOrganizationVolunteers();
      console.log("Volunteers result:", volunteersResult);
      if (volunteersResult.success) {
        setVolunteers(volunteersResult.volunteers);
        if (volunteersResult.summary) {
          setVolunteerSummary(volunteersResult.summary);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllOpportunities = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL events? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      const result = await deleteAllVolunteerOpportunities();

      if (result.success) {
        // Refresh the dashboard data
        await fetchDashboardData();
        alert(`Successfully deleted ${result.deletedCount || 0} opportunities`);
      } else {
        alert(result.message || "Failed to delete opportunities");
      }
    } catch (error) {
      console.error("Error deleting all opportunities:", error);
      alert("An error occurred while deleting opportunities");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOpportunity = async (
    opportunityId: string,
    opportunityTitle: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${opportunityTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const result = await deleteVolunteerOpportunity(opportunityId);

      if (result.success) {
        // Refresh the dashboard data
        await fetchDashboardData();
        alert("Opportunity deleted successfully");
      } else {
        alert(result.message || "Failed to delete opportunity");
      }
    } catch (error) {
      console.error("Error deleting opportunity:", error);
      alert("An error occurred while deleting the opportunity");
    }
  };
  useEffect(() => {
    fetchDashboardData();

    // Check if we need to refresh (e.g., after creating an event)
    const shouldRefresh = searchParams.get("refresh");
    if (shouldRefresh) {
      // Remove the refresh parameter from URL without causing a navigation
      const url = new URL(window.location.href);
      url.searchParams.delete("refresh");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  // Add effect to listen for focus events to refresh data when returning to the page
  // useEffect(() => {
  //   const handleFocus = () => {
  //     fetchDashboardData();
  //   };

  //   window.addEventListener("focus", handleFocus);

  //   return () => {
  //     window.removeEventListener("focus", handleFocus);
  //   };
  // }, []);
  const getStatusBadge = (status: VolunteerOpportunity["status"]) => {
    const variants = {
      active: "default",
      full: "secondary",
      completed: "outline",
    } as const;

    const colors = {
      active: "bg-blue-600 text-blue-100",
      full: "bg-orange-600 text-orange-100",
      completed: "bg-green-600 text-green-100",
    } as const;

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status}
      </Badge>
    );
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 shadow-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">Unity</span>
            </div>

            {/* Logout Button */}
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
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            {" "}
            <div>
              <h1 className="text-3xl font-bold text-white">
                Hello, {user?.name || "Organization"}!
              </h1>
              <p className="text-gray-300 mt-1">
                Connect with volunteers and manage events
              </p>
            </div>{" "}
            <div className="flex gap-2">
              {" "}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDashboardData}
                disabled={loading}
                className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:text-white"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteAllOpportunities}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete All Event(s)
              </Button>
              {/* <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button> */}
              <Button
                size="sm"
                onClick={() => router.push("/organization/events/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </div>
          </div>{" "}
          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="volunteers"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
              >
                Volunteers
              </TabsTrigger>
            </TabsList>{" "}
            <TabsContent value="overview" className="space-y-6">
              <div className="text-center py-4 text-gray-400">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">
                            Total Volunteers
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {stats.totalVolunteers.toLocaleString()}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-blue-400" />
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                        <span className="text-green-400">
                          +{stats.growthRate}%
                        </span>
                        <span className="text-gray-300 ml-1">
                          from last month
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">
                            Active Events
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {stats.activeOpportunities}
                          </p>
                        </div>
                        <Calendar className="w-8 h-8 text-purple-400" />
                      </div>{" "}
                      <div className="mt-2 flex items-center text-sm text-gray-300">
                        <Activity className="w-4 h-4 mr-1" />
                        <span>
                          {Math.ceil(stats.activeOpportunities / 2)} this week
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">
                            Completed Projects
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {stats.completedProjects}
                          </p>
                        </div>
                        <Target className="w-8 h-8 text-green-400" />
                      </div>{" "}
                      <div className="mt-2 flex items-center text-sm text-gray-300">
                        <UserCheck className="w-4 h-4 mr-1" />
                        <span>
                          {Math.ceil(stats.completedProjects / 10)} this month
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">
                            Total Hours Logged
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {stats.totalHoursLogged.toLocaleString()}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-400" />
                      </div>{" "}
                      <div className="mt-2 flex items-center text-sm text-gray-300">
                        <BarChart3 className="w-4 h-4 mr-1" />
                        <span>
                          {Math.ceil(stats.totalHoursLogged / 7)} hours this
                          month
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>{" "}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Opportunities */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Recent Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOpportunities.map((opportunity) => (
                        <div
                          key={opportunity.id}
                          className="flex items-start justify-between p-4 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-white">
                              {opportunity.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-300">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {opportunity.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {opportunity.location}
                              </span>
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="text-gray-300">
                                {opportunity.volunteersRegistered}/
                                {opportunity.volunteersNeeded} volunteers
                              </span>
                              <Badge
                                variant="outline"
                                className="ml-2 text-xs border-gray-600 text-gray-300"
                              >
                                {opportunity.category}
                              </Badge>
                            </div>{" "}
                          </div>{" "}
                          <div className="ml-4 flex items-center gap-2">
                            {getStatusBadge(opportunity.status)}{" "}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteOpportunity(
                                  opportunity.id,
                                  opportunity.title
                                )
                              }
                              className="bg-red-900/40 text-red-300 border-red-700 hover:bg-red-900/60 hover:text-red-200 hover:border-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}{" "}
                    </div>{" "}
                    <Button
                      variant="outline"
                      className="w-full mt-4 bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:text-white hover:border-gray-500"
                      onClick={fetchDashboardData}
                    >
                      Refresh Events
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Goals */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Organization Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeGoals.map((goal) => (
                        <div key={goal.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-white">
                              {goal.title}
                            </h4>
                            <span className="text-sm text-gray-300">
                              {goal.progress.toLocaleString()} /{" "}
                              {goal.target.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            value={(goal.progress / goal.target) * 100}
                            className="bg-gray-700"
                          />
                          <p className="text-xs text-gray-400">
                            Due: {goal.deadline}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>{" "}
            <TabsContent value="volunteers">
              <div className="space-y-6">
                {/* Volunteer Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">
                            Total Volunteers
                          </p>
                          <p className="text-2xl font-bold text-blue-400">
                            {volunteerSummary.totalVolunteers}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">
                            Active Volunteers
                          </p>
                          <p className="text-2xl font-bold text-green-400">
                            {volunteerSummary.activeVolunteers}
                          </p>
                        </div>
                        <UserCheck className="w-8 h-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">
                            Total Hours
                          </p>
                          <p className="text-2xl font-bold text-orange-400">
                            {volunteerSummary.totalHours}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-300">
                            Avg Events/Volunteer
                          </p>
                          <p className="text-2xl font-bold text-purple-400">
                            {volunteerSummary.averageEvents}
                          </p>
                        </div>
                        <Activity className="w-8 h-8 text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Volunteers List */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Your Volunteers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {" "}
                    {loading ? (
                      <div className="text-center py-8">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-400">Loading volunteers...</p>
                      </div>
                    ) : volunteers.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Users className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                        <p>No volunteers have joined your events yet.</p>
                        <p className="text-sm">
                          Create events to attract volunteers!
                        </p>{" "}
                        <Button
                          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() =>
                            router.push("/organization/events/new")
                          }
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create Event
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {volunteers.map((volunteer) => (
                          <div
                            key={volunteer.id}
                            className="border border-gray-600 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                                    <span className="font-semibold text-blue-400">
                                      {volunteer.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-white">
                                      {volunteer.name}
                                    </h4>
                                    <p className="text-sm text-gray-300">
                                      @{volunteer.username}
                                    </p>
                                  </div>
                                  <Badge
                                    variant={
                                      volunteer.status === "active"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className={
                                      volunteer.status === "active"
                                        ? "bg-green-700 text-green-100"
                                        : "bg-gray-700 text-gray-300"
                                    }
                                  >
                                    {volunteer.status}
                                  </Badge>
                                </div>

                                {volunteer.bio && (
                                  <p className="text-sm text-gray-300 mb-3">
                                    {volunteer.bio}
                                  </p>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-300">
                                      Events Joined:
                                    </span>
                                    <span className="ml-2 text-blue-400">
                                      {volunteer.eventsJoined}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-300">
                                      Completed:
                                    </span>
                                    <span className="ml-2 text-green-400">
                                      {volunteer.completedEvents}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-300">
                                      Hours:
                                    </span>
                                    <span className="ml-2 text-orange-400">
                                      {volunteer.totalHours}h
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-300">
                                      Joined:
                                    </span>
                                    <span className="ml-2 text-gray-300">
                                      {new Date(
                                        volunteer.joinedDate
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>

                                {volunteer.skills && (
                                  <div className="mt-3">
                                    <span className="text-sm font-medium text-gray-300">
                                      Skills:
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {volunteer.skills
                                        .split(",")
                                        .map((skill, index) => (
                                          <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs border-gray-600 text-gray-300"
                                          >
                                            {skill.trim()}
                                          </Badge>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
