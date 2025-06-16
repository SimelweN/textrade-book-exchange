import { University } from "@/types/university";
import { ALL_29_SA_UNIVERSITIES } from "./complete-sa-universities";
import { applyProgramAssignmentRules } from "@/utils/programAssignmentEngine";

/**
 * COMPREHENSIVE PROGRAMS DATABASE
 *
 * This file applies the program assignment rules to generate the complete
 * university database with all programs assigned according to the rules.
 */

/**
 * Generate the complete database with program assignments applied
 */
function generateComprehensiveDatabase(): University[] {
  try {
    console.log("🔄 Applying program assignment rules to universities...");

    // Apply program assignment rules to base university data
    const universitiesWithPrograms = applyProgramAssignmentRules(
      ALL_29_SA_UNIVERSITIES,
    );

    // Log statistics
    const totalPrograms = universitiesWithPrograms.reduce((total, uni) => {
      return (
        total +
        uni.faculties.reduce((facTotal, fac) => {
          return facTotal + (fac.degrees?.length || 0);
        }, 0)
      );
    }, 0);

    const totalFaculties = universitiesWithPrograms.reduce((total, uni) => {
      return total + (uni.faculties?.length || 0);
    }, 0);

    console.log(`✅ Program assignment complete:
    - Universities: ${universitiesWithPrograms.length}
    - Total Faculties: ${totalFaculties}
    - Total Programs: ${totalPrograms}
    - Average Programs per University: ${Math.round(totalPrograms / universitiesWithPrograms.length)}`);

    // Log universities with the most and least programs
    const programCounts = universitiesWithPrograms
      .map((uni) => ({
        name: uni.name,
        count: uni.faculties.reduce(
          (total, fac) => total + (fac.degrees?.length || 0),
          0,
        ),
      }))
      .sort((a, b) => b.count - a.count);

    console.log(`📊 Program Distribution:
    - Most programs: ${programCounts[0]?.name} (${programCounts[0]?.count})
    - Least programs: ${programCounts[programCounts.length - 1]?.name} (${programCounts[programCounts.length - 1]?.count})`);

    return universitiesWithPrograms;
  } catch (error) {
    console.error("Error generating comprehensive database:", error);

    // Return base universities if there's an error
    return ALL_29_SA_UNIVERSITIES;
  }
}

/**
 * The complete comprehensive database with all programs assigned
 */
export const COMPREHENSIVE_SA_UNIVERSITIES: University[] =
  generateComprehensiveDatabase();

/**
 * Export for backward compatibility
 */
export const ALL_SOUTH_AFRICAN_UNIVERSITIES_WITH_PROGRAMS =
  COMPREHENSIVE_SA_UNIVERSITIES;

/**
 * University categories with comprehensive programs
 */
export const COMPREHENSIVE_TRADITIONAL_UNIVERSITIES =
  COMPREHENSIVE_SA_UNIVERSITIES.filter(
    (uni) => uni.type === "Traditional University",
  );

export const COMPREHENSIVE_TECHNOLOGY_UNIVERSITIES =
  COMPREHENSIVE_SA_UNIVERSITIES.filter(
    (uni) => uni.type === "University of Technology",
  );

export const COMPREHENSIVE_COMPREHENSIVE_UNIVERSITIES =
  COMPREHENSIVE_SA_UNIVERSITIES.filter(
    (uni) => uni.type === "Comprehensive University",
  );

/**
 * Statistics and metadata
 */
export const COMPREHENSIVE_DATABASE_STATS = {
  totalUniversities: COMPREHENSIVE_SA_UNIVERSITIES.length,
  totalPrograms: COMPREHENSIVE_SA_UNIVERSITIES.reduce((total, uni) => {
    return (
      total +
      uni.faculties.reduce((facTotal, fac) => {
        return facTotal + (fac.degrees?.length || 0);
      }, 0)
    );
  }, 0),
  totalFaculties: COMPREHENSIVE_SA_UNIVERSITIES.reduce((total, uni) => {
    return total + (uni.faculties?.length || 0);
  }, 0),
  breakdown: {
    traditional: COMPREHENSIVE_TRADITIONAL_UNIVERSITIES.length,
    technology: COMPREHENSIVE_TECHNOLOGY_UNIVERSITIES.length,
    comprehensive: COMPREHENSIVE_COMPREHENSIVE_UNIVERSITIES.length,
  },
  averageProgramsPerUniversity: Math.round(
    COMPREHENSIVE_SA_UNIVERSITIES.reduce((total, uni) => {
      return (
        total +
        uni.faculties.reduce((facTotal, fac) => {
          return facTotal + (fac.degrees?.length || 0);
        }, 0)
      );
    }, 0) / COMPREHENSIVE_SA_UNIVERSITIES.length,
  ),
  lastGenerated: new Date().toISOString(),
  version: "1.0.0",
};

