import React, { useMemo } from "react";
import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities";

const APSTestComponent: React.FC = () => {
  // Simple test to verify data is loading
  const dataTest = useMemo(() => {
    const universitiesCount = ALL_SOUTH_AFRICAN_UNIVERSITIES.length;

    let totalPrograms = 0;
    let universitiesWithPrograms = 0;

    ALL_SOUTH_AFRICAN_UNIVERSITIES.forEach((university) => {
      const programCount =
        university.faculties?.reduce(
          (total, faculty) => total + (faculty.degrees?.length || 0),
          0,
        ) || 0;

      totalPrograms += programCount;
      if (programCount > 0) universitiesWithPrograms++;
    });

    return {
      universitiesCount,
      totalPrograms,
      universitiesWithPrograms,
      isWorking: universitiesCount > 0 && totalPrograms > 0,
    };
  }, []);

  if (!dataTest.isWorking) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <strong>APS Data Loading Error:</strong>
        <ul className="mt-2">
          <li>Universities: {dataTest.universitiesCount}</li>
          <li>Total Programs: {dataTest.totalPrograms}</li>
          <li>
            Universities with Programs: {dataTest.universitiesWithPrograms}
          </li>
        </ul>
        <p className="mt-2">
          The APS calculator data is not loading properly. Please refresh the
          page.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      <strong>APS Data Status: ✅ Working</strong>
      <ul className="mt-2">
        <li>Universities: {dataTest.universitiesCount}</li>
        <li>Total Programs: {dataTest.totalPrograms}</li>
        <li>Universities with Programs: {dataTest.universitiesWithPrograms}</li>
      </ul>
    </div>
  );
};

export default APSTestComponent;
