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
  Building,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SOUTH_AFRICAN_SUBJECTS } from "@/constants/subjects";
import { toast } from "sonner";

// Sample hardcoded data to ensure functionality
const SAMPLE_UNIVERSITIES = [
  {
    name: "University of Cape Town",
    abbreviation: "UCT",
    location: "Cape Town, Western Cape",
    programs: [
      {
        name: "Medicine",
        apsRequirement: 42,
        faculty: "Health Sciences",
        duration: "6 years",
      },
      {
        name: "Computer Science",
        apsRequirement: 35,
        faculty: "Science",
        duration: "3 years",
      },
      {
        name: "Business Science",
        apsRequirement: 36,
        faculty: "Commerce",
        duration: "3 years",
      },
      { name: "Law", apsRequirement: 38, faculty: "Law", duration: "4 years" },
      {
        name: "Engineering",
        apsRequirement: 37,
        faculty: "Engineering",
        duration: "4 years",
      },
    ],
  },
  {
    name: "University of the Witwatersrand",
    abbreviation: "Wits",
    location: "Johannesburg, Gauteng",
    programs: [
      {
        name: "Medicine",
        apsRequirement: 40,
        faculty: "Health Sciences",
        duration: "6 years",
      },
      {
        name: "Computer Science",
        apsRequirement: 33,
        faculty: "Science",
        duration: "3 years",
      },
      {
        name: "Accounting",
        apsRequirement: 34,
        faculty: "Commerce",
        duration: "3 years",
      },
      {
        name: "Mechanical Engineering",
        apsRequirement: 35,
        faculty: "Engineering",
        duration: "4 years",
      },
      {
        name: "Psychology",
        apsRequirement: 32,
        faculty: "Humanities",
        duration: "3 years",
      },
    ],
  },
  {
    name: "Stellenbosch University",
    abbreviation: "SU",
    location: "Stellenbosch, Western Cape",
    programs: [
      {
        name: "Medicine",
        apsRequirement: 39,
        faculty: "Health Sciences",
        duration: "6 years",
      },
      {
        name: "Engineering",
        apsRequirement: 34,
        faculty: "Engineering",
        duration: "4 years",
      },
      {
        name: "Business Management",
        apsRequirement: 32,
        faculty: "Economic Sciences",
        duration: "3 years",
      },
      {
        name: "Agriculture",
        apsRequirement: 28,
        faculty: "AgriSciences",
        duration: "4 years",
      },
      {
        name: "Education",
        apsRequirement: 26,
        faculty: "Education",
        duration: "4 years",
      },
    ],
  },
  {
    name: "University of Pretoria",
    abbreviation: "UP",
    location: "Pretoria, Gauteng",
    programs: [
      {
        name: "Veterinary Science",
        apsRequirement: 38,
        faculty: "Veterinary Science",
        duration: "6 years",
      },
      {
        name: "Engineering",
        apsRequirement: 33,
        faculty: "Engineering",
        duration: "4 years",
      },
      {
        name: "BCom",
        apsRequirement: 30,
        faculty: "Economic Sciences",
        duration: "3 years",
      },
      {
        name: "Information Technology",
        apsRequirement: 29,
        faculty: "Engineering",
        duration: "3 years",
      },
      {
        name: "Social Work",
        apsRequirement: 25,
        faculty: "Humanities",
        duration: "4 years",
      },
    ],
  },
  {
    name: "University of KwaZulu-Natal",
    abbreviation: "UKZN",
    location: "Durban, KwaZulu-Natal",
    programs: [
      {
        name: "Medicine",
        apsRequirement: 37,
        faculty: "Health Sciences",
        duration: "6 years",
      },
      {
        name: "Engineering",
        apsRequirement: 32,
        faculty: "Engineering",
        duration: "4 years",
      },
      {
        name: "Science",
        apsRequirement: 28,
        faculty: "Science",
        duration: "3 years",
      },
      {
        name: "Education",
        apsRequirement: 24,
        faculty: "Education",
        duration: "4 years",
      },
      {
        name: "Arts",
        apsRequirement: 22,
        faculty: "Humanities",
        duration: "3 years",
      },
    ],
  },
];

// Types
interface APSSubject {
  name: string;
  marks: number;
  level: number;
  points: number;
}

interface DegreeInsight {
  name: string;
  university: string;
  faculty: string;
  apsRequirement: number;
  duration: string;
  eligible: boolean;
  apsGap?: number;
  competitiveness: "High" | "Moderate" | "Accessible";
}

