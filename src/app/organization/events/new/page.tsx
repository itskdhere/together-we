"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Clock,
  MapPin,
  Users,
  Tag,
  ArrowLeft,
  Plus,
  X,
  Save,
  Upload,
  Star,
} from "lucide-react";
import { createVolunteerOpportunity } from "./actions";

interface VolunteerOpportunityFormData {
  title: string;
  description: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  isRemote: boolean;
  onlineInstructions: string;
  volunteersNeeded: string;
  skillsRequired: string[];
  ageRequirement: string;
  backgroundCheckRequired: boolean;
  trainingProvided: boolean;
  applicationDeadline: string;
  tags: string[];
  isRecurring: boolean;
  recurringPattern: string;
  contactEmail: string;
  contactPhone: string;
  image: File | null;
}

const volunteerCategories = [
  "Community Service",
  "Environmental",
  "Education & Tutoring",
  "Healthcare & Wellness",
  "Arts & Culture",
  "Sports & Recreation",
  "Animal Welfare",
  "Disaster Relief",
  "Elderly Care",
  "Youth Mentoring",
  "Food Security",
  "Homeless Services",
];

const commonSkills = [
  "No Experience Required",
  "Communication Skills",
  "Physical Labor",
  "Teaching/Training",
  "Computer Skills",
  "Driving License",
  "First Aid Certified",
  "Bilingual",
  "Leadership",
  "Event Planning",
  "Fundraising",
  "Social Media",
];

const commonTags = [
  "Beginner Friendly",
  "Family Friendly",
  "Students Welcome",
  "Flexible Hours",
  "One-Time Event",
  "Ongoing Commitment",
  "Weekend Only",
  "Evening Hours",
  "Outdoor Activity",
  "Indoor Activity",
];

