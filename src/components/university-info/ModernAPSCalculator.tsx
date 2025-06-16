import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calculator,
  GraduationCap,
  Award,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities/index";

interface Subject {
  name: string;
  marks: number;
  level: number;
  points: number;
}

interface QualifyingProgram {
  programName: string;
  universityName: string;
  universityAbbr: string;
  faculty: string;
  apsRequirement: number;
  duration: string;
  description: string;
}

const ModernAPSCalculator: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { name: "English Home Language", marks: 0, level: 4, points: 0 },
    { name: "Mathematics", marks: 0, level: 4, points: 0 },
    { name: "Physical Sciences", marks: 0, level: 4, points: 0 },
    { name: "Life Sciences", marks: 0, level: 4, points: 0 },
    { name: "Geography", marks: 0, level: 4, points: 0 },
    { name: "History", marks: 0, level: 4, points: 0 },
  ]);

  const [isCalculated, setIsCalculated] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  // APS Calculation function
  const calculateAPS = (marks: number): number => {
    if (marks >= 80) return 7;
    if (marks >= 70) return 6;
    if (marks >= 60) return 5;
    if (marks >= 50) return 4;
    if (marks >= 40) return 3;
    if (marks >= 30) return 2;
    return 1;
  };

  // Update subject marks and calculate points
  const updateSubjectMarks = (index: number, marks: number) => {
    const newSubjects = [...subjects];
    newSubjects[index].marks = marks;
    newSubjects[index].points = calculateAPS(marks);
    setSubjects(newSubjects);
  };

  // Calculate total APS
  const totalAPS = useMemo(() => {
    return subjects.reduce((total, subject) => total + subject.points, 0);
  }, [subjects]);

  // Get qualifying programs
  const qualifyingPrograms = useMemo(() => {
    if (!isCalculated || totalAPS === 0) return [];

    const programs: QualifyingProgram[] = [];

    ALL_SOUTH_AFRICAN_UNIVERSITIES.forEach((university) => {
      university.faculties?.forEach((faculty) => {
        faculty.degrees?.forEach((degree) => {
          if (degree.apsRequirement <= totalAPS) {
            programs.push({
              programName: degree.name,
              universityName: university.name,
              universityAbbr: university.abbreviation,
              faculty: faculty.name,
              apsRequirement: degree.apsRequirement,
              duration: degree.duration,
              description: degree.description,
            });
          }
        });
      });
    });

    // Sort by faculty and then by APS requirement (highest first)
    return programs.sort((a, b) => {
      if (a.faculty !== b.faculty) {
        return a.faculty.localeCompare(b.faculty);
      }
      return b.apsRequirement - a.apsRequirement;
    });
  }, [totalAPS, isCalculated]);

  // Group programs by faculty
  const programsByFaculty = useMemo(() => {
    const grouped: { [faculty: string]: QualifyingProgram[] } = {};

    qualifyingPrograms.forEach((program) => {
      if (!grouped[program.faculty]) {
        grouped[program.faculty] = [];
      }
      grouped[program.faculty].push(program);
    });

    return grouped;
  }, [qualifyingPrograms]);

  const handleCalculate = () => {
    setShowAnimation(true);
    setTimeout(() => {
      setIsCalculated(true);
      setShowAnimation(false);
    }, 1500);
  };

  const handleReset = () => {
    setSubjects(
      subjects.map((subject) => ({
        ...subject,
        marks: 0,
        points: 0,
      })),
    );
    setIsCalculated(false);
    setShowAnimation(false);
  };

  // Check if calculation is valid
  const hasValidMarks = subjects.some((subject) => subject.marks > 0);
  const hasEnglishAndMath = subjects[0].marks > 0 && subjects[1].marks > 0;

  const getAPSGrade = (aps: number) => {
    if (aps >= 40)
      return {
        label: "Excellent",
        color: "from-green-500 to-emerald-600",
        textColor: "text-green-700",
      };
    if (aps >= 35)
      return {
        label: "Very Good",
        color: "from-blue-500 to-blue-600",
        textColor: "text-blue-700",
      };
    if (aps >= 30)
      return {
        label: "Good",
        color: "from-yellow-500 to-yellow-600",
        textColor: "text-yellow-700",
      };
    if (aps >= 25)
      return {
        label: "Average",
        color: "from-orange-500 to-orange-600",
        textColor: "text-orange-700",
      };
    return {
      label: "Below Average",
      color: "from-red-500 to-red-600",
      textColor: "text-red-700",
    };
  };

  const apsGrade = getAPSGrade(totalAPS);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="relative flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                APS Calculator
              </h1>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Calculate your Admission Point Score and discover your university
            opportunities with our intelligent matching system
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculator Section */}
          <div className="space-y-8">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-8 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <Target className="h-6 w-6 text-green-600" />
                  Enter Your Matric Results
                </CardTitle>
                <p className="text-gray-600 text-lg">
                  Input your final matric percentage for each subject
                </p>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                {subjects.map((subject, index) => (
                  <div key={index} className="group">
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                      {subject.name}
                      {index < 2 && (
                        <span className="text-red-500 ml-2">*Required</span>
                      )}
                    </label>
                    <div className="flex gap-4 items-center">
                      <div className="flex-1 relative">
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
                          placeholder="Enter %"
                          className="text-lg h-14 border-2 border-gray-200 focus:border-green-400 rounded-xl transition-all duration-300 group-hover:border-gray-300"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                          %
                        </div>
                      </div>
                      <div className="text-center min-w-[100px]">
                        <div className="text-xs text-gray-500 mb-2 font-medium">
                          APS Points
                        </div>
                        <div
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg transition-all duration-300 ${
                            subject.points > 0
                              ? "bg-gradient-to-r from-green-400 to-green-600 shadow-green-200"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {subject.points}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total APS Display */}
                <div className="mt-10 p-8 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-100">
                  <div className="text-center space-y-4">
                    <div className="text-lg font-semibold text-gray-700">
                      Your Total APS Score
                    </div>
                    <div className="relative">
                      <div
                        className={`w-32 h-32 mx-auto rounded-3xl flex items-center justify-center text-4xl font-bold text-white shadow-2xl bg-gradient-to-r ${apsGrade.color} transition-all duration-500`}
                      >
                        {showAnimation ? (
                          <div className="animate-spin">
                            <Sparkles className="h-12 w-12" />
                          </div>
                        ) : (
                          totalAPS
                        )}
                      </div>
                      {totalAPS > 0 && !showAnimation && (
                        <div
                          className={`mt-3 text-sm font-medium ${apsGrade.textColor}`}
                        >
                          {apsGrade.label}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8">
                    <Button
                      onClick={handleCalculate}
                      disabled={
                        !hasValidMarks || !hasEnglishAndMath || showAnimation
                      }
                      className="flex-1 h-14 text-lg font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400"
                    >
                      {showAnimation ? (
                        <>
                          <div className="animate-spin mr-3">
                            <Calculator className="h-5 w-5" />
                          </div>
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Calculator className="h-5 w-5 mr-3" />
                          Find My Programs
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="px-8 h-14 border-2 border-gray-300 hover:border-gray-400 font-semibold"
                    >
                      Reset
                    </Button>
                  </div>

                  {/* Validation Messages */}
                  {!hasEnglishAndMath && hasValidMarks && (
                    <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                      <span className="text-sm text-amber-700 font-medium">
                        English and Mathematics marks are required for accurate
                        results
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm min-h-[600px]">
              <CardHeader className="pb-8 bg-gradient-to-r from-blue-50 to-green-50 rounded-t-2xl">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                  Your Qualifying Programs
                </CardTitle>
                {isCalculated && (
                  <div className="flex items-center gap-4">
                    <p className="text-gray-600 text-lg">
                      Based on APS {totalAPS}:{" "}
                      <span className="font-semibold text-green-600">
                        {qualifyingPrograms.length} programs available
                      </span>
                    </p>
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Qualified
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-8">
                {!isCalculated ? (
                  <div className="text-center py-16 space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-green-100 rounded-3xl flex items-center justify-center mx-auto">
                      <TrendingUp className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-gray-700">
                        Ready to Discover Your Future?
                      </h3>
                      <p className="text-gray-500 leading-relaxed">
                        Enter your matric marks above and click "Find My
                        Programs" to see all the university programs you qualify
                        for, organized by faculty.
                      </p>
                    </div>
                  </div>
                ) : qualifyingPrograms.length === 0 ? (
                  <div className="text-center py-16 space-y-6">
                    <div className="w-24 h-24 bg-amber-100 rounded-3xl flex items-center justify-center mx-auto">
                      <AlertCircle className="h-12 w-12 text-amber-500" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-gray-700">
                        No Programs Match Your Current Score
                      </h3>
                      <p className="text-gray-500 leading-relaxed">
                        Consider improving your marks through supplementary
                        exams or explore alternative pathways to higher
                        education.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="space-y-8 max-h-[500px] overflow-y-auto"
                    style={{
                      scrollbarWidth: "thin",
                      scrollbarColor: "#cbd5e1 #f1f5f9",
                    }}
                  >
                    {Object.entries(programsByFaculty).map(
                      ([faculty, programs]) => (
                        <div key={faculty} className="space-y-4">
                          <div className="sticky top-0 bg-white/95 backdrop-blur-sm py-3 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                <BookOpen className="h-5 w-5 text-white" />
                              </div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {faculty}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="ml-auto bg-green-100 text-green-700 border-green-200 font-semibold"
                              >
                                {programs.length} programs
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-3 pl-13">
                            {programs.slice(0, 8).map((program, index) => (
                              <div
                                key={index}
                                className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 mb-2 leading-snug">
                                      {program.programName}
                                    </h4>
                                    <div className="flex items-center gap-3 mb-3">
                                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-3 py-1">
                                        {program.universityAbbr}
                                      </Badge>
                                      <span className="text-sm text-gray-600">
                                        •
                                      </span>
                                      <span className="text-sm text-gray-600 font-medium">
                                        {program.duration}
                                      </span>
                                    </div>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200 font-semibold px-3 py-1 flex items-center gap-1"
                                  >
                                    <Award className="h-3 w-3" />
                                    APS {program.apsRequirement}
                                  </Badge>
                                </div>
                              </div>
                            ))}

                            {programs.length > 8 && (
                              <div className="text-center py-4">
                                <Badge
                                  variant="outline"
                                  className="text-gray-500 bg-gray-50 border-gray-200"
                                >
                                  +{programs.length - 8} more programs in{" "}
                                  {faculty}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* APS Scale Reference */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 text-center">
              APS Scoring Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                {
                  range: "80-100%",
                  points: 7,
                  gradient: "from-green-500 to-emerald-600",
                },
                {
                  range: "70-79%",
                  points: 6,
                  gradient: "from-green-400 to-green-500",
                },
                {
                  range: "60-69%",
                  points: 5,
                  gradient: "from-blue-400 to-blue-500",
                },
                {
                  range: "50-59%",
                  points: 4,
                  gradient: "from-yellow-400 to-yellow-500",
                },
                {
                  range: "40-49%",
                  points: 3,
                  gradient: "from-orange-400 to-orange-500",
                },
                {
                  range: "30-39%",
                  points: 2,
                  gradient: "from-red-400 to-red-500",
                },
                {
                  range: "0-29%",
                  points: 1,
                  gradient: "from-red-500 to-red-600",
                },
              ].map((scale) => (
                <div key={scale.points} className="text-center">
                  <div
                    className={`bg-gradient-to-r ${scale.gradient} text-white rounded-xl p-4 mb-3 shadow-lg`}
                  >
                    <div className="text-2xl font-bold">{scale.points}</div>
                    <div className="text-xs opacity-90">points</div>
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {scale.range}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernAPSCalculator;