// Default subjects
const CORE_SUBJECTS: APSSubject[] = [
  { name: "English Home Language", marks: 0, level: 4, points: 0 },
  { name: "Mathematics", marks: 0, level: 4, points: 0 },
  { name: "Select Subject", marks: 0, level: 4, points: 0 },
  { name: "Select Subject", marks: 0, level: 4, points: 0 },
  { name: "Select Subject", marks: 0, level: 4, points: 0 },
  { name: "Select Subject", marks: 0, level: 4, points: 0 },
];

// Sample subjects with good marks
const SAMPLE_SUBJECTS: APSSubject[] = [
  { name: "English Home Language", marks: 75, level: 4, points: 6 },
  { name: "Mathematics", marks: 80, level: 4, points: 7 },
  { name: "Physical Sciences", marks: 70, level: 4, points: 6 },
  { name: "Life Sciences", marks: 65, level: 4, points: 5 },
  { name: "Geography", marks: 72, level: 4, points: 6 },
  {
    name: "Afrikaans First Additional Language",
    marks: 68,
    level: 4,
    points: 5,
  },
];

// APS calculation function
const calculateAPSPoints = (marks: number): number => {
  if (isNaN(marks) || marks < 0) return 0;
  if (marks >= 80) return 7;
  if (marks >= 70) return 6;
  if (marks >= 60) return 5;
  if (marks >= 50) return 4;
  if (marks >= 40) return 3;
  if (marks >= 30) return 2;
  return 1;
};

// Performance level
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

