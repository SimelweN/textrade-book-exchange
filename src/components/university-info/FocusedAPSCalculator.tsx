import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calculator,
  GraduationCap,
  School,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Sparkles,
  Info,
  Save,
  RefreshCw,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities";
import { SOUTH_AFRICAN_SUBJECTS } from "@/constants/subjects";
import { toast } from "sonner";

// Types
interface APSSubject {
  name: string;
  marks: number;
  level: number;
  points: number;
}

interface DegreeResult {
  name: string;
  university: string;
  faculty: string;
  apsRequirement: number;
  duration: string;
  description: string;
  eligible: boolean;
  apsGap?: number;
}

// Default subjects for APS calculation
const DEFAULT_SUBJECTS: APSSubject[] = [
  { name: "English", marks: 0, level: 4, points: 0 },
  { name: "Mathematics", marks: 0, level: 4, points: 0 },
  { name: "Physical Sciences", marks: 0, level: 4, points: 0 },
  { name: "Life Sciences", marks: 0, level: 4, points: 0 },
  { name: "Select Subject", marks: 0, level: 4, points: 0 },
  { name: "Select Subject", marks: 0, level: 4, points: 0 },
  { name: "Select Subject", marks: 0, level: 4, points: 0 },
];

// APS calculation function
const calculateAPSPoints = (marks: number): number => {
  if (marks >= 80) return 7;
  if (marks >= 70) return 6;
  if (marks >= 60) return 5;
  if (marks >= 50) return 4;
  if (marks >= 40) return 3;
  if (marks >= 30) return 2;
  if (marks >= 0) return 1;
  return 0;
};

