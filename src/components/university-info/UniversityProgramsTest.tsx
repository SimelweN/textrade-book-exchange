import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities/index";

/**
 * TEST COMPONENT: University Programs Verification
 *
 * This component tests if universities have programs loaded correctly.
 * Only visible in development mode.
 */

const UniversityProgramsTest: React.FC = () => {
  // Don't render in production
  if (import.meta.env.PROD) {
    return null;
  }

  // Test a few universities
  const testUniversities = [
    "uct", // University of Cape Town
    "wits", // University of the Witwatersrand
    "tut", // Tshwane University of Technology
    "unisa", // University of South Africa
    "ukzn", // University of KwaZulu-Natal
  ];

  const universityData = testUniversities
    .map((id) => {
      const university = ALL_SOUTH_AFRICAN_UNIVERSITIES.find(
        (uni) => uni.id === id,
      );
      if (!university) return null;

      const totalPrograms =
        university.faculties?.reduce((total, faculty) => {
          return total + (faculty.degrees?.length || 0);
        }, 0) || 0;

      return {
        id: university.id,
        name: university.name,
        abbreviation: university.abbreviation,
        faculties: university.faculties?.length || 0,
        programs: totalPrograms,
        university,
      };
    })
    .filter(Boolean);

  const totalProgramsAcrossAll = ALL_SOUTH_AFRICAN_UNIVERSITIES.reduce(
    (total, uni) => {
      return (
        total +
        (uni.faculties?.reduce((facTotal, fac) => {
          return facTotal + (fac.degrees?.length || 0);
        }, 0) || 0)
      );
    },
    0,
  );

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-green-800">
          University Programs Test (Dev Only)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Overall Stats */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Overall Statistics</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Total Universities:</span>
                <Badge variant="secondary">
                  {ALL_SOUTH_AFRICAN_UNIVERSITIES.length}
                </Badge>
              </div>
              <div className="flex justify-between text-xs">
                <span>Total Programs:</span>
                <Badge variant="secondary">{totalProgramsAcrossAll}</Badge>
              </div>
              <div className="flex justify-between text-xs">
                <span>Avg Programs/Uni:</span>
                <Badge variant="secondary">
                  {Math.round(
                    totalProgramsAcrossAll /
                      ALL_SOUTH_AFRICAN_UNIVERSITIES.length,
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* Sample Universities */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Sample Universities</h3>
            <div className="space-y-1">
              {universityData.map((uni) => (
                <div
                  key={uni.id}
                  className="flex justify-between text-xs p-2 bg-white rounded"
                >
                  <span className="truncate">{uni.abbreviation}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {uni.faculties} fac
                    </Badge>
                    <Badge
                      variant={uni.programs > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {uni.programs} prog
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Program Details */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm">Sample Program Details (UCT)</h3>
          {(() => {
            const uct = universityData.find((uni) => uni.id === "uct");
            if (!uct || !uct.university.faculties) {
              return (
                <p className="text-xs text-red-600">
                  UCT data not found or no faculties
                </p>
              );
            }

            const firstFaculty = uct.university.faculties[0];
            if (
              !firstFaculty ||
              !firstFaculty.degrees ||
              firstFaculty.degrees.length === 0
            ) {
              return (
                <p className="text-xs text-red-600">
                  No programs found in first faculty
                </p>
              );
            }

            const firstProgram = firstFaculty.degrees[0];
            return (
              <div className="text-xs bg-white p-3 rounded border">
                <div className="font-medium mb-1">{firstFaculty.name}</div>
                <div className="text-gray-600 mb-2">Sample Program:</div>
                <div className="space-y-1">
                  <div>
                    <strong>Name:</strong> {firstProgram.name}
                  </div>
                  <div>
                    <strong>Duration:</strong> {firstProgram.duration}
                  </div>
                  <div>
                    <strong>APS:</strong> {firstProgram.apsRequirement}
                  </div>
                  <div>
                    <strong>Description:</strong>{" "}
                    {firstProgram.description?.substring(0, 100)}...
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Status */}
        <div className="text-center space-y-2">
          <Badge
            variant={totalProgramsAcrossAll > 1000 ? "default" : "destructive"}
            className="text-sm"
            style={
              totalProgramsAcrossAll > 1000
                ? {
                    backgroundColor: "rgb(68, 171, 131)",
                    color: "white",
                  }
                : {}
            }
          >
            {totalProgramsAcrossAll > 1000
              ? "✅ Programs Loaded Successfully"
              : "❌ Programs Not Loaded"}
          </Badge>

          <Badge
            variant={
              ALL_SOUTH_AFRICAN_UNIVERSITIES.length >= 29
                ? "default"
                : "destructive"
            }
            className="text-sm ml-2"
            style={
              ALL_SOUTH_AFRICAN_UNIVERSITIES.length >= 29
                ? {
                    backgroundColor: "rgb(68, 171, 131)",
                    color: "white",
                  }
                : {}
            }
          >
            {ALL_SOUTH_AFRICAN_UNIVERSITIES.length >= 29
              ? `✅ All ${ALL_SOUTH_AFRICAN_UNIVERSITIES.length} Universities Loaded`
              : `❌ Missing Universities (${ALL_SOUTH_AFRICAN_UNIVERSITIES.length}/29)`}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default UniversityProgramsTest;
