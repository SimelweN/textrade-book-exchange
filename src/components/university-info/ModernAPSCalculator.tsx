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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  GraduationCap,
  TrendingUp,
  Target,
  BarChart3,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Star,
  Zap,
  Brain,
  Trophy,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Lightbulb,
  Building,
  MapPin,
  Calendar,
  CreditCard,
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

interface UniversityMatch {
  university: string;
  abbreviation: string;
  location: string;
  eligiblePrograms: number;
  totalPrograms: number;
  competitiveness: "High" | "Moderate" | "Accessible";
  averageAPS: number;
}

interface DegreeInsight {
  name: string;
  university: string;
  faculty: string;
  apsRequirement: number;
  duration: string;
  description: string;
  eligible: boolean;
  apsGap?: number;
  competitiveness: "High" | "Moderate" | "Accessible";
  careerProspects?: string[];
}

// Default subjects for APS calculation (exactly 6 subjects required)
const CORE_SUBJECTS: APSSubject[] = [
  { name: "English Home Language", marks: 0, level: 4, points: 0 },
  { name: "Mathematics", marks: 0, level: 4, points: 0 },
  { name: "Select Subject", marks: 0, level: 4, points: 0 },
  { name: "Select Subject", marks: 0, level: 4, points: 0 },
  { name: "Select Subject", marks: 0, level: 4, points: 0 },
  { name: "Select Subject", marks: 0, level: 4, points: 0 },
];

// APS calculation function
const calculateAPSPoints = (marks: number): number => {
  // Handle NaN or invalid marks
  if (isNaN(marks) || marks < 0) return 0;

  if (marks >= 80) return 7;
  if (marks >= 70) return 6;
  if (marks >= 60) return 5;
  if (marks >= 50) return 4;
  if (marks >= 40) return 3;
  if (marks >= 30) return 2;
  if (marks >= 0) return 1;
  return 0;
};

// Get performance level based on APS
const getPerformanceLevel = (
  aps: number,
): { level: string; color: string; description: string } => {
  if (aps >= 36)
    return {
      level: "Outstanding",
      color: "text-purple-600 bg-purple-100",
      description: "Elite performance - access to any program",
    };
  if (aps >= 30)
    return {
      level: "Excellent",
      color: "text-emerald-600 bg-emerald-100",
      description: "Strong performance - most programs available",
    };
  if (aps >= 24)
    return {
      level: "Good",
      color: "text-blue-600 bg-blue-100",
      description: "Solid performance - many options available",
    };
  if (aps >= 18)
    return {
      level: "Fair",
      color: "text-orange-600 bg-orange-100",
      description: "Basic performance - limited options",
    };
  return {
    level: "Needs Improvement",
    color: "text-red-600 bg-red-100",
    description: "Consider improvement strategies",
  };
};

