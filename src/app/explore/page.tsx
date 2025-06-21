// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Calendar,
//   Clock,
//   MapPin,
//   Users,
//   Search,
//   Filter,
//   Heart,
//   User,
//   Home,
//   Loader2,
// } from "lucide-react";
// import Link from "next/link";
// import { toast } from "sonner";
// import { getAllEvents, joinEventFromExplore } from "./actions";

// interface Event {
//   id: string;
//   name: string;
//   description: string;
//   organization: string;
//   category: string;
//   location: string;
//   date: string;
//   time: string;
//   maxCapacity: number;
//   currentJoined: number;
//   requiredSkills: string[];
//   startTime: string;
//   endTime: string;
//   isAlreadyJoined?: boolean;
// }

// export default function ExplorePage() {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [sortBy, setSortBy] = useState("date");
//   const [joiningEventId, setJoiningEventId] = useState<string | null>(null);

//   const categories = [
//     { value: "all", label: "All Categories" },
//     { value: "Environment", label: "Environment" },
//     { value: "Community Service", label: "Community Service" },
//     { value: "Education", label: "Education" },
//     { value: "Animal Welfare", label: "Animal Welfare" },
//     { value: "Healthcare", label: "Healthcare" },
//     { value: "Arts & Culture", label: "Arts & Culture" },
//   ];

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoading(true);
//       try {
//         const result = await getAllEvents();
//         if (result.success && result.events) {
//           setEvents(result.events);
//           setFilteredEvents(result.events);
//         } else {
//           toast.error(result.error || "Failed to load events");
//         }
//       } catch {
//         toast.error("Failed to load events");
//       }
//       setLoading(false);
//     };

//     fetchEvents();
//   }, []);

//   useEffect(() => {
//     let filtered = events;

//     // Search filter
//     if (searchQuery) {
//       filtered = filtered.filter(
//         (event) =>
//           event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           event.organization
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase()) ||
//           event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           event.requiredSkills.some((skill) =>
//             skill.toLowerCase().includes(searchQuery.toLowerCase())
//           )
//       );
//     }

//     // Category filter
//     if (categoryFilter !== "all") {
//       filtered = filtered.filter((event) => event.category === categoryFilter);
//     }

//     // Sort
//     filtered = [...filtered].sort((a, b) => {
//       switch (sortBy) {
//         case "date":
//           return (
//             new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
//           );
//         case "capacity":
//           return (
//             b.maxCapacity - b.currentJoined - (a.maxCapacity - a.currentJoined)
//           );
//         case "organization":
//           return a.organization.localeCompare(b.organization);
//         default:
//           return 0;
//       }
//     });

//     setFilteredEvents(filtered);
//   }, [events, searchQuery, categoryFilter, sortBy]);

//   const getCategoryColor = (category: string) => {
//     const colors: { [key: string]: string } = {
//       Environment: "bg-green-100 text-green-800",
//       "Community Service": "bg-blue-100 text-blue-800",
//       Education: "bg-purple-100 text-purple-800",
//       "Animal Welfare": "bg-orange-100 text-orange-800",
//       Healthcare: "bg-red-100 text-red-800",
//       "Arts & Culture": "bg-pink-100 text-pink-800",
//     };
//     return colors[category] || "bg-gray-100 text-gray-800";
//   };

//   const getAvailabilityColor = (current: number, max: number) => {
//     const ratio = current / max;
//     if (ratio >= 0.9) return "text-red-600";
//     if (ratio >= 0.7) return "text-orange-600";
//     return "text-green-600";
//   };

//   const handleJoinEvent = async (eventId: string) => {
//     setJoiningEventId(eventId);
//     try {
//       const result = await joinEventFromExplore(eventId);
//       if (result.success) {
//         toast.success(result.message);
//         // Update the event in the local state
//         setEvents((prevEvents) =>
//           prevEvents.map((event) =>
//             event.id === eventId
//               ? {
//                   ...event,
//                   currentJoined: result.currentJoined!,
//                   isAlreadyJoined: true,
//                 }
//               : event
//           )
//         );
//         setFilteredEvents((prevEvents) =>
//           prevEvents.map((event) =>
//             event.id === eventId
//               ? {
//                   ...event,
//                   currentJoined: result.currentJoined!,
//                   isAlreadyJoined: true,
//                 }
//               : event
//           )
//         );
//       } else {
//         toast.error(result.error || "Failed to join event");
//       }
//     } catch {
//       toast.error("Failed to join event");
//     }
//     setJoiningEventId(null);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//         {/* Navigation Bar */}
//         <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
//           <div className="container mx-auto px-4">
//             <div className="flex items-center justify-between h-16">
//               <div className="flex items-center space-x-2">
//                 <span className="text-xl font-bold text-gray-900">Unity</span>
//               </div>
//               <div className="flex items-center space-x-8">
//                 <Link
//                   href="/"
//                   className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
//                 >
//                   <Home className="h-4 w-4" />
//                   <span>Home</span>
//                 </Link>
//                 <Link
//                   href="/explore"
//                   className="flex items-center space-x-2 px-3 py-2 rounded-lg text-blue-600 bg-blue-50 transition-colors"
//                 >
//                   <Search className="h-4 w-4" />
//                   <span>Explore</span>
//                 </Link>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Button variant="outline" asChild>
//                   <Link href="/signin">
//                     <User className="h-4 w-4 mr-2" />
//                     Sign In
//                   </Link>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </nav>

