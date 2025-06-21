"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Home,
  Search,
  User,
  Edit,
  Save,
  Heart,
  Award,
  Calendar,
  Clock,
  Loader2,
} from "lucide-react";
import {
  getProfileData,
  updateProfileData,
  getRecentActivity,
} from "@/app/volunteer/profile/actions";
import { toast } from "sonner";
import { useUser } from "@civic/auth/react";

export default function ProfilePage() {
  const { signOut } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    skills: "",
  });
  const [activities, setActivities] = useState<
    {
      id: string;
      title: string;
      timeAgo: string;
      type: string;
    }[]
  >([]);
  const [stats, setStats] = useState({
    eventsJoined: 0,
    hoursVolunteered: 0,
    organizationsHelped: 0,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch profile data
        const profileResult = await getProfileData();
        if (profileResult.success) {
          console.log(profileResult.profile);
          setProfile(profileResult.profile);
        } else {
          toast.error(profileResult.error);
        }

        // Fetch activity data
        const activityResult = await getRecentActivity();
        if (activityResult.success) {
          setActivities(activityResult.activities);
          setStats(activityResult.stats);
        } else {
          toast.error(activityResult.error);
        }
      } catch {
        toast.error("Failed to load data");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsEditing(false);
    const result = await updateProfileData(profile);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error);
    }
  };
  if (loading) {
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
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="w-full mt-24 flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-8 animate-spin text-blue-400" />
              <h3 className="font-semibold text-xl text-white">Loading...</h3>
            </div>
          </div>
        </main>
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
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {" "}
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  My Profile
                </h1>
                <p className="text-gray-400">
                  Manage your volunteer profile and preferences.
                </p>
              </div>
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className={
                  isEditing
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    : "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600 hover:text-white"
                }
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {" "}
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    ) : (
                      <p className="text-white">{profile.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <p className="text-white">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Bio
                    </label>
                    {isEditing ? (
                      <Textarea
                        value={profile.bio}
                        onChange={(e) =>
                          setProfile({ ...profile, bio: e.target.value })
                        }
                        rows={3}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    ) : (
                      <p className="text-white">{profile.bio}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Skills & Interests
                    </label>
                    {isEditing ? (
                      <Textarea
                        value={profile.skills}
                        onChange={(e) =>
                          setProfile({ ...profile, skills: e.target.value })
                        }
                        rows={2}
                        placeholder="Enter skills separated by commas"
                        className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                      />
                    ) : (
                      <p className="text-white">{profile.skills}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>{" "}
            {/* Stats and Achievements */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Volunteer Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-900/30 rounded-lg">
                      <Heart className="h-5 w-5 text-green-400" />
                    </div>{" "}
                    <div>
                      <p className="text-xl font-bold text-white">
                        {stats.eventsJoined}
                      </p>
                      <p className="text-xs text-gray-400">Events Joined</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-900/30 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">
                        {stats.hoursVolunteered}
                      </p>
                      <p className="text-xs text-gray-400">Hours Volunteered</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-900/30 rounded-lg">
                      <Award className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">
                        {stats.organizationsHelped}
                      </p>
                      <p className="text-xs text-gray-400">
                        Organizations Helped
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>{" "}
              {/* Recent Activity */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>{" "}
                <CardContent className="space-y-3">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-3"
                      >
                        <div
                          className={`p-1 rounded ${
                            activity.type === "completed"
                              ? "bg-green-900/30"
                              : activity.type === "joined"
                              ? "bg-blue-900/30"
                              : "bg-purple-900/30"
                          }`}
                        >
                          {activity.type === "completed" ? (
                            <Award
                              className={`h-3 w-3 ${
                                activity.type === "completed"
                                  ? "text-green-400"
                                  : activity.type === "joined"
                                  ? "text-blue-400"
                                  : "text-purple-400"
                              }`}
                            />
                          ) : (
                            <Calendar
                              className={`h-3 w-3 ${
                                activity.type === "completed"
                                  ? "text-green-400"
                                  : activity.type === "joined"
                                  ? "text-blue-400"
                                  : "text-purple-400"
                              }`}
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {activity.timeAgo}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-400">
                        No recent activity
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