export default function NewVolunteerOpportunityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<VolunteerOpportunityFormData>({
    title: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: "",
    location: "",
    isRemote: false,
    onlineInstructions: "",
    volunteersNeeded: "",
    skillsRequired: [],
    ageRequirement: "",
    backgroundCheckRequired: false,
    trainingProvided: false,
    applicationDeadline: "",
    tags: [],
    isRecurring: false,
    recurringPattern: "",
    contactEmail: "",
    contactPhone: "",
    image: null,
  });

  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof VolunteerOpportunityFormData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSkill = (skill: string) => {
    if (skill && !formData.skillsRequired.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skill],
      }));
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  const handleAddTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.description ||
        !formData.category ||
        !formData.date ||
        !formData.startTime ||
        !formData.volunteersNeeded ||
        !formData.contactEmail
      ) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      if (!formData.isRemote && !formData.location) {
        toast.error("Please provide a location for in-person events");
        setIsSubmitting(false);
        return;
      }

      // Prepare data for server action
      const opportunityData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        isRemote: formData.isRemote,
        onlineInstructions: formData.onlineInstructions,
        volunteersNeeded: parseInt(formData.volunteersNeeded),
        skillsRequired: formData.skillsRequired,
        ageRequirement: formData.ageRequirement,
        backgroundCheckRequired: formData.backgroundCheckRequired,
        trainingProvided: formData.trainingProvided,
        applicationDeadline: formData.applicationDeadline,
        tags: formData.tags,
        isRecurring: formData.isRecurring,
        recurringPattern: formData.recurringPattern,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
      };
      const result = await createVolunteerOpportunity(opportunityData);

      if (result.success) {
        toast.success("Volunteer opportunity created successfully!");
        // Small delay to ensure database transaction is complete
        setTimeout(() => {
          router.push("/organization/dashboard?refresh=true");
        }, 1000);
      } else {
        toast.error(result.message || "Failed to create volunteer opportunity");
      }
    } catch (error) {
      console.error("Error creating volunteer opportunity:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Create Volunteer Opportunity
              </h1>
              <p className="text-gray-300 mt-1">
                Connect with volunteers who want to make a difference
              </p>
            </div>
          </div>
        </div>{" "}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Heart className="w-5 h-5" />
                Opportunity Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Opportunity Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Help serve meals at local shelter"
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-gray-300">
                    Category *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {volunteerCategories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="text-white hover:bg-gray-600"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="volunteersNeeded" className="text-gray-300">
                    Volunteers Needed *
                  </Label>
                  <Input
                    id="volunteersNeeded"
                    type="number"
                    min="1"
                    value={formData.volunteersNeeded}
                    onChange={(e) =>
                      handleInputChange("volunteersNeeded", e.target.value)
                    }
                    placeholder="Number of volunteers"
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description" className="text-gray-300">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Describe what volunteers will be doing, the impact they'll make, and what to expect..."
                    rows={4}
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          {/* Date & Time */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onCheckedChange={(checked) =>
                    handleInputChange("isRecurring", checked)
                  }
                  className="border-gray-600"
                />
                <Label htmlFor="isRecurring" className="text-gray-300">
                  Recurring Opportunity
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date" className="text-gray-300">
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="startTime" className="text-gray-300">
                    Start Time *
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      handleInputChange("startTime", e.target.value)
                    }
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="endTime" className="text-gray-300">
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      handleInputChange("endTime", e.target.value)
                    }
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                {/* <div>
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.duration}
                    onChange={(e) =>
                      handleInputChange("duration", e.target.value)
                    }
                    placeholder="e.g., 3"
                  />
                </div> */}
              </div>

              {formData.isRecurring && (
                <div>
                  <Label htmlFor="recurringPattern" className="text-gray-300">
                    Recurring Pattern
                  </Label>
                  <Input
                    id="recurringPattern"
                    value={formData.recurringPattern}
                    onChange={(e) =>
                      handleInputChange("recurringPattern", e.target.value)
                    }
                    placeholder="e.g., Every Saturday, Weekly, Monthly"
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="applicationDeadline" className="text-gray-300">
                  Application Deadline
                </Label>
                <Input
                  id="applicationDeadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) =>
                    handleInputChange("applicationDeadline", e.target.value)
                  }
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>{" "}
          {/* Location */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MapPin className="w-5 h-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div className="flex items-center space-x-2">
                <Checkbox
                  id="isRemote"
                  checked={formData.isRemote}
                  onCheckedChange={(checked) =>
                    handleInputChange("isRemote", checked)
                  }
                />
                <Label htmlFor="isRemote">Remote/Virtual Opportunity</Label>
              </div> */}

              {formData.isRemote ? (
                <div>
                  <Label htmlFor="onlineInstructions" className="text-gray-300">
                    Online Instructions
                  </Label>
                  <Textarea
                    id="onlineInstructions"
                    value={formData.onlineInstructions}
                    onChange={(e) =>
                      handleInputChange("onlineInstructions", e.target.value)
                    }
                    placeholder="Provide details about how volunteers can participate remotely..."
                    rows={3}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              ) : (
                <div>
                  <Label htmlFor="location" className="text-gray-300">
                    Location Address *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    placeholder="Enter full address..."
                    required={!formData.isRemote}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              )}
            </CardContent>
          </Card>{" "}
          {/* Requirements */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Star className="w-5 h-5" />
                Volunteer Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ageRequirement" className="text-gray-300">
                    Age Requirement
                  </Label>
                  <Select
                    value={formData.ageRequirement}
                    onValueChange={(value) =>
                      handleInputChange("ageRequirement", value)
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select age requirement" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem
                        value="no-restriction"
                        className="text-white hover:bg-gray-600"
                      >
                        No Age Restriction
                      </SelectItem>
                      <SelectItem
                        value="13+"
                        className="text-white hover:bg-gray-600"
                      >
                        13+ (with parent/guardian)
                      </SelectItem>
                      <SelectItem
                        value="16+"
                        className="text-white hover:bg-gray-600"
                      >
                        16+ (with parent/guardian)
                      </SelectItem>
                      <SelectItem
                        value="18+"
                        className="text-white hover:bg-gray-600"
                      >
                        18+ (adults only)
                      </SelectItem>
                      <SelectItem
                        value="21+"
                        className="text-white hover:bg-gray-600"
                      >
                        21+ (adults only)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="backgroundCheckRequired"
                      checked={formData.backgroundCheckRequired}
                      onCheckedChange={(checked) =>
                        handleInputChange("backgroundCheckRequired", checked)
                      }
                      className="border-gray-600"
                    />
                    <Label
                      htmlFor="backgroundCheckRequired"
                      className="text-gray-300"
                    >
                      Background Check Required
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="trainingProvided"
                      checked={formData.trainingProvided}
                      onCheckedChange={(checked) =>
                        handleInputChange("trainingProvided", checked)
                      }
                      className="border-gray-600"
                    />
                    <Label htmlFor="trainingProvided" className="text-gray-300">
                      Training Will Be Provided
                    </Label>
                  </div>
                </div>
              </div>

              {/* Skills Required */}
              <div>
                <Label className="text-gray-300">
                  Skills/Qualifications Required
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skillsRequired.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="flex items-center gap-1 bg-gray-700 text-gray-200 border-gray-600"
                    >
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1 text-gray-400 hover:text-red-400"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add required skill..."
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddSkill(newSkill))
                    }
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddSkill(newSkill)}
                    className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-400 mb-2">Common skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonSkills
                      .filter(
                        (skill) => !formData.skillsRequired.includes(skill)
                      )
                      .map((skill) => (
                        <Button
                          key={skill}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSkill(skill)}
                          className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                        >
                          {skill}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          {/* Contact Information */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail" className="text-gray-300">
                    Contact Email *
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      handleInputChange("contactEmail", e.target.value)
                    }
                    placeholder="volunteer@organization.org"
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone" className="text-gray-300">
                    Contact Phone
                  </Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      handleInputChange("contactPhone", e.target.value)
                    }
                    placeholder="(555) 123-4567"
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          {/* Tags */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Tag className="w-5 h-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 bg-gray-700 text-gray-200 border-gray-600"
                  >
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1 text-gray-400 hover:text-red-400"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), handleAddTag(newTag))
                  }
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleAddTag(newTag)}
                  className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-2">Suggested tags:</p>
                <div className="flex flex-wrap gap-2">
                  {commonTags
                    .filter((tag) => !formData.tags.includes(tag))
                    .map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddTag(tag)}
                        className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                      >
                        {tag}
                      </Button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          {/* Image Upload */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Upload className="w-5 h-5" />
                Opportunity Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="image" className="text-gray-300">
                  Upload Image (Optional)
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0"
                />
                {formData.image && (
                  <p className="text-sm text-gray-300">
                    Selected: {formData.image.name}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Images help volunteers visualize the opportunity and increase
                  engagement
                </p>
              </div>
            </CardContent>
          </Card>
          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Opportunity
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