const FocusedAPSCalculator: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [subjects, setSubjects] = useState<APSSubject[]>(DEFAULT_SUBJECTS);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [minAPS, setMinAPS] = useState("");
  const [maxAPS, setMaxAPS] = useState("");
  const [showEligibleOnly, setShowEligibleOnly] = useState(false);
  const [sortBy, setSortBy] = useState("aps-requirement");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Calculate total APS
  const totalAPS = useMemo(() => {
    return subjects.reduce((total, subject) => total + subject.points, 0);
  }, [subjects]);

  // Update subject marks and calculate points
  const updateSubjectMarks = useCallback((index: number, marks: number) => {
    const newSubjects = [...subjects];
    newSubjects[index].marks = Math.max(0, Math.min(100, marks));
    newSubjects[index].points = calculateAPSPoints(newSubjects[index].marks);
    setSubjects(newSubjects);
  }, []);

  // Update subject name
  const updateSubjectName = useCallback((index: number, name: string) => {
    const newSubjects = [...subjects];
    newSubjects[index].name = name;
    setSubjects(newSubjects);
  }, []);

  // Get available subjects for dropdown
  const availableSubjects = useMemo(() => {
    return SOUTH_AFRICAN_SUBJECTS.filter(
      (subject) =>
        !subjects.some((s) => s.name === subject) || subject.includes("Select"),
    );
  }, [subjects]);

  // Get eligible degrees
  const eligibleDegrees = useMemo(() => {
    const degrees: DegreeResult[] = [];

    ALL_SOUTH_AFRICAN_UNIVERSITIES.forEach((university) => {
      university.faculties?.forEach((faculty) => {
        faculty.degrees?.forEach((degree) => {
          const eligible = totalAPS >= degree.apsRequirement;
          const apsGap = eligible ? 0 : degree.apsRequirement - totalAPS;

          degrees.push({
            name: degree.name,
            university: university.name,
            faculty: faculty.name,
            apsRequirement: degree.apsRequirement,
            duration: degree.duration,
            description: degree.description,
            eligible,
            apsGap: apsGap > 0 ? apsGap : undefined,
          });
        });
      });
    });

    return degrees;
  }, [totalAPS]);

  // Filter and sort degrees
  const filteredDegrees = useMemo(() => {
    let filtered = eligibleDegrees;

    // Apply filters
    if (searchTerm) {
      filtered = filtered.filter(
        (degree) =>
          degree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          degree.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedUniversity !== "all") {
      filtered = filtered.filter(
        (degree) => degree.university === selectedUniversity,
      );
    }

    if (selectedFaculty !== "all") {
      filtered = filtered.filter(
        (degree) => degree.faculty === selectedFaculty,
      );
    }

    if (minAPS) {
      filtered = filtered.filter(
        (degree) => degree.apsRequirement >= parseInt(minAPS),
      );
    }

    if (maxAPS) {
      filtered = filtered.filter(
        (degree) => degree.apsRequirement <= parseInt(maxAPS),
      );
    }

    if (showEligibleOnly) {
      filtered = filtered.filter((degree) => degree.eligible);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "aps-requirement":
          comparison = a.apsRequirement - b.apsRequirement;
          break;
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "university":
          comparison = a.university.localeCompare(b.university);
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [
    eligibleDegrees,
    searchTerm,
    selectedUniversity,
    selectedFaculty,
    minAPS,
    maxAPS,
    showEligibleOnly,
    sortBy,
    sortOrder,
  ]);

  // Statistics
  const stats = useMemo(() => {
    const totalDegrees = eligibleDegrees.length;
    const eligibleCount = eligibleDegrees.filter((d) => d.eligible).length;
    const eligibilityRate =
      totalDegrees > 0 ? Math.round((eligibleCount / totalDegrees) * 100) : 0;

    return {
      totalDegrees,
      eligibleCount,
      eligibilityRate,
    };
  }, [eligibleDegrees]);

  // Get unique universities and faculties for filters
  const uniqueUniversities = useMemo(() => {
    return Array.from(new Set(eligibleDegrees.map((d) => d.university))).sort();
  }, [eligibleDegrees]);

  const uniqueFaculties = useMemo(() => {
    return Array.from(new Set(eligibleDegrees.map((d) => d.faculty))).sort();
  }, [eligibleDegrees]);

  // Handler functions
  const handleSave = () => {
    toast.success("Calculation saved successfully!");
  };

  const handleReset = () => {
    setSubjects(DEFAULT_SUBJECTS);
    toast.info("Calculator reset to default values");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedUniversity("all");
    setSelectedFaculty("all");
    setMinAPS("");
    setMaxAPS("");
    setShowEligibleOnly(false);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-center">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl p-8 mb-8">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=400&fit=crop&crop=center"
              alt="Students studying with textbooks"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10"></div>
          </div>
          <div className="relative z-10 mt-4">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">
                APS Calculator & Degree Finder
              </h2>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Calculate your Admission Point Score (APS) and discover which
              university programs you qualify for. Get personalized
              recommendations and find books for your chosen courses.
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-blue-100 rounded-full px-4 py-2 mb-4">
            <Calculator className="h-8 w-8 text-blue-600 mr-2" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Enhanced APS Calculator</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate your Admission Point Score (APS) and discover which
            degrees you qualify for at South African universities.
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - APS Calculator */}
          <div className="lg:col-span-1">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <span>APS Calculator</span>
                </CardTitle>
                <CardDescription>
                  Enter your subject marks to calculate your APS score
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subjects */}
                {subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-6">
                      <Select
                        value={subject.name}
                        onValueChange={(value) =>
                          updateSubjectName(index, value)
                        }
                      >
                        <SelectTrigger className="w-full bg-green-50 border-green-200">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subject.name !== "Select Subject" && (
                            <SelectItem
                              key={`current-${subject.name}`}
                              value={subject.name}
                            >
                              {subject.name}
                            </SelectItem>
                          )}
                          {availableSubjects.map((availableSubject) => (
                            <SelectItem
                              key={availableSubject}
                              value={availableSubject}
                            >
                              {availableSubject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={subject.marks}
                        onChange={(e) =>
                          updateSubjectMarks(
                            index,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="bg-green-50 border-green-200"
                      />
                    </div>
                    <div className="col-span-3">
                      <Badge
                        variant="outline"
                        className="w-full justify-center border-green-200 text-green-700"
                      >
                        {subject.points}
                      </Badge>
                    </div>
                  </div>
                ))}

                {/* Advanced Options */}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                    className="w-full bg-green-50 border-green-200"
                  >
                    <span>Advanced Options</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {/* Total APS Score */}
                <div className="flex flex-col items-center pt-6">
                  <div className="bg-blue-100 rounded-lg px-6 py-4 w-full flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      Total APS Score:
                    </span>
                    <Badge className="bg-blue-600 text-white text-lg font-semibold px-3 py-1">
                      {totalAPS}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 mt-4 w-full">
                    <Button
                      variant="outline"
                      onClick={handleSave}
                      className="bg-green-50 border-green-200"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      <span>Save</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="bg-green-50 border-green-200"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      <span>Reset</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="bg-green-50 border-green-200"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eligibility Overview */}
            <Card className="border shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Eligibility Overview</span>
                </CardTitle>
                <CardDescription>
                  Summary of your eligibility for degrees
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Total Degrees:</span>
                    <Badge
                      variant="outline"
                      className="border-green-200 text-green-700"
                    >
                      {stats.totalDegrees}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Eligible Degrees:</span>
                    <Badge
                      variant="outline"
                      className="border-green-200 text-green-700"
                    >
                      {stats.eligibleCount}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Eligibility Rate:</span>
                    <Badge
                      variant="outline"
                      className="border-green-200 text-green-700"
                    >
                      <span>{stats.eligibilityRate}</span>
                      <span>%</span>
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Top Universities for You</h4>
                  <div className="space-y-1">
                    {uniqueUniversities.slice(0, 3).map((university) => {
                      const eligibleCount = eligibleDegrees.filter(
                        (d) => d.university === university && d.eligible,
                      ).length;
                      return (
                        <div
                          key={university}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="truncate">
                            {university.split(" ").slice(0, 3).join(" ")}
                          </span>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-700"
                          >
                            {eligibleCount} programs
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Top Faculties for You</h4>
                  <div className="space-y-1">
                    {uniqueFaculties.slice(0, 3).map((faculty) => {
                      const eligibleCount = eligibleDegrees.filter(
                        (d) => d.faculty === faculty && d.eligible,
                      ).length;
                      return (
                        <div
                          key={faculty}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="truncate">{faculty}</span>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-700"
                          >
                            {eligibleCount} programs
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Degree Eligibility Results</span>
                </CardTitle>
                <CardDescription>
                  Explore degrees based on your APS score and subject choices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <h3 className="font-medium">Filters</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="university-filter">Universities</Label>
                      <Select
                        value={selectedUniversity}
                        onValueChange={setSelectedUniversity}
                      >
                        <SelectTrigger className="bg-green-50 border-green-200">
                          <SelectValue placeholder="All Universities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Universities</SelectItem>
                          {uniqueUniversities.map((uni) => (
                            <SelectItem key={uni} value={uni}>
                              {uni}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="faculty-filter">Faculty</Label>
                      <Select
                        value={selectedFaculty}
                        onValueChange={setSelectedFaculty}
                      >
                        <SelectTrigger className="bg-green-50 border-green-200">
                          <SelectValue placeholder="All Faculties" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Faculties</SelectItem>
                          {uniqueFaculties.map((faculty) => (
                            <SelectItem key={faculty} value={faculty}>
                              {faculty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="min-aps">Minimum APS</Label>
                      <Input
                        id="min-aps"
                        type="number"
                        placeholder="Min APS"
                        value={minAPS}
                        onChange={(e) => setMinAPS(e.target.value)}
                        className="bg-green-50 border-green-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="max-aps">Maximum APS</Label>
                      <Input
                        id="max-aps"
                        type="number"
                        placeholder="Max APS"
                        value={maxAPS}
                        onChange={(e) => setMaxAPS(e.target.value)}
                        className="bg-green-50 border-green-200"
                      />
                    </div>

                    <div className="col-span-2 space-y-1">
                      <Label htmlFor="search-keywords">Search</Label>
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="search-keywords"
                          placeholder="Search by degree name, description..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 bg-green-50 border-green-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-eligible"
                        checked={showEligibleOnly}
                        onCheckedChange={setShowEligibleOnly}
                        className="border-green-500"
                      />
                      <Label
                        htmlFor="show-eligible"
                        className="text-sm font-medium"
                      >
                        Show only eligible degrees
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label htmlFor="sort-by" className="text-sm font-medium">
                        Sort by:
                      </Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-32 h-8 bg-green-50 border-green-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aps-requirement">
                            APS Requirement
                          </SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                          <SelectItem value="university">University</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleSortOrder}
                        className="h-8 bg-green-50 border-green-200"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Results */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="flex items-center gap-2 font-medium">
                      <GraduationCap className="h-4 w-4" />
                      <span>{filteredDegrees.length} Degrees Found</span>
                    </h3>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>

                  {filteredDegrees.length === 0 ? (
                    <div className="text-center py-12">
                      <School className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No degrees found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your filters or increasing your APS score.
                      </p>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="h-96">
                      <div className="space-y-3">
                        {filteredDegrees.slice(0, 20).map((degree, index) => (
                          <Card
                            key={`${degree.university}-${degree.name}-${index}`}
                            className={cn(
                              "p-4 border-l-4",
                              degree.eligible
                                ? "border-l-green-500 bg-green-50"
                                : "border-l-red-500 bg-red-50",
                            )}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">
                                  {degree.name}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {degree.university} - {degree.faculty}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {degree.description}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge
                                  variant={
                                    degree.eligible ? "default" : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  APS {degree.apsRequirement}
                                </Badge>
                                {degree.apsGap && (
                                  <span className="text-xs text-red-600">
                                    Need {degree.apsGap} more points
                                  </span>
                                )}
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="border shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  <span>About APS Calculation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="calculation">
                    <AccordionTrigger>
                      How is the APS score calculated?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600">
                        APS (Admission Point Score) is calculated by converting
                        your final matric marks to points: 80-100% = 7 points,
                        70-79% = 6 points, 60-69% = 5 points, 50-59% = 4 points,
                        40-49% = 3 points, 30-39% = 2 points, 0-29% = 1 point.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="universities">
                    <AccordionTrigger>
                      Do all universities calculate APS the same way?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600">
                        While the basic APS calculation is standardized,
                        different universities may have specific requirements
                        for certain programs, including minimum scores for
                        particular subjects.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="other-factors">
                    <AccordionTrigger>
                      What else do universities consider besides APS?
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-sm text-gray-600">
                        Universities may also consider specific subject
                        requirements, portfolio submissions, interviews,
                        aptitude tests, and other admission criteria depending
                        on the program.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusedAPSCalculator;