//         {/* Loading Content */}
//         <main className="container mx-auto px-4 py-8">
//           <div className="w-full mt-24 flex justify-center">
//             <div className="flex flex-col items-center gap-2">
//               <Loader2 className="size-8 animate-spin text-zinc-500" />
//               <h3 className="font-semibold text-xl">Loading events...</h3>
//             </div>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
//       {/* Navigation Bar */}
//       <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-2">
//               <span className="text-xl font-bold text-gray-900">Unity</span>
//             </div>
//             <div className="flex items-center space-x-8">
//               <Link
//                 href="/"
//                 className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
//               >
//                 <Home className="h-4 w-4" />
//                 <span>Home</span>
//               </Link>
//               <Link
//                 href="/explore"
//                 className="flex items-center space-x-2 px-3 py-2 rounded-lg text-blue-600 bg-blue-50 transition-colors"
//               >
//                 <Search className="h-4 w-4" />
//                 <span>Explore</span>
//               </Link>
//             </div>
//             <div className="flex items-center space-x-3">
//               <Button variant="outline" asChild>
//                 <Link href="/signin">
//                   <User className="h-4 w-4 mr-2" />
//                   Sign In
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Explore Volunteer Opportunities
//           </h1>
//           <p className="text-gray-600">
//             Discover meaningful ways to make a difference in your community.
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="mb-8 space-y-4">
//           <div className="flex flex-col lg:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 placeholder="Search events, organizations, skills..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             {/* Category Filter */}
//             <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//               <SelectTrigger className="w-full lg:w-[200px]">
//                 <Filter className="h-4 w-4 mr-2" />
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {categories.map((category) => (
//                   <SelectItem key={category.value} value={category.value}>
//                     {category.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {/* Sort */}
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="w-full lg:w-[200px]">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="date">Sort by Date</SelectItem>
//                 <SelectItem value="capacity">Sort by Availability</SelectItem>
//                 <SelectItem value="organization">
//                   Sort by Organization
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Results count */}
//           <div className="text-sm text-gray-600">
//             Showing {filteredEvents.length} of {events.length} events
//           </div>
//         </div>

//         {/* Events Grid */}
//         {filteredEvents.length === 0 ? (
//           <div className="text-center py-12">
//             <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No events found
//             </h3>
//             <p className="text-gray-600">
//               Try adjusting your search criteria or browse all events.
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredEvents.map((event) => (
//               <Card
//                 key={event.id}
//                 className="hover:shadow-lg transition-shadow"
//               >
//                 <CardHeader className="pb-3">
//                   <div className="flex items-start justify-between mb-2">
//                     <Badge className={getCategoryColor(event.category)}>
//                       {event.category}
//                     </Badge>
//                     <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
//                   </div>
//                   <CardTitle className="text-lg line-clamp-2">
//                     {event.name}
//                   </CardTitle>
//                   <p className="text-sm text-gray-600 font-medium">
//                     {event.organization}
//                   </p>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <p className="text-gray-700 text-sm line-clamp-3">
//                     {event.description}
//                   </p>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex items-center text-gray-600">
//                       <Calendar className="h-4 w-4 mr-2" />
//                       {new Date(event.date).toLocaleDateString("en-US", {
//                         weekday: "short",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <Clock className="h-4 w-4 mr-2" />
//                       {event.time}
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <MapPin className="h-4 w-4 mr-2" />
//                       {event.location}
//                     </div>
//                     <div className="flex items-center">
//                       <Users className="h-4 w-4 mr-2 text-gray-600" />
//                       <span
//                         className={getAvailabilityColor(
//                           event.currentJoined,
//                           event.maxCapacity
//                         )}
//                       >
//                         {event.currentJoined}/{event.maxCapacity} joined
//                       </span>
//                     </div>
//                   </div>
//                   {event.requiredSkills.length > 0 && (
//                     <div className="flex flex-wrap gap-1">
//                       {event.requiredSkills.slice(0, 3).map((skill) => (
//                         <Badge
//                           key={skill}
//                           variant="secondary"
//                           className="text-xs"
//                         >
//                           {skill}
//                         </Badge>
//                       ))}
//                       {event.requiredSkills.length > 3 && (
//                         <Badge variant="secondary" className="text-xs">
//                           +{event.requiredSkills.length - 3} more
//                         </Badge>
//                       )}
//                     </div>
//                   )}{" "}
//                   <Button
//                     className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
//                     disabled={
//                       event.currentJoined >= event.maxCapacity ||
//                       event.isAlreadyJoined ||
//                       joiningEventId === event.id
//                     }
//                     onClick={() => handleJoinEvent(event.id)}
//                   >
//                     {joiningEventId === event.id ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Joining...
//                       </>
//                     ) : event.isAlreadyJoined ? (
//                       "Already Joined"
//                     ) : event.currentJoined >= event.maxCapacity ? (
//                       "Event Full"
//                     ) : (
//                       "Join Event"
//                     )}
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
