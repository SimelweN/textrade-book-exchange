import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Calculator,
  GraduationCap,
  School,
  BookOpen,
  Check,
  X,
  Info,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Award,
  Star,
  Clock,
  Lightbulb,
  Bookmark,
  BookmarkPlus,
  Trash2,
  Save,
  RefreshCw,
  Download,
  Share2,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities";
import { SOUTH_AFRICAN_SUBJECTS } from "@/constants/subjects";
import { toast } from "sonner";
import {
  University,
  Degree,
  APSSubject,
  EligibleDegree,
  APSCalculation,
} from "@/types/university";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { calculateAPS } from "@/utils/apsCalculation";

// Default subjects for APS calculation
const DEFAULT_SUBJECTS: APSSubject[] = [
  { name: "English Home Language", marks: 0, level: 0, points: 0 },
  { name: "Mathematics", marks: 0, level: 0, points: 0 },
  { name: "Physical Sciences", marks: 0, level: 0, points: 0 },
  { name: "Life Sciences", marks: 0, level: 0, points: 0 },
  { name: "Additional Subject 1", marks: 0, level: 0, points: 0 },
  { name: "Additional Subject 2", marks: 0, level: 0, points: 0 },
  { name: "Additional Subject 3", marks: 0, level: 0, points: 0 },
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

// Check if a student is eligible for a degree based on APS and subjects
const checkEligibility = (
  totalAPS: number,
  subjects: APSSubject[],
  degree: Degree,
  university: University,
): { eligible: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  let eligible = true;

  try {
    // Check total APS
    if (totalAPS < degree.apsRequirement) {
      reasons.push(
        `Your APS score (${totalAPS}) is below the required minimum (${degree.apsRequirement})`,
      );
      eligible = false;
    }

    // Check required subjects
    if (
      degree.subjects &&
      Array.isArray(degree.subjects) &&
      degree.subjects.length > 0
    ) {
      degree.subjects.forEach((subject) => {
        try {
          // Handle both string and object subjects
          const isRequired =
            typeof subject === "string" ? false : subject.isRequired;
          const subjectName =
            typeof subject === "string" ? subject : subject.name;

          if (!subjectName) return; // Skip invalid subjects

          if (isRequired) {
            // Find the subject in student's subjects
            const studentSubject = subjects.find(
              (s) =>
                s.name && s.name.toLowerCase() === subjectName.toLowerCase(),
            );

            // Check if student has the subject and meets minimum level
            const subjectLevel =
              typeof subject === "string" ? 4 : subject.level || 4;

            if (!studentSubject) {
              reasons.push(
                `${subjectName} is required but not in your subject list`,
              );
              eligible = false;
            } else if (studentSubject.level < subjectLevel) {
              reasons.push(
                `${subjectName} requires level ${subjectLevel} but you have level ${studentSubject.level}`,
              );
              eligible = false;
            }
          }
        } catch (subjectError) {
          console.warn("Error processing subject requirement:", subjectError);
        }
      });
    }
  } catch (error) {
    console.error("Error in checkEligibility:", error);
    eligible = false;
    reasons.push("Error checking eligibility requirements");
  }

  return { eligible, reasons };
};

// Find eligible degrees based on APS calculation
const findEligibleDegrees = (
  subjects: APSSubject[],
  totalAPS: number,
): EligibleDegree[] => {
  const eligibleDegrees: EligibleDegree[] = [];

  try {
    // Ensure universities data is available
    if (
      !ALL_SOUTH_AFRICAN_UNIVERSITIES ||
      !Array.isArray(ALL_SOUTH_AFRICAN_UNIVERSITIES)
    ) {
      console.error("Universities data not available");
      return [];
    }

    ALL_SOUTH_AFRICAN_UNIVERSITIES.forEach((university) => {
      try {
        if (
          !university ||
          !university.faculties ||
          !Array.isArray(university.faculties)
        ) {
          console.warn(
            `Invalid university data for: ${university?.name || "Unknown"}`,
          );
          return;
        }

        university.faculties.forEach((faculty) => {
          try {
            if (
              !faculty ||
              !faculty.degrees ||
              !Array.isArray(faculty.degrees)
            ) {
              return;
            }

            faculty.degrees.forEach((degree) => {
              try {
                if (!degree || typeof degree.apsRequirement !== "number") {
                  return;
                }

                const { eligible } = checkEligibility(
                  totalAPS,
                  subjects,
                  degree,
                  university,
                );
                const meetsRequirement = totalAPS >= degree.apsRequirement;
                const apsGap = meetsRequirement
                  ? 0
                  : degree.apsRequirement - totalAPS;

                eligibleDegrees.push({
                  degree: {
                    ...degree,
                    faculty: faculty.name, // Ensure faculty is properly set
                  },
                  university,
                  meetsRequirement,
                  apsGap: apsGap > 0 ? apsGap : undefined,
                });
              } catch (degreeError) {
                console.warn("Error processing degree:", degreeError);
              }
            });
          } catch (facultyError) {
            console.warn("Error processing faculty:", facultyError);
          }
        });
      } catch (universityError) {
        console.warn("Error processing university:", universityError);
      }
    });

    // Sort by eligibility and APS requirement
    eligibleDegrees.sort((a, b) => {
      if (a.meetsRequirement && !b.meetsRequirement) return -1;
      if (!a.meetsRequirement && b.meetsRequirement) return 1;
      return a.degree.apsRequirement - b.degree.apsRequirement;
    });
  } catch (error) {
    console.error("Error in findEligibleDegrees:", error);
    // Return empty array on error to prevent component crash
    return [];
  }

  return eligibleDegrees;
};

interface EnhancedAPSCalculatorV2Props {
  onCalculationComplete: (calculation: APSCalculation) => void;
  selectedUniversityId?: string;
}

const EnhancedAPSCalculatorV2 = ({
  onCalculationComplete,
  selectedUniversityId,
}: EnhancedAPSCalculatorV2Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Main calculator state
  const [subjects, setSubjects] = useState<APSSubject[]>(DEFAULT_SUBJECTS);
  const [calculationResults, setCalculationResults] =
    useState<APSCalculation | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");

  // UI state
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [filteredUniversities, setFilteredUniversities] = useState<
    University[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minAPS, setMinAPS] = useState(20);
  const [maxAPS, setMaxAPS] = useState(45);
  const [selectedFaculties, setSelectedFaculties] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"aps" | "name" | "university">("aps");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Storage and sharing
  const [savedCalculations, setSavedCalculations] = useLocalStorage<any[]>(
    "aps-calculations",
    [],
  );
  const [activeCalculationName, setActiveCalculationName] = useState("");
  const [bookmarkedDegrees, setBookmarkedDegrees] = useLocalStorage<string[]>(
    "bookmarked-degrees",
    [],
  );

  // Error handling
  const [error, setError] = useState<string | null>(null);

  // Update subject marks and recalculate points
  const updateSubjectMarks = useCallback(
    (index: number, marks: number) => {
      try {
        if (marks < 0 || marks > 100) {
          setError("Marks must be between 0 and 100");
          return;
        }

        setError(null);
        const newSubjects = [...subjects];
        newSubjects[index] = {
          ...newSubjects[index],
          marks,
          points: calculateAPSPoints(marks),
          level: calculateAPSPoints(marks),
        };
        setSubjects(newSubjects);
      } catch (err) {
        console.error("Error updating subject marks:", err);
        setError("Error updating subject marks");
      }
    },
    [subjects],
  );

  // Update subject name
  const updateSubjectName = useCallback(
    (index: number, name: string) => {
      try {
        const newSubjects = [...subjects];
        newSubjects[index] = {
          ...newSubjects[index],
          name,
        };
        setSubjects(newSubjects);
        setError(null);
      } catch (err) {
        console.error("Error updating subject name:", err);
        setError("Error updating subject name");
      }
    },
    [subjects],
  );

  // Calculate APS and find eligible degrees
  const performCalculation = useCallback(async () => {
    try {
      setIsCalculating(true);
      setError(null);

      // Validate subjects have valid marks
      const validSubjects = subjects.filter(
        (subject) =>
          subject.name &&
          subject.name !== "Additional Subject 1" &&
          subject.name !== "Additional Subject 2" &&
          subject.name !== "Additional Subject 3" &&
          subject.marks >= 0 &&
          subject.marks <= 100,
      );

      if (validSubjects.length < 4) {
        throw new Error("Please enter at least 4 valid subjects with marks");
      }

      // Ensure we have required subjects
      const hasEnglish = validSubjects.some((s) =>
        s.name.toLowerCase().includes("english"),
      );
      const hasMath = validSubjects.some((s) =>
        s.name.toLowerCase().includes("math"),
      );

      if (!hasEnglish) {
        throw new Error(
          "English (Home Language or First Additional Language) is required",
        );
      }

      if (!hasMath) {
        throw new Error("Mathematics or Mathematical Literacy is required");
      }

      // Calculate total APS (excluding Life Orientation)
      const contributingSubjects = validSubjects.filter(
        (subject) => !subject.name.toLowerCase().includes("life orientation"),
      );

      const totalScore = contributingSubjects.reduce((total, subject) => {
        return total + subject.points;
      }, 0);

      // Find eligible degrees
      const eligibleDegrees = findEligibleDegrees(validSubjects, totalScore);

      const calculation: APSCalculation = {
        subjects: validSubjects,
        totalScore,
        eligibleDegrees,
      };

      setCalculationResults(calculation);
      setShowResults(true);
      onCalculationComplete(calculation);

      // Show success message
      toast.success(
        `APS calculated: ${totalScore} points. Found ${eligibleDegrees.length} programs.`,
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error calculating APS";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Calculation error:", err);
    } finally {
      setIsCalculating(false);
    }
  }, [subjects, onCalculationComplete]);

  // Save calculation locally
  const saveCalculationLocally = useCallback(() => {
    try {
      if (!activeCalculationName.trim()) {
        toast.error("Please enter a name for this calculation");
        return;
      }

      if (!calculationResults) {
        toast.error("No calculation to save");
        return;
      }

      const savedCalculation = {
        id: Date.now().toString(),
        name: activeCalculationName,
        subjects: subjects,
        totalScore: calculationResults.totalScore,
        createdAt: new Date().toISOString(),
      };

      setSavedCalculations([...savedCalculations, savedCalculation]);
      toast.success("Calculation saved locally");
      setActiveCalculationName("");
    } catch (err) {
      console.error("Error saving calculation:", err);
      toast.error("Failed to save calculation");
    }
  }, [
    activeCalculationName,
    calculationResults,
    subjects,
    savedCalculations,
    setSavedCalculations,
  ]);

  // Save calculation to user account (if logged in)
  const saveCalculationToAccount = useCallback(async () => {
    try {
      if (!user) {
        toast.error(
          "You must be logged in to save calculations to your account",
        );
        return;
      }

      if (!activeCalculationName.trim()) {
        toast.error("Please enter a name for this calculation");
        return;
      }

      const { data, error } = await supabase.from("aps_calculations").insert({
        user_id: user.id,
        name: activeCalculationName,
        subjects: subjects,
        total_score: calculationResults?.totalScore || 0,
      });

      if (error) throw error;

      toast.success("Calculation saved to your account");
      setActiveCalculationName("");
    } catch (error) {
      console.error("Error saving calculation:", error);
      toast.error("Failed to save calculation to your account");
    }
  }, [user, activeCalculationName, subjects, calculationResults]);

  // Share calculation
  const shareCalculation = useCallback(() => {
    try {
      const shareData = {
        subjects: subjects.filter((s) => s.name && s.marks > 0),
        totalScore: calculationResults?.totalScore,
      };

      const shareUrl = `${window.location.origin}/university-info?tool=aps-calculator&data=${encodeURIComponent(JSON.stringify(shareData))}`;

      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          toast.success("Share link copied to clipboard");
        })
        .catch(() => {
          toast.error("Failed to copy share link");
        });
    } catch (err) {
      console.error("Error sharing calculation:", err);
      toast.error("Failed to create share link");
    }
  }, [subjects, calculationResults]);

  // Load shared calculation from URL
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const sharedData = urlParams.get("data");

      if (sharedData) {
        try {
          const data = JSON.parse(decodeURIComponent(sharedData));
          if (data.subjects && Array.isArray(data.subjects)) {
            setSubjects(data.subjects);
            setActiveTab("calculator");
          }
        } catch (error) {
          console.error("Error parsing subjects from URL:", error);
        }
      }
    } catch (err) {
      console.error("Error loading shared data:", err);
    }
  }, [location.search]);

  // Get unique faculties for filtering
  const availableFaculties = useMemo(() => {
    try {
      const faculties = new Set<string>();

      if (calculationResults?.eligibleDegrees) {
        calculationResults.eligibleDegrees.forEach((eligible) => {
          if (eligible.degree?.faculty) {
            faculties.add(eligible.degree.faculty);
          }
        });
      }

      return Array.from(faculties).sort();
    } catch (err) {
      console.error("Error getting faculties:", err);
      return [];
    }
  }, [calculationResults]);

  // Filter and sort results
  const filteredResults = useMemo(() => {
    try {
      if (!calculationResults?.eligibleDegrees) {
        return [];
      }

      let filtered = calculationResults.eligibleDegrees.filter((eligible) => {
        // Search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch =
            eligible.degree?.name?.toLowerCase().includes(searchLower) ||
            eligible.university?.name?.toLowerCase().includes(searchLower) ||
            eligible.degree?.faculty?.toLowerCase().includes(searchLower);

          if (!matchesSearch) return false;
        }

        // APS range filter
        if (eligible.degree?.apsRequirement) {
          if (
            eligible.degree.apsRequirement < minAPS ||
            eligible.degree.apsRequirement > maxAPS
          ) {
            return false;
          }
        }

        // Faculty filter
        if (selectedFaculties.length > 0) {
          if (
            !eligible.degree?.faculty ||
            !selectedFaculties.includes(eligible.degree.faculty)
          ) {
            return false;
          }
        }

        return true;
      });

      // Sort results
      filtered.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case "aps":
            comparison =
              (a.degree?.apsRequirement || 0) - (b.degree?.apsRequirement || 0);
            break;
          case "name":
            comparison = (a.degree?.name || "").localeCompare(
              b.degree?.name || "",
            );
            break;
          case "university":
            comparison = (a.university?.name || "").localeCompare(
              b.university?.name || "",
            );
            break;
        }

        return sortOrder === "desc" ? -comparison : comparison;
      });

      return filtered;
    } catch (err) {
      console.error("Error filtering results:", err);
      return [];
    }
  }, [
    calculationResults,
    searchTerm,
    minAPS,
    maxAPS,
    selectedFaculties,
    sortBy,
    sortOrder,
  ]);

  // Add/remove degree bookmark
  const toggleBookmark = useCallback(
    (degreeId: string) => {
      try {
        const isBookmarked = bookmarkedDegrees.includes(degreeId);

        if (isBookmarked) {
          setBookmarkedDegrees(
            bookmarkedDegrees.filter((id) => id !== degreeId),
          );
          toast.success("Removed from bookmarks");
        } else {
          setBookmarkedDegrees([...bookmarkedDegrees, degreeId]);
          toast.success("Added to bookmarks");
        }
      } catch (err) {
        console.error("Error toggling bookmark:", err);
        toast.error("Failed to update bookmark");
      }
    },
    [bookmarkedDegrees, setBookmarkedDegrees],
  );

  // Reset calculator
  const resetCalculator = useCallback(() => {
    try {
      setSubjects(DEFAULT_SUBJECTS);
      setCalculationResults(null);
      setShowResults(false);
      setError(null);
      setSearchTerm("");
      setSelectedFaculties([]);
      setActiveCalculationName("");
      toast.success("Calculator reset");
    } catch (err) {
      console.error("Error resetting calculator:", err);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="results" disabled={!showResults}>
            Results {calculationResults && `(${calculationResults.totalScore})`}
          </TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="help">Help</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-5 h-5" />
                <span>APS Calculator</span>
              </CardTitle>
              <CardDescription>
                Enter your National Senior Certificate subject marks to
                calculate your Admission Point Score (APS).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject Input Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Your Subjects</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetCalculator}
                    className="text-red-600 hover:text-red-700"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-center">Marks (%)</TableHead>
                        <TableHead className="text-center">
                          APS Points
                        </TableHead>
                        <TableHead className="text-center">Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.map((subject, index) => (
                        <TableRow key={index}>
                          <TableCell className="w-1/2">
                            <Select
                              value={subject.name}
                              onValueChange={(value) =>
                                updateSubjectName(index, value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {SOUTH_AFRICAN_SUBJECTS.map((subjectOption) => (
                                  <SelectItem
                                    key={subjectOption}
                                    value={subjectOption}
                                  >
                                    {subjectOption}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={subject.marks || ""}
                              onChange={(e) =>
                                updateSubjectMarks(
                                  index,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              placeholder="0-100"
                              className="text-center"
                            />
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {subject.points}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                subject.points >= 4 ? "default" : "secondary"
                              }
                              className={
                                subject.points >= 4
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                            >
                              Level {subject.level}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableCaption>
                      <div className="text-left space-y-2">
                        <p className="font-medium">
                          Total APS:{" "}
                          {subjects.reduce((total, s) => total + s.points, 0)}{" "}
                          points
                        </p>
                        <p className="text-sm text-gray-600">
                          * Life Orientation is excluded from APS calculation
                        </p>
                      </div>
                    </TableCaption>
                  </Table>
                </div>

                {/* Calculate Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    onClick={performCalculation}
                    disabled={isCalculating}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {isCalculating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="w-4 h-4 mr-2" />
                        Calculate APS & Find Programs
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick APS Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>APS Points System</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center">
                <div className="bg-green-100 p-2 rounded">
                  <div className="font-bold text-green-800">7</div>
                  <div className="text-xs">80-100%</div>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <div className="font-bold text-blue-800">6</div>
                  <div className="text-xs">70-79%</div>
                </div>
                <div className="bg-indigo-100 p-2 rounded">
                  <div className="font-bold text-indigo-800">5</div>
                  <div className="text-xs">60-69%</div>
                </div>
                <div className="bg-purple-100 p-2 rounded">
                  <div className="font-bold text-purple-800">4</div>
                  <div className="text-xs">50-59%</div>
                </div>
                <div className="bg-yellow-100 p-2 rounded">
                  <div className="font-bold text-yellow-800">3</div>
                  <div className="text-xs">40-49%</div>
                </div>
                <div className="bg-orange-100 p-2 rounded">
                  <div className="font-bold text-orange-800">2</div>
                  <div className="text-xs">30-39%</div>
                </div>
                <div className="bg-red-100 p-2 rounded">
                  <div className="font-bold text-red-800">1</div>
                  <div className="text-xs">0-29%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {calculationResults && (
            <>
              {/* Results Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Your APS Results</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={shareCalculation}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      {user && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveCalculationToAccount}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save to Account
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center bg-blue-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {calculationResults.totalScore}
                      </div>
                      <div className="text-gray-600">Your APS Score</div>
                    </div>

                    <div className="text-center bg-green-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {
                          calculationResults.eligibleDegrees.filter(
                            (d) => d.meetsRequirement,
                          ).length
                        }
                      </div>
                      <div className="text-gray-600">Eligible Programs</div>
                    </div>

                    <div className="text-center bg-purple-50 rounded-lg p-6">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {calculationResults.eligibleDegrees.length}
                      </div>
                      <div className="text-gray-600">Total Programs</div>
                    </div>
                  </div>

                  {/* Save calculation form */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter calculation name"
                        value={activeCalculationName}
                        onChange={(e) =>
                          setActiveCalculationName(e.target.value)
                        }
                        className="flex-1"
                      />
                      <Button onClick={saveCalculationLocally}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Filters and Search */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="w-5 h-5" />
                    <span>
                      Filter Results ({filteredResults.length} programs)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Search */}
                    <div>
                      <Label>Search Programs</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search by program or university"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* APS Range */}
                    <div>
                      <Label>
                        APS Range: {minAPS} - {maxAPS}
                      </Label>
                      <div className="pt-2">
                        <Slider
                          value={[minAPS, maxAPS]}
                          onValueChange={([min, max]) => {
                            setMinAPS(min);
                            setMaxAPS(max);
                          }}
                          min={20}
                          max={45}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* Sort Options */}
                    <div>
                      <Label>Sort By</Label>
                      <div className="flex gap-2">
                        <Select
                          value={sortBy}
                          onValueChange={(value: any) => setSortBy(value)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aps">APS Requirement</SelectItem>
                            <SelectItem value="name">Program Name</SelectItem>
                            <SelectItem value="university">
                              University
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }
                        >
                          <ArrowUpDown className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Faculty Filter */}
                  {availableFaculties.length > 0 && (
                    <div>
                      <Label>Filter by Faculty</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {availableFaculties.map((faculty) => (
                          <div
                            key={faculty}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={faculty}
                              checked={selectedFaculties.includes(faculty)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedFaculties([
                                    ...selectedFaculties,
                                    faculty,
                                  ]);
                                } else {
                                  setSelectedFaculties(
                                    selectedFaculties.filter(
                                      (f) => f !== faculty,
                                    ),
                                  );
                                }
                              }}
                            />
                            <Label htmlFor={faculty} className="text-sm">
                              {faculty}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results List */}
              <Card>
                <CardHeader>
                  <CardTitle>Program Results</CardTitle>
                  <CardDescription>
                    Showing {filteredResults.length} programs matching your
                    criteria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredResults.length === 0 ? (
                    <div className="text-center py-8">
                      <GraduationCap className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">
                        No programs match your current filters.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedFaculties([]);
                          setMinAPS(20);
                          setMaxAPS(45);
                        }}
                        className="mt-4"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredResults.slice(0, 50).map((eligible, index) => (
                        <div
                          key={`${eligible.university.id}-${eligible.degree.id}-${index}`}
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {eligible.degree.name}
                                </h3>
                                <Badge
                                  className={
                                    eligible.meetsRequirement
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : "bg-red-100 text-red-800 border-red-200"
                                  }
                                >
                                  {eligible.meetsRequirement
                                    ? "Eligible"
                                    : "Not Eligible"}
                                </Badge>
                              </div>

                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                                <span className="font-medium">
                                  {eligible.university.abbreviation ||
                                    eligible.university.name}
                                </span>
                                <span>•</span>
                                <span>{eligible.degree.faculty}</span>
                                <span>•</span>
                                <span>{eligible.degree.duration}</span>
                                <span>•</span>
                                <span className="text-blue-600 font-medium">
                                  APS: {eligible.degree.apsRequirement}
                                </span>
                                {eligible.apsGap && (
                                  <>
                                    <span>•</span>
                                    <span className="text-orange-600">
                                      Gap: {eligible.apsGap} points
                                    </span>
                                  </>
                                )}
                              </div>

                              <p className="text-sm text-gray-600 mb-3">
                                {eligible.degree.description ||
                                  "No description available."}
                              </p>

                              {/* Career Prospects */}
                              {eligible.degree.careerProspects &&
                                eligible.degree.careerProspects.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {eligible.degree.careerProspects
                                      .slice(0, 4)
                                      .map((career, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="secondary"
                                          className="text-xs bg-gray-100"
                                        >
                                          {career}
                                        </Badge>
                                      ))}
                                    {eligible.degree.careerProspects.length >
                                      4 && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs bg-gray-100"
                                      >
                                        +
                                        {eligible.degree.careerProspects
                                          .length - 4}{" "}
                                        more
                                      </Badge>
                                    )}
                                  </div>
                                )}
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBookmark(eligible.degree.id)}
                              className={
                                bookmarkedDegrees.includes(eligible.degree.id)
                                  ? "text-yellow-600 hover:text-yellow-700"
                                  : "text-gray-400 hover:text-gray-600"
                              }
                            >
                              {bookmarkedDegrees.includes(
                                eligible.degree.id,
                              ) ? (
                                <Bookmark className="w-4 h-4" />
                              ) : (
                                <BookmarkPlus className="w-4 h-4" />
                              )}
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/books?university=${eligible.university.id}&degree=${eligible.degree.id}`,
                                )
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              View Books
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/university/${eligible.university.id}`,
                                )
                              }
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <School className="w-4 h-4 mr-2" />
                              University Info
                            </Button>
                          </div>
                        </div>
                      ))}

                      {filteredResults.length > 50 && (
                        <div className="text-center py-4">
                          <p className="text-gray-600 mb-4">
                            Showing first 50 results. Use filters to narrow down
                            your search.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Calculations</CardTitle>
              <CardDescription>
                Your locally saved APS calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedCalculations.length === 0 ? (
                <div className="text-center py-8">
                  <Save className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No saved calculations yet.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Calculate your APS and save it for future reference.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedCalculations.map((calc, index) => (
                    <div
                      key={calc.id || index}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{calc.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge>{calc.totalScore} APS</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updatedCalcs = savedCalculations.filter(
                                (_, i) => i !== index,
                              );
                              setSavedCalculations(updatedCalcs);
                              toast.success("Calculation deleted");
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Saved on {new Date(calc.createdAt).toLocaleDateString()}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSubjects(calc.subjects);
                          setActiveTab("calculator");
                          toast.success("Calculation loaded");
                        }}
                      >
                        Load Calculation
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5" />
                <span>How to Use the APS Calculator</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">
                    Step 1: Enter Your Subjects
                  </h3>
                  <p className="text-sm text-gray-600">
                    Select your National Senior Certificate subjects from the
                    dropdown menus. You need at least English (Home Language or
                    First Additional Language) and Mathematics or Mathematical
                    Literacy.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Step 2: Enter Your Marks</h3>
                  <p className="text-sm text-gray-600">
                    Enter your final examination marks (0-100%) for each
                    subject. The system will automatically convert these to APS
                    points.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">
                    Step 3: Calculate Your APS
                  </h3>
                  <p className="text-sm text-gray-600">
                    Click "Calculate APS & Find Programs" to see your total APS
                    score and discover which university programs you qualify
                    for.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Step 4: Explore Results</h3>
                  <p className="text-sm text-gray-600">
                    Filter and sort through available programs, bookmark
                    interesting options, and explore related textbooks and
                    university information.
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Important Notes</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Life Orientation is excluded from APS calculations</li>
                  <li>
                    You need a minimum of 4 subjects for university admission
                  </li>
                  <li>
                    Different programs have different subject requirements
                  </li>
                  <li>APS requirements may vary by year and university</li>
                  <li>
                    Always check with universities for the most current
                    requirements
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">APS Points Scale</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>7 points:</span>
                    <span>80-100% (Outstanding Achievement)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>6 points:</span>
                    <span>70-79% (Meritorious Achievement)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5 points:</span>
                    <span>60-69% (Substantial Achievement)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4 points:</span>
                    <span>50-59% (Adequate Achievement)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3 points:</span>
                    <span>40-49% (Moderate Achievement)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2 points:</span>
                    <span>30-39% (Elementary Achievement)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 point:</span>
                    <span>0-29% (Not Achieved)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAPSCalculatorV2;
