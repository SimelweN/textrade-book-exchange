import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  validateProgramAssignmentRules,
  getProgramAssignmentStatistics,
  generateUniversityPrograms,
} from "@/utils/programAssignmentEngine";
import {
  ALL_PROGRAM_ASSIGNMENT_RULES,
  PROGRAM_STATISTICS,
} from "@/constants/universities/program-assignment-rules";
import {
  ALL_SOUTH_AFRICAN_UNIVERSITIES,
  UNIVERSITY_METADATA,
} from "@/constants/universities/index";

/**
 * DEBUG COMPONENT: Program Assignment Validation
 *
 * This component provides debugging information about the program assignment system.
 * Only visible in development mode.
 */

interface ProgramAssignmentDebugProps {
  className?: string;
}

const ProgramAssignmentDebug: React.FC<ProgramAssignmentDebugProps> = ({
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<string>("");

  // Don't render in production
  if (import.meta.env.PROD) {
    return null;
  }

  const validation = validateProgramAssignmentRules();
  const globalStats = getProgramAssignmentStatistics();
  const universityStats = selectedUniversity
    ? getProgramAssignmentStatistics(selectedUniversity)
    : null;
  const universityPrograms = selectedUniversity
    ? generateUniversityPrograms(selectedUniversity)
    : [];

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Info className="h-5 w-5" />
            Program Assignment System Debug
            <Badge variant="outline" className="ml-auto">
              Development Only
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                View Program Assignment Details
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-6 mt-4">
              {/* Validation Status */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      {validation.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      Validation Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Valid:</span>
                      <Badge
                        variant={validation.isValid ? "default" : "destructive"}
                      >
                        {validation.isValid ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Errors:</span>
                      <Badge
                        variant={
                          validation.errors.length > 0
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {validation.errors.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Warnings:</span>
                      <Badge
                        variant={
                          validation.warnings.length > 0
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {validation.warnings.length}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Global Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Rules:</span>
                      <Badge variant="secondary">
                        {PROGRAM_STATISTICS.totalPrograms}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Universities:</span>
                      <Badge variant="secondary">
                        {UNIVERSITY_METADATA.totalUniversities}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Programs/Uni:</span>
                      <Badge variant="secondary">
                        {UNIVERSITY_METADATA.averageProgramsPerUniversity}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Program Categories */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Program Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(globalStats.programsByFaculty).map(
                      ([faculty, count]) => (
                        <div
                          key={faculty}
                          className="flex justify-between text-xs p-2 bg-gray-50 rounded"
                        >
                          <span className="truncate">{faculty}</span>
                          <Badge variant="outline" className="text-xs">
                            {count}
                          </Badge>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* University Selector */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">University Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full p-2 border rounded text-sm"
                  >
                    <option value="">Select University...</option>
                    {ALL_SOUTH_AFRICAN_UNIVERSITIES.map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.abbreviation} - {uni.name}
                      </option>
                    ))}
                  </select>

                  {universityStats && (
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">
                          {universityStats.totalPrograms}
                        </div>
                        <div className="text-xs text-blue-800">
                          Total Programs
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {
                            Object.keys(universityStats.programsByFaculty)
                              .length
                          }
                        </div>
                        <div className="text-xs text-green-800">Faculties</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <div className="text-2xl font-bold text-purple-600">
                          {universityStats.averageAPS}
                        </div>
                        <div className="text-xs text-purple-800">Avg APS</div>
                      </div>
                    </div>
                  )}

                  {universityPrograms.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">
                        Programs by Faculty:
                      </h4>
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {Object.entries(
                          universityStats?.programsByFaculty || {},
                        ).map(([faculty, count]) => (
                          <div
                            key={faculty}
                            className="flex justify-between text-xs p-2 bg-gray-50 rounded"
                          >
                            <span>{faculty}</span>
                            <Badge variant="outline" className="text-xs">
                              {count}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Errors and Warnings */}
              {(validation.errors.length > 0 ||
                validation.warnings.length > 0) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-red-600">
                      Issues Found
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {validation.errors.length > 0 && (
                      <div>
                        <h4 className="font-medium text-red-600 text-xs mb-2">
                          Errors:
                        </h4>
                        <div className="space-y-1">
                          {validation.errors.map((error, index) => (
                            <div
                              key={index}
                              className="text-xs p-2 bg-red-50 text-red-700 rounded"
                            >
                              {error}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {validation.warnings.length > 0 && (
                      <div>
                        <h4 className="font-medium text-yellow-600 text-xs mb-2">
                          Warnings:
                        </h4>
                        <div className="space-y-1">
                          {validation.warnings
                            .slice(0, 10)
                            .map((warning, index) => (
                              <div
                                key={index}
                                className="text-xs p-2 bg-yellow-50 text-yellow-700 rounded"
                              >
                                {warning}
                              </div>
                            ))}
                          {validation.warnings.length > 10 && (
                            <div className="text-xs text-gray-500 italic">
                              ... and {validation.warnings.length - 10} more
                              warnings
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Assignment Rules Summary */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">
                    Assignment Rules Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-medium">
                        Programs marked "all":
                      </span>
                      <Badge variant="secondary" className="ml-2">
                        {PROGRAM_STATISTICS.programsMarkedAll}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">
                        Programs with exclusions:
                      </span>
                      <Badge variant="secondary" className="ml-2">
                        {PROGRAM_STATISTICS.programsWithExclusions}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramAssignmentDebug;
