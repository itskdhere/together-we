"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
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
                <SearchIcon className="h-4 w-4" />
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
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Events
          </h1>
          <p className="text-gray-600">
            Find volunteer opportunities that match your interests and skills.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search events, organizations, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
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
        </div>

        {/* Empty State */}
        {loading ? (
          <div className="text-center">
            <p>Loading...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.organization}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {event.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      {event.currentJoined} / {event.maxCapacity}
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Search for Events
              </h3>
              <p className="text-gray-600 mb-4">
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
