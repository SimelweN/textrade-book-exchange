import React, { useMemo } from "react";
import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities";

const APSDebugInfo: React.FC<{ totalAPS: number }> = ({ totalAPS }) => {
  const debugData = useMemo(() => {
    // Check universities
    const universitiesCount = ALL_SOUTH_AFRICAN_UNIVERSITIES.length;

    // Check programs
    let totalPrograms = 0;
    let universitiesWithPrograms = 0;
    let samplePrograms: any[] = [];

    ALL_SOUTH_AFRICAN_UNIVERSITIES.forEach((university) => {
      const universityPrograms =
        university.faculties?.reduce(
          (total, faculty) => total + (faculty.degrees?.length || 0),
          0,
        ) || 0;

      totalPrograms += universityPrograms;

      if (universityPrograms > 0) {
        universitiesWithPrograms++;

        // Add sample programs
        if (samplePrograms.length < 5) {
          university.faculties?.forEach((faculty) => {
            faculty.degrees?.slice(0, 2).forEach((degree) => {
              if (samplePrograms.length < 5) {
                samplePrograms.push({
                  name: degree.name,
                  university: university.name,
                  aps: degree.apsRequirement,
                  eligible: totalAPS >= degree.apsRequirement,
                });
              }
            });
          });
        }
      }
    });

    return {
      universitiesCount,
      totalPrograms,
      universitiesWithPrograms,
      samplePrograms,
      eligiblePrograms: samplePrograms.filter((p) => p.eligible).length,
    };
  }, [totalAPS]);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 p-4 rounded-lg shadow-lg z-50 max-w-sm text-xs">
      <h4 className="font-bold text-red-800 mb-2">APS Debug Info</h4>
      <div className="space-y-1 text-red-700">
        <div>Universities: {debugData.universitiesCount}</div>
        <div>
          Universities with Programs: {debugData.universitiesWithPrograms}
        </div>
        <div>Total Programs: {debugData.totalPrograms}</div>
        <div>Your APS: {totalAPS}</div>
        <div>
          Eligible Programs: {debugData.eligiblePrograms}/
          {debugData.samplePrograms.length}
        </div>
      </div>

      <div className="mt-2">
        <div className="font-semibold text-red-800">Sample Programs:</div>
        {debugData.samplePrograms.slice(0, 3).map((program, index) => (
          <div key={index} className="text-xs">
            {program.name} - APS {program.aps} {program.eligible ? "✅" : "❌"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default APSDebugInfo;