const ModernAPSCalculator: React.FC = () => {
  const navigate = useNavigate();

  // State management
  const [subjects, setSubjects] = useState<APSSubject[]>(CORE_SUBJECTS);
  const [activeInsight, setActiveInsight] = useState<
    "overview" | "universities" | "programs"
  >("overview");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "eligible" | "competitive"
  >("all");
  const [showAllUniversities, setShowAllUniversities] = useState(false);

  // Calculate total APS
  const totalAPS = useMemo(() => {
    const total = subjects.reduce(
      (total, subject) => total + (subject.points || 0),
      0,
    );
    return isNaN(total) ? 0 : total;
  }, [subjects]);

  // Performance analysis
  const performance = useMemo(() => getPerformanceLevel(totalAPS), [totalAPS]);

  // Update subject marks and calculate points
  const updateSubjectMarks = useCallback((index: number, marks: number) => {
    setSubjects((prevSubjects) => {
      const newSubjects = [...prevSubjects];
      newSubjects[index].marks = Math.max(0, Math.min(100, marks));
      newSubjects[index].points = calculateAPSPoints(newSubjects[index].marks);
      return newSubjects;
    });
  }, []);

  // Update subject name
  const updateSubjectName = useCallback((index: number, name: string) => {
    setSubjects((prevSubjects) => {
      const newSubjects = [...prevSubjects];
      newSubjects[index].name = name;
      return newSubjects;
    });
  }, []);

  // Get available subjects for dropdown
  const availableSubjects = useMemo(() => {
    return SOUTH_AFRICAN_SUBJECTS.filter(
      (subject) =>
        !subjects.some((s) => s.name === subject) || subject.includes("Select"),
    );
  }, [subjects]);

  // Comprehensive degree analysis - Only show programs where user APS >= program minimum APS
  const degreeAnalysis = useMemo(() => {
    const degrees: DegreeInsight[] = [];

    // Only process if user has entered an APS score
    if (totalAPS > 0) {
      ALL_SOUTH_AFRICAN_UNIVERSITIES.forEach((university) => {
        university.faculties?.forEach((faculty) => {
          faculty.degrees?.forEach((degree) => {
            const eligible = totalAPS >= degree.apsRequirement;

            // Only include degrees where the user meets the APS requirement
            if (eligible) {
              let competitiveness: "High" | "Moderate" | "Accessible" =
                "Accessible";
              if (degree.apsRequirement >= 32) competitiveness = "High";
              else if (degree.apsRequirement >= 26)
                competitiveness = "Moderate";

              degrees.push({
                name: degree.name,
                university: university.name,
                faculty: faculty.name,
                apsRequirement: degree.apsRequirement,
                duration: degree.duration,
                description: degree.description,
                eligible: true,
                competitiveness,
                careerProspects: degree.careerProspects || [],
              });
            }
          });
        });
      });
    }

    return degrees.sort((a, b) => a.apsRequirement - b.apsRequirement);
  }, [totalAPS]);

  // University matching analysis
  const universityMatches = useMemo(() => {
    const matches: UniversityMatch[] = [];

    ALL_SOUTH_AFRICAN_UNIVERSITIES.forEach((university) => {
      const totalPrograms =
        university.faculties?.reduce(
          (total, faculty) => total + (faculty.degrees?.length || 0),
          0,
        ) || 0;

      const eligiblePrograms =
        university.faculties?.reduce(
          (total, faculty) =>
            total +
            (faculty.degrees?.filter(
              (degree) => totalAPS >= degree.apsRequirement,
            ).length || 0),
          0,
        ) || 0;

      const allAPS =
        university.faculties?.flatMap(
          (faculty) =>
            faculty.degrees?.map((degree) => degree.apsRequirement) || [],
        ) || [];

      const averageAPS =
        allAPS.length > 0
          ? Math.round(
              allAPS.reduce((sum, aps) => sum + aps, 0) / allAPS.length,
            )
          : 0;

      let competitiveness: "High" | "Moderate" | "Accessible" = "Accessible";
      if (averageAPS >= 30) competitiveness = "High";
      else if (averageAPS >= 24) competitiveness = "Moderate";

      matches.push({
        university: university.name,
        abbreviation: university.abbreviation,
        location: `${university.location}, ${university.province}`,
        eligiblePrograms,
        totalPrograms,
        competitiveness,
        averageAPS,
      });
    });

    return matches.sort((a, b) => b.eligiblePrograms - a.eligiblePrograms);
  }, [totalAPS]);

  // Statistics for dashboard
  const stats = useMemo(() => {
    const totalDegrees = degreeAnalysis.length;
    const eligibleCount = degreeAnalysis.filter((d) => d.eligible).length;
    const eligibilityRate =
      totalDegrees > 0 ? Math.round((eligibleCount / totalDegrees) * 100) : 0;

    const topUniversities = universityMatches.filter(
      (u) => u.eligiblePrograms > 0,
    ).length;
    const averageRequirement =
      totalDegrees > 0
        ? Math.round(
            degreeAnalysis.reduce((sum, d) => sum + d.apsRequirement, 0) /
              totalDegrees,
          )
        : 0;

    const performancePercentile =
      isNaN(totalAPS) || totalAPS === 0
        ? 0
        : Math.min(100, Math.round((totalAPS / 42) * 100));

    return {
      totalDegrees,
      eligibleCount,
      eligibilityRate: isNaN(eligibilityRate) ? 0 : eligibilityRate,
      topUniversities,
      averageRequirement: isNaN(averageRequirement) ? 0 : averageRequirement,
      performancePercentile: isNaN(performancePercentile)
        ? 0
        : performancePercentile,
    };
  }, [degreeAnalysis, universityMatches, totalAPS]);

  // Filter degrees based on selection
  const filteredDegrees = useMemo(() => {
    let filtered = degreeAnalysis;

    switch (selectedFilter) {
      case "eligible":
        filtered = filtered.filter((d) => d.eligible);
        break;
      case "competitive":
        filtered = filtered.filter((d) => d.competitiveness === "High");
        break;
    }

    return filtered.slice(0, 12);
  }, [degreeAnalysis, selectedFilter]);

  const handleReset = () => {
    setSubjects(CORE_SUBJECTS);
    toast.success("Calculator reset to default values");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-6">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Professional APS Calculator
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Advanced admission point score analysis with comprehensive
              university matching and career pathway insights.
            </p>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
              <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {totalAPS}
              </div>
              <div className="text-slate-300 text-sm uppercase tracking-wider">
                Current APS
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
              <Target className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {stats.eligibilityRate}%
              </div>
              <div className="text-slate-300 text-sm uppercase tracking-wider">
                Eligibility Rate
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
              <Building className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {stats.topUniversities}
              </div>
              <div className="text-slate-300 text-sm uppercase tracking-wider">
                Universities
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
              <GraduationCap className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {stats.eligibleCount}
              </div>
              <div className="text-slate-300 text-sm uppercase tracking-wider">
                Programs
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Calculator */}
          <div className="lg:col-span-1 space-y-6">
            {/* APS Calculator */}
            <Card className="bg-white border-0 shadow-xl">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-900">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">APS Calculator</div>
                    <div className="text-sm text-slate-500">
                      Enter your marks below
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {subjects.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-slate-700 font-medium">{`Subject ${index + 1}`}</Label>
                    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-3 items-start sm:items-center">
                      <div className="w-full sm:col-span-7">
                        <Select
                          value={subject.name}
                          onValueChange={(value) =>
                            updateSubjectName(index, value)
                          }
                        >
                          <SelectTrigger className="bg-slate-50 border-slate-200 w-full">
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
                      <div className="flex w-full sm:col-span-5 gap-2 items-center">
                        <div className="flex-1 sm:flex-none sm:w-20">
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
                            className="bg-slate-50 border-slate-200 text-center font-medium"
                            placeholder="0"
                          />
                        </div>
                        <div className="flex-shrink-0">
                          <div
                            className={cn(
                              "inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                              subject.points >= 5
                                ? "bg-emerald-100 text-emerald-700"
                                : subject.points >= 3
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-slate-100 text-slate-600",
                            )}
                          >
                            {subject.points}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* APS Result */}
                <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 mb-2">
                      {totalAPS}
                    </div>
                    <div className="text-slate-600 mb-4">Total APS Score</div>
                    <Badge className={performance.color} variant="secondary">
                      {performance.level}
                    </Badge>
                    <div className="text-sm text-slate-600 mt-2">
                      {performance.description}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">
                        Performance Percentile
                      </span>
                      <span className="font-medium text-slate-900">
                        {stats.performancePercentile}%
                      </span>
                    </div>
                    <Progress
                      value={stats.performancePercentile}
                      className="h-2"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="w-full border-slate-200 hover:bg-slate-50"
                  >
                    Reset Calculator
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="bg-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-900">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Strengths</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    {subjects.filter((s) => s.points >= 5).length > 0
                      ? `Strong performance in ${subjects.filter((s) => s.points >= 5).length} subjects`
                      : "Focus on improving individual subject performance"}
                  </div>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-900">
                      Opportunities
                    </span>
                  </div>
                  <div className="text-sm text-orange-800">
                    {totalAPS < 30
                      ? "Consider additional study resources and tutoring"
                      : "Explore advanced programs and specialized fields"}
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-emerald-900">
                      Next Steps
                    </span>
                  </div>
                  <div className="text-sm text-emerald-800">
                    Explore {stats.eligibleCount} eligible programs and connect
                    with university advisors
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analysis */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeInsight}
              onValueChange={(value) => setActiveInsight(value as any)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full mb-6 bg-white border border-slate-200 h-auto sm:h-10">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="universities"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Universities
                </TabsTrigger>
                <TabsTrigger
                  value="programs"
                  className="data-[state=active]:bg-slate-900 data-[state=active]:text-white"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Programs
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Statistics Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <Card className="bg-white border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                        <Award className="h-5 w-5 text-amber-500" />
                        Eligibility Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Total Programs</span>
                          <span className="text-xl font-bold text-slate-900">
                            {stats.totalDegrees}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">
                            Eligible Programs
                          </span>
                          <span className="text-xl font-bold text-emerald-600">
                            {stats.eligibleCount}
                          </span>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600">
                              Eligibility Rate
                            </span>
                            <span className="font-medium">
                              {stats.eligibilityRate}%
                            </span>
                          </div>
                          <Progress
                            value={stats.eligibilityRate}
                            className="h-3"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg text-slate-900">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">Your APS</span>
                          <span className="text-xl font-bold text-slate-900">
                            {totalAPS}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">
                            Average Required
                          </span>
                          <span className="text-xl font-bold text-slate-600">
                            {stats.averageRequirement}
                          </span>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600">
                              Performance Level
                            </span>
                            <span className="font-medium">
                              {performance.level}
                            </span>
                          </div>
                          <Progress
                            value={
                              isNaN(totalAPS) || totalAPS === 0
                                ? 0
                                : Math.min(100, (totalAPS / 42) * 100)
                            }
                            className="h-3"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Universities */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Building className="h-5 w-5 text-blue-500" />
                      Universities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {(showAllUniversities
                        ? universityMatches
                        : universityMatches.slice(0, 6)
                      ).map((university, index) => (
                        <div
                          key={index}
                          className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                {university.abbreviation}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {university.location}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                university.competitiveness === "High"
                                  ? "border-red-200 text-red-700 bg-red-50"
                                  : university.competitiveness === "Moderate"
                                    ? "border-orange-200 text-orange-700 bg-orange-50"
                                    : "border-green-200 text-green-700 bg-green-50",
                              )}
                            >
                              {university.competitiveness}
                            </Badge>
                          </div>
                          <div className="text-sm text-slate-600">
                            {university.eligiblePrograms} of{" "}
                            {university.totalPrograms} programs available
                          </div>
                          <Progress
                            value={
                              university.totalPrograms === 0
                                ? 0
                                : Math.min(
                                    100,
                                    (university.eligiblePrograms /
                                      university.totalPrograms) *
                                      100,
                                  )
                            }
                            className="h-2 mt-2"
                          />
                        </div>
                      ))}
                    </div>

                    {/* View More Button */}
                    {universityMatches.length > 6 && !showAllUniversities && (
                      <div className="text-center mt-6">
                        <Button
                          onClick={() => setShowAllUniversities(true)}
                          variant="outline"
                          className="border-slate-200 hover:bg-slate-50"
                        >
                          View More Universities ({universityMatches.length - 6}{" "}
                          more)
                        </Button>
                      </div>
                    )}

                    {/* Show Less Button */}
                    {showAllUniversities && (
                      <div className="text-center mt-6">
                        <Button
                          onClick={() => setShowAllUniversities(false)}
                          variant="outline"
                          className="border-slate-200 hover:bg-slate-50"
                        >
                          Show Less
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Universities Tab */}
              <TabsContent value="universities" className="space-y-6">
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-slate-900">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-blue-500" />
                        University Matches
                      </div>
                      <Badge variant="outline">
                        {
                          universityMatches.filter(
                            (u) => u.eligiblePrograms > 0,
                          ).length
                        }{" "}
                        matches
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {universityMatches
                        .filter((u) => u.eligiblePrograms > 0)
                        .slice(0, 8)
                        .map((university, index) => (
                          <div
                            key={index}
                            className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                                    <Building className="h-5 w-5 text-slate-600" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-900">
                                      {university.university}
                                    </h4>
                                    <p className="text-sm text-slate-600 flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {university.location}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-slate-600">
                                    <span className="font-medium text-emerald-600">
                                      {university.eligiblePrograms}
                                    </span>{" "}
                                    eligible programs
                                  </span>
                                  <span className="text-slate-600">
                                    Avg APS:{" "}
                                    <span className="font-medium">
                                      {university.averageAPS}
                                    </span>
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      university.competitiveness === "High"
                                        ? "border-red-200 text-red-700 bg-red-50"
                                        : university.competitiveness ===
                                            "Moderate"
                                          ? "border-orange-200 text-orange-700 bg-orange-50"
                                          : "border-green-200 text-green-700 bg-green-50",
                                    )}
                                  >
                                    {university.competitiveness}
                                  </Badge>
                                </div>
                              </div>
                              <ChevronRight className="h-5 w-5 text-slate-400" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Programs Tab */}
              <TabsContent value="programs" className="space-y-6">
                {/* Filter Controls */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Filter className="h-5 w-5 text-slate-600" />
                      Program Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Button
                        variant={
                          selectedFilter === "all" ? "default" : "outline"
                        }
                        onClick={() => setSelectedFilter("all")}
                        className={`w-full sm:w-auto ${selectedFilter === "all" ? "bg-slate-900 hover:bg-slate-800" : ""}`}
                        size="sm"
                      >
                        All Programs
                      </Button>
                      <Button
                        variant={
                          selectedFilter === "eligible" ? "default" : "outline"
                        }
                        onClick={() => setSelectedFilter("eligible")}
                        className={`w-full sm:w-auto ${selectedFilter === "eligible" ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                        size="sm"
                      >
                        Eligible Only
                      </Button>
                      <Button
                        variant={
                          selectedFilter === "competitive"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => setSelectedFilter("competitive")}
                        className={`w-full sm:w-auto ${selectedFilter === "competitive" ? "bg-red-600 hover:bg-red-700" : ""}`}
                        size="sm"
                      >
                        Highly Competitive
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Program Results */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-slate-900">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-purple-500" />
                        Program Matches
                      </div>
                      <Badge variant="outline">
                        {filteredDegrees.length} results
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredDegrees.map((degree, index) => (
                        <div
                          key={index}
                          className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 mb-1">
                                {degree.name}
                              </h4>
                              <p className="text-sm text-slate-600 mb-2">
                                {degree.university} • {degree.faculty}
                              </p>
                              <p className="text-sm text-slate-700">
                                {degree.description}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge
                                variant={
                                  degree.eligible ? "default" : "destructive"
                                }
                                className={
                                  degree.eligible
                                    ? "bg-emerald-600 hover:bg-emerald-700"
                                    : ""
                                }
                              >
                                APS {degree.apsRequirement}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  degree.competitiveness === "High"
                                    ? "border-red-200 text-red-700 bg-red-50"
                                    : degree.competitiveness === "Moderate"
                                      ? "border-orange-200 text-orange-700 bg-orange-50"
                                      : "border-green-200 text-green-700 bg-green-50",
                                )}
                              >
                                {degree.competitiveness}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1 text-slate-600">
                                <Calendar className="h-3 w-3" />
                                {degree.duration}
                              </span>
                              {degree.eligible ? (
                                <span className="flex items-center gap-1 text-emerald-600">
                                  <CheckCircle className="h-3 w-3" />
                                  Eligible
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-red-600">
                                  <AlertTriangle className="h-3 w-3" />
                                  Need {degree.apsGap} more points
                                </span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              View Details
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate("/university-info?tool=bursaries")}
          >
            <CardContent className="p-6 text-center">
              <CreditCard className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">
                Find Bursaries
              </h3>
              <p className="text-sm text-slate-600">
                Discover funding opportunities for your studies
              </p>
            </CardContent>
          </Card>

          <Card
            className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate("/books")}
          >
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">
                Browse Textbooks
              </h3>
              <p className="text-sm text-slate-600">
                Find books for your chosen programs
              </p>
            </CardContent>
          </Card>

          <Card
            className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => navigate("/university-info")}
          >
            <CardContent className="p-6 text-center">
              <Lightbulb className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">
                University Guide
              </h3>
              <p className="text-sm text-slate-600">
                Explore universities and programs in detail
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModernAPSCalculator;