/**
 * Faculty distribution across all universities
 */
export const FACULTY_DISTRIBUTION = (() => {
  const facultyMap = new Map<string, number>();

  for (const university of COMPREHENSIVE_SA_UNIVERSITIES) {
    for (const faculty of university.faculties) {
      const currentCount = facultyMap.get(faculty.name) || 0;
      facultyMap.set(faculty.name, currentCount + 1);
    }
  }

  return Object.fromEntries(
    Array.from(facultyMap.entries()).sort((a, b) => b[1] - a[1]),
  );
})();

/**
 * Program distribution by category
 */
export const PROGRAM_DISTRIBUTION = (() => {
  const programMap = new Map<string, number>();

  for (const university of COMPREHENSIVE_SA_UNIVERSITIES) {
    for (const faculty of university.faculties) {
      const facultyName = faculty.name;
      const programCount = faculty.degrees?.length || 0;
      const currentCount = programMap.get(facultyName) || 0;
      programMap.set(facultyName, currentCount + programCount);
    }
  }

  return Object.fromEntries(
    Array.from(programMap.entries()).sort((a, b) => b[1] - a[1]),
  );
})();

/**
 * Helper functions for querying the database
 */
export function getUniversityByAbbreviation(
  abbreviation: string,
): University | undefined {
  return COMPREHENSIVE_SA_UNIVERSITIES.find(
    (uni) => uni.abbreviation.toLowerCase() === abbreviation.toLowerCase(),
  );
}

export function getUniversityById(id: string): University | undefined {
  return COMPREHENSIVE_SA_UNIVERSITIES.find((uni) => uni.id === id);
}

export function searchUniversitiesByName(searchTerm: string): University[] {
  const term = searchTerm.toLowerCase();
  return COMPREHENSIVE_SA_UNIVERSITIES.filter(
    (uni) =>
      uni.name.toLowerCase().includes(term) ||
      uni.fullName.toLowerCase().includes(term) ||
      uni.abbreviation.toLowerCase().includes(term),
  );
}

export function getUniversitiesByProvince(province: string): University[] {
  return COMPREHENSIVE_SA_UNIVERSITIES.filter(
    (uni) => uni.province.toLowerCase() === province.toLowerCase(),
  );
}

export function getUniversitiesByType(type: string): University[] {
  return COMPREHENSIVE_SA_UNIVERSITIES.filter(
    (uni) => uni.type?.toLowerCase() === type.toLowerCase(),
  );
}

export function searchProgramsAcrossUniversities(searchTerm: string): Array<{
  university: University;
  faculty: string;
  program: any;
}> {
  const results: Array<{
    university: University;
    faculty: string;
    program: any;
  }> = [];
  const term = searchTerm.toLowerCase();

  for (const university of COMPREHENSIVE_SA_UNIVERSITIES) {
    for (const faculty of university.faculties) {
      for (const program of faculty.degrees || []) {
        if (
          program.name.toLowerCase().includes(term) ||
          program.description?.toLowerCase().includes(term) ||
          program.faculty.toLowerCase().includes(term)
        ) {
          results.push({
            university,
            faculty: faculty.name,
            program,
          });
        }
      }
    }
  }

  return results;
}

/**
 * Development logging
 */
if (import.meta.env.DEV) {
  console.log("📚 Comprehensive Programs Database Loaded");
  console.log("Stats:", COMPREHENSIVE_DATABASE_STATS);
  console.log("Faculty Distribution:", FACULTY_DISTRIBUTION);
  console.log(
    "Program Distribution (top 5):",
    Object.fromEntries(Object.entries(PROGRAM_DISTRIBUTION).slice(0, 5)),
  );
}

// Export the main database as default
export default COMPREHENSIVE_SA_UNIVERSITIES;
