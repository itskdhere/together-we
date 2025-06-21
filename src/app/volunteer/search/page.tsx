"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Home,
  Search as SearchIcon,
  User,
  Calendar,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import { searchEvents } from "./actions";
import { toast } from "sonner";
import { useUser } from "@civic/auth/react";

interface Event {
  id: string;
  name: string;
  description: string;
  organization: string;
  category: string;
  location: string;
  date: string;
  time: string;
  maxCapacity: number;
  currentJoined: number;
  requiredSkills: string[];
}

export default function SearchPage() {
  const { signOut } = useUser();
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    setLoading(true);
    const result = await searchEvents(searchQuery);
    if (result.success) {
      setEvents(result.events);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
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
                <SearchIcon className="h-4 w-4" />
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
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Search Events</h1>
          <p className="text-gray-400">
            Find volunteer opportunities that match your interests and skills.
          </p>
        </div>
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-4">
            {" "}
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search events, organizations, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="w-full bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <SearchIcon className="h-4 w-4 mr-2" />
              {loading ? "Searching..." : "Search"}
            </Button>
            {/* <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button> */}
          </div>
        </div>{" "}
        {/* Empty State */}
        {loading ? (
          <div className="text-center">
            <p className="text-gray-400">Loading...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {" "}
            {events.map((event) => (
              <Card
                key={event.id}
                className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow duration-200"
              >
                <CardHeader>
                  <CardTitle className="text-white">{event.name}</CardTitle>
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
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">
                    {event.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      {event.currentJoined} / {event.maxCapacity} joined
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 bg-gray-800 border-gray-700">
            <CardContent>
              <SearchIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Search for Events
              </h3>
              <p className="text-gray-400 mb-4">
                Enter keywords to find volunteer opportunities near you.
              </p>
              <p className="text-sm text-gray-500">
                Try searching for "environment", "community", or your city name.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
