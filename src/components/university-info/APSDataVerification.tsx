import React from "react";
import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities";

const APSDataVerification: React.FC = () => {
  // Calculate statistics
  const totalUniversities = ALL_SOUTH_AFRICAN_UNIVERSITIES.length;

  let totalPrograms = 0;
  let universitiesWithPrograms = 0;

  const universityStats = ALL_SOUTH_AFRICAN_UNIVERSITIES.map((university) => {
    const programCount =
      university.faculties?.reduce(
        (total, faculty) => total + (faculty.degrees?.length || 0),
        0,
      ) || 0;

    totalPrograms += programCount;
    if (programCount > 0) universitiesWithPrograms++;

    return {
      name: university.name,
      abbreviation: university.abbreviation,
      facultyCount: university.faculties?.length || 0,
      programCount,
    };
  });

  return (
    <div className="fixed top-4 right-4 bg-white border border-red-500 p-4 rounded-lg shadow-lg z-50 max-w-md">
      <h3 className="font-bold text-red-600 mb-2">APS Data Verification</h3>
      <div className="text-sm space-y-1">
        <div>
          Total Universities: <strong>{totalUniversities}</strong>
        </div>
        <div>
          Universities with Programs:{" "}
          <strong>{universitiesWithPrograms}</strong>
        </div>
        <div>
          Total Programs: <strong>{totalPrograms}</strong>
        </div>
      </div>

      <div className="mt-3 max-h-40 overflow-y-auto text-xs">
        <div className="font-semibold mb-1">University Breakdown:</div>
        {universityStats.slice(0, 8).map((uni, index) => (
          <div key={index} className="flex justify-between">
            <span>{uni.abbreviation}</span>
            <span>{uni.programCount} programs</span>
          </div>
        ))}
        {universityStats.length > 8 && (
          <div className="text-gray-500">
            ...and {universityStats.length - 8} more
          </div>
        )}
      </div>
    </div>
  );
};

export default APSDataVerification;