const WorkingAPSCalculator: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [subjects, setSubjects] = useState<APSSubject[]>(CORE_SUBJECTS);
  const [activeInsight, setActiveInsight] = useState<
    "overview" | "universities" | "programs"
  >("programs");
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "eligible" | "competitive"
  >("all");

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

  // Update subject marks
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

  // Available subjects
  const availableSubjects = useMemo(() => {
    return SOUTH_AFRICAN_SUBJECTS.filter(
      (subject) =>
        !subjects.some((s) => s.name === subject) || subject.includes("Select"),
    );
  }, [subjects]);

  // Degree analysis
  const degreeAnalysis = useMemo(() => {
    const degrees: DegreeInsight[] = [];

    SAMPLE_UNIVERSITIES.forEach((university) => {
      university.programs.forEach((program) => {
        const eligible = totalAPS >= program.apsRequirement;
        const apsGap = eligible ? 0 : program.apsRequirement - totalAPS;

        let competitiveness: "High" | "Moderate" | "Accessible" = "Accessible";
        if (program.apsRequirement >= 32) competitiveness = "High";
        else if (program.apsRequirement >= 26) competitiveness = "Moderate";

        degrees.push({
          name: program.name,
          university: university.name,
          faculty: program.faculty,
          apsRequirement: program.apsRequirement,
          duration: program.duration,
          eligible,
          apsGap,
          competitiveness,
        });
      });
    });

    return degrees.sort((a, b) => {
      if (a.eligible && !b.eligible) return -1;
      if (!a.eligible && b.eligible) return 1;
      return a.apsRequirement - b.apsRequirement;
    });
  }, [totalAPS]);

  // University matches
  const universityMatches = useMemo(() => {
    return SAMPLE_UNIVERSITIES.map((university) => {
      const totalPrograms = university.programs.length;
      const eligiblePrograms = university.programs.filter(
        (p) => totalAPS >= p.apsRequirement,
      ).length;
      const averageAPS = Math.round(
        university.programs.reduce((sum, p) => sum + p.apsRequirement, 0) /
          totalPrograms,
      );

      let competitiveness: "High" | "Moderate" | "Accessible" = "Accessible";
      if (averageAPS >= 30) competitiveness = "High";
      else if (averageAPS >= 24) competitiveness = "Moderate";

      return {
        university: university.name,
        abbreviation: university.abbreviation,
        location: university.location,
        eligiblePrograms,
        totalPrograms,
        competitiveness,
        averageAPS,
      };
    }).sort((a, b) => b.eligiblePrograms - a.eligiblePrograms);
  }, [totalAPS]);

  // Statistics
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

    return {
      totalDegrees,
      eligibleCount,
      eligibilityRate,
      topUniversities,
      averageRequirement,
      performancePercentile: Math.min(100, Math.round((totalAPS / 42) * 100)),
    };
  }, [degreeAnalysis, universityMatches, totalAPS]);

  // Filter degrees
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

    return filtered.slice(0, 20);
  }, [degreeAnalysis, selectedFilter]);

  const handleReset = () => {
    setSubjects(CORE_SUBJECTS);
    toast.success("Calculator reset");
  };

  const handleLoadSample = () => {
    setSubjects(SAMPLE_SUBJECTS);
    toast.success("Sample marks loaded (APS: 35)");
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
            <h1 className="text-4xl font-bold mb-4">APS Calculator</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Calculate your Admission Point Score and discover which university
              programs you qualify for.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
              <TrendingUp className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {totalAPS}
              </div>
              <div className="text-slate-300 text-sm">Your APS</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
              <Target className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {stats.eligibilityRate}%
              </div>
              <div className="text-slate-300 text-sm">Eligibility Rate</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
              <Building className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {stats.topUniversities}
              </div>
              <div className="text-slate-300 text-sm">Universities</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
              <GraduationCap className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">
                {stats.eligibleCount}
              </div>
              <div className="text-slate-300 text-sm">Eligible Programs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Calculator */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle>APS Calculator</CardTitle>
                <CardDescription>Enter your marks below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={index} className="space-y-2">
                    <Label>{`Subject ${index + 1}`}</Label>
                    <div className="flex gap-2 items-center">
                      <Select
                        value={subject.name}
                        onValueChange={(value) =>
                          updateSubjectName(index, value)
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {subject.name !== "Select Subject" && (
                            <SelectItem value={subject.name}>
                              {subject.name}
                            </SelectItem>
                          )}
                          {availableSubjects.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                        className="w-20"
                        placeholder="0"
                      />
                      <Badge
                        className={cn(
                          subject.points >= 5
                            ? "bg-emerald-100 text-emerald-700"
                            : subject.points >= 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {subject.points}
                      </Badge>
                    </div>
                  </div>
                ))}

                {/* Result */}
                <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">{totalAPS}</div>
                    <div className="text-gray-600 mb-4">Total APS Score</div>
                    <Badge className={performance.color}>
                      {performance.level}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <Progress value={stats.performancePercentile} />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleLoadSample}
                    className="flex-1 bg-emerald-600"
                  >
                    Try Sample
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeInsight}
              onValueChange={(value) => setActiveInsight(value as any)}
            >
              <TabsList className="grid grid-cols-3 w-full mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="universities">Universities</TabsTrigger>
                <TabsTrigger value="programs">Programs</TabsTrigger>
              </TabsList>

              <TabsContent value="programs">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Programs</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={
                            selectedFilter === "all" ? "default" : "outline"
                          }
                          onClick={() => setSelectedFilter("all")}
                        >
                          All
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            selectedFilter === "eligible"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSelectedFilter("eligible")}
                        >
                          Eligible
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            selectedFilter === "competitive"
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSelectedFilter("competitive")}
                        >
                          Competitive
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredDegrees.map((degree, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold">{degree.name}</h4>
                              <p className="text-sm text-gray-600">
                                {degree.university} • {degree.faculty}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  degree.eligible ? "default" : "destructive"
                                }
                              >
                                APS {degree.apsRequirement}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  degree.competitiveness === "High"
                                    ? "border-red-200 text-red-700"
                                    : degree.competitiveness === "Moderate"
                                      ? "border-orange-200 text-orange-700"
                                      : "border-green-200 text-green-700",
                                )}
                              >
                                {degree.competitiveness}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
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
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="universities">
                <Card>
                  <CardHeader>
                    <CardTitle>University Matches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {universityMatches
                        .filter((u) => u.eligiblePrograms > 0)
                        .map((uni, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-semibold">
                                  {uni.university}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {uni.location}
                                </p>
                                <p className="text-sm">
                                  <span className="text-emerald-600 font-medium">
                                    {uni.eligiblePrograms}
                                  </span>{" "}
                                  of {uni.totalPrograms} programs available
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  uni.competitiveness === "High"
                                    ? "border-red-200 text-red-700"
                                    : uni.competitiveness === "Moderate"
                                      ? "border-orange-200 text-orange-700"
                                      : "border-green-200 text-green-700",
                                )}
                              >
                                {uni.competitiveness}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Eligibility Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Total Programs</span>
                          <span className="font-bold">
                            {stats.totalDegrees}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Eligible Programs</span>
                          <span className="font-bold text-emerald-600">
                            {stats.eligibleCount}
                          </span>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Eligibility Rate</span>
                            <span>{stats.eligibilityRate}%</span>
                          </div>
                          <Progress value={stats.eligibilityRate} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span>Your APS</span>
                          <span className="font-bold">{totalAPS}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Average Required</span>
                          <span className="font-bold">
                            {stats.averageRequirement}
                          </span>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Performance Level</span>
                            <span>{performance.level}</span>
                          </div>
                          <Progress value={stats.performancePercentile} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingAPSCalculator;
