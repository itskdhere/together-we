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
  Bell,
  Plus,
  BarChart3,
  Activity,
  Heart,
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

export default function OrganizationDashboard() {
  const { user } = useUser();
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
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAllOpportunities = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete ALL volunteer opportunities? This action cannot be undone."
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
      active: "text-blue-600",
      full: "text-orange-600",
      completed: "text-green-600",
    } as const;

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hello, {user?.name || "Organization"}!
            </h1>
            <p className="text-gray-600 mt-1">
              Connect with volunteers and manage opportunities
            </p>
          </div>{" "}
          <div className="flex gap-2">
            {" "}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              disabled={loading}
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
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/organization/events/new")}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Opportunity
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Volunteers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalVolunteers.toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="mt-2 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600">+{stats.growthRate}%</span>
                <span className="text-gray-600 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Opportunities
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeOpportunities}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>{" "}
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <Activity className="w-4 h-4 mr-1" />
                <span>
                  {Math.ceil(stats.activeOpportunities / 2)} this week
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Completed Projects
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.completedProjects}
                  </p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>{" "}
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <UserCheck className="w-4 h-4 mr-1" />
                <span>
                  {Math.ceil(stats.completedProjects / 10)} this month
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Hours Logged
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalHoursLogged.toLocaleString()}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>{" "}
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <BarChart3 className="w-4 h-4 mr-1" />
                <span>
                  {Math.ceil(stats.totalHoursLogged / 7)} hours this month
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Opportunities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Volunteer Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOpportunities.map((opportunity) => (
                      <div
                        key={opportunity.id}
                        className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {opportunity.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
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
                            <span className="text-gray-600">
                              {opportunity.volunteersRegistered}/
                              {opportunity.volunteersNeeded} volunteers
                            </span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {opportunity.category}
                            </Badge>
                          </div>{" "}
                        </div>
                        <div className="ml-4 flex items-center gap-2">
                          {getStatusBadge(opportunity.status)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeleteOpportunity(
                                opportunity.id,
                                opportunity.title
                              )
                            }
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>{" "}
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={fetchDashboardData}
                  >
                    Refresh Opportunities
                  </Button>
                </CardContent>
              </Card>

              {/* Active Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Organization Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeGoals.map((goal) => (
                      <div key={goal.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{goal.title}</h4>
                          <span className="text-sm text-gray-600">
                            {goal.progress.toLocaleString()} /{" "}
                            {goal.target.toLocaleString()}
                          </span>
                        </div>
                        <Progress value={(goal.progress / goal.target) * 100} />
                        <p className="text-xs text-gray-600">
                          Due: {goal.deadline}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="opportunities">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Opportunities Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Manage all your volunteer opportunities here</p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push("/organization/events/new")}
                  >
                    Create New Opportunity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volunteers">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>View and manage your volunteers</p>
                  <Button variant="outline" className="mt-4">
                    View All Volunteers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Track volunteer engagement and impact</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
