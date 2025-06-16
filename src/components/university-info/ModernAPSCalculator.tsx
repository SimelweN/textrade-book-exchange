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
    setIsCalculated(true);
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
  };

  // Check if calculation is valid
  const hasValidMarks = subjects.some((subject) => subject.marks > 0);
  const hasEnglishAndMath = subjects[0].marks > 0 && subjects[1].marks > 0; // English and Math

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(68, 171, 131, 0.1)" }}
          >
            <Calculator
              className="h-6 w-6"
              style={{ color: "rgb(68, 171, 131)" }}
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">APS Calculator</h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Calculate your Admission Point Score (APS) and discover all the
          university programs you qualify for
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calculator Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Enter Your Matric Marks
            </CardTitle>
            <p className="text-gray-600">
              Enter your final matric percentage for each subject
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {subjects.map((subject, index) => (
              <div key={index} className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {subject.name}
                  {index < 2 && <span className="text-red-500 ml-1">*</span>}
                </label>
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={subject.marks || ""}
                      onChange={(e) =>
                        updateSubjectMarks(index, parseInt(e.target.value) || 0)
                      }
                      placeholder="Enter percentage"
                      className="text-lg"
                    />
                  </div>
                  <div className="text-center min-w-[80px]">
                    <div className="text-sm text-gray-500 mb-1">APS Points</div>
                    <Badge
                      variant="outline"
                      className={`text-lg font-bold px-3 py-1 ${
                        subject.points > 0
                          ? "border-green-300 bg-green-50 text-green-700"
                          : "border-gray-300 bg-gray-50 text-gray-500"
                      }`}
                    >
                      {subject.points}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}

            {/* Total APS Display */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  Total APS Score
                </span>
                <div
                  className="text-3xl font-bold px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor:
                      totalAPS > 0
                        ? "rgba(68, 171, 131, 0.1)"
                        : "rgba(156, 163, 175, 0.1)",
                    color:
                      totalAPS > 0 ? "rgb(68, 171, 131)" : "rgb(107, 114, 128)",
                  }}
                >
                  {totalAPS}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleCalculate}
                  disabled={!hasValidMarks || !hasEnglishAndMath}
                  className="flex-1 text-white transition-colors"
                  style={{
                    backgroundColor:
                      hasValidMarks && hasEnglishAndMath
                        ? "rgb(68, 171, 131)"
                        : undefined,
                    borderColor:
                      hasValidMarks && hasEnglishAndMath
                        ? "rgb(68, 171, 131)"
                        : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (hasValidMarks && hasEnglishAndMath) {
                      e.currentTarget.style.backgroundColor =
                        "rgb(56, 142, 108)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (hasValidMarks && hasEnglishAndMath) {
                      e.currentTarget.style.backgroundColor =
                        "rgb(68, 171, 131)";
                    }
                  }}
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Programs
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="px-6"
                >
                  Reset
                </Button>
              </div>

              {/* Validation Messages */}
              {!hasEnglishAndMath && hasValidMarks && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-700">
                    English and Mathematics marks are required
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
              <GraduationCap className="h-5 w-5" />
              Qualifying Programs
            </CardTitle>
            {isCalculated && (
              <p className="text-gray-600">
                Based on your APS score of {totalAPS}, you qualify for{" "}
                {qualifyingPrograms.length} programs
              </p>
            )}
          </CardHeader>
          <CardContent>
            {!isCalculated ? (
              <div className="text-center py-12">
                <Calculator className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Ready to Calculate
                </h3>
                <p className="text-gray-500">
                  Enter your marks and click "Calculate Programs" to see which
                  programs you qualify for
                </p>
              </div>
            ) : qualifyingPrograms.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 mx-auto text-amber-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No Programs Found
                </h3>
                <p className="text-gray-500">
                  No programs match your current APS score. Try improving your
                  marks or check other universities.
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {Object.entries(programsByFaculty).map(
                  ([faculty, programs]) => (
                    <div key={faculty} className="space-y-3">
                      <div className="flex items-center gap-2 sticky top-0 bg-white py-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "rgba(68, 171, 131, 0.1)" }}
                        >
                          <BookOpen
                            className="h-4 w-4"
                            style={{ color: "rgb(68, 171, 131)" }}
                          />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {faculty}
                        </h3>
                        <Badge variant="secondary" className="ml-auto">
                          {programs.length} programs
                        </Badge>
                      </div>

                      <div className="space-y-2 pl-10">
                        {programs.slice(0, 10).map((program, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">
                                  {program.programName}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <span
                                    className="text-sm font-medium"
                                    style={{ color: "rgb(68, 171, 131)" }}
                                  >
                                    {program.universityAbbr}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    •
                                  </span>
                                  <span className="text-sm text-gray-600">
                                    {program.duration}
                                  </span>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200"
                              >
                                <Award className="h-3 w-3" />
                                APS {program.apsRequirement}
                              </Badge>
                            </div>
                          </div>
                        ))}

                        {programs.length > 10 && (
                          <div className="text-center py-2">
                            <span className="text-sm text-gray-500">
                              And {programs.length - 10} more programs in{" "}
                              {faculty}
                            </span>
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

      {/* APS Scale Reference */}
      <Card className="border-0 shadow-sm bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            APS Scoring Scale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { range: "80-100%", points: 7, color: "bg-green-500" },
              { range: "70-79%", points: 6, color: "bg-green-400" },
              { range: "60-69%", points: 5, color: "bg-yellow-400" },
              { range: "50-59%", points: 4, color: "bg-orange-400" },
              { range: "40-49%", points: 3, color: "bg-orange-500" },
              { range: "30-39%", points: 2, color: "bg-red-400" },
              { range: "0-29%", points: 1, color: "bg-red-500" },
            ].map((scale) => (
              <div key={scale.points} className="text-center">
                <div
                  className={`${scale.color} text-white rounded-lg p-3 mb-2`}
                >
                  <div className="text-lg font-bold">{scale.points}</div>
                  <div className="text-xs">points</div>
                </div>
                <div className="text-xs text-gray-600">{scale.range}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernAPSCalculator;
