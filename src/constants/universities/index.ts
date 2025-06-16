import { University } from "@/types/university";
import {
  ALL_29_SA_UNIVERSITIES,
  ALL_SOUTH_AFRICAN_UNIVERSITIES as COMPLETE_SA_UNIVERSITIES,
  UNIVERSITY_COUNT_SUMMARY,
} from "./complete-sa-universities";
import {
  COMPREHENSIVE_SA_UNIVERSITIES,
  ALL_SOUTH_AFRICAN_UNIVERSITIES_WITH_PROGRAMS,
  COMPREHENSIVE_DATABASE_STATS,
  FACULTY_DISTRIBUTION,
  PROGRAM_DISTRIBUTION,
} from "./comprehensive-programs-database";

// Use the comprehensive database with program assignment rules applied
export const ALL_SOUTH_AFRICAN_UNIVERSITIES: University[] =
  COMPREHENSIVE_SA_UNIVERSITIES || [];

// Alias for backward compatibility - ensure this uses the complete database
export const SOUTH_AFRICAN_UNIVERSITIES = ALL_SOUTH_AFRICAN_UNIVERSITIES;

// Production-ready university data loaded
if (import.meta.env.DEV) {
  try {
    const totalPrograms = ALL_SOUTH_AFRICAN_UNIVERSITIES.reduce(
      (total, uni) => {
        try {
          return (
            total +
            uni.faculties.reduce((facTotal, fac) => {
              try {
                return facTotal + (fac.degrees ? fac.degrees.length : 0);
              } catch (facError) {
                return facTotal;
              }
            }, 0)
          );
        } catch (uniError) {
          return total;
        }
      },
      0,
    );

    console.log(
      `🏫 ReBooked Campus: ${ALL_SOUTH_AFRICAN_UNIVERSITIES.length} universities loaded with ${totalPrograms} programs`,
    );

    // Detailed logging for debugging
    const traditionalCount = ALL_SOUTH_AFRICAN_UNIVERSITIES.filter(
      (u) => u.type === "Traditional University",
    ).length;
    const technologyCount = ALL_SOUTH_AFRICAN_UNIVERSITIES.filter(
      (u) => u.type === "University of Technology",
    ).length;
    const comprehensiveCount = ALL_SOUTH_AFRICAN_UNIVERSITIES.filter(
      (u) => u.type === "Comprehensive University",
    ).length;

    console.log(`📊 University Breakdown:
    - Traditional: ${traditionalCount}
    - Technology: ${technologyCount}
    - Comprehensive: ${comprehensiveCount}
    - Total: ${ALL_SOUTH_AFRICAN_UNIVERSITIES.length}`);

    // Log universities with no programs
    const universitiesWithoutPrograms = ALL_SOUTH_AFRICAN_UNIVERSITIES.filter(
      (uni) => {
        const totalDegrees = uni.faculties.reduce(
          (total, fac) => total + (fac.degrees ? fac.degrees.length : 0),
          0,
        );
        return totalDegrees === 0;
      },
    );

    if (universitiesWithoutPrograms.length > 0) {
      console.warn(
        `⚠️ Universities with no programs:`,
        universitiesWithoutPrograms.map((u) => u.name),
      );
    }
  } catch (loggingError) {
    console.error("Error in development logging:", loggingError);
  }
}

// Export individual categories with error handling
try {
  export { TRADITIONAL_UNIVERSITIES } from "./traditionalUniversities";
} catch (error) {
  console.warn("Error importing TRADITIONAL_UNIVERSITIES:", error);
  export const TRADITIONAL_UNIVERSITIES: University[] = [];
}

try {
  export { UNIVERSITIES_OF_TECHNOLOGY } from "./technicalUniversities";
} catch (error) {
  console.warn("Error importing UNIVERSITIES_OF_TECHNOLOGY:", error);
  export const UNIVERSITIES_OF_TECHNOLOGY: University[] = [];
}

try {
  export { COMPREHENSIVE_UNIVERSITIES } from "./comprehensiveUniversities";
} catch (error) {
  console.warn("Error importing COMPREHENSIVE_UNIVERSITIES:", error);
  export const COMPREHENSIVE_UNIVERSITIES: University[] = [];
}

// Create simplified list for basic operations
export const SOUTH_AFRICAN_UNIVERSITIES_SIMPLE =
  ALL_SOUTH_AFRICAN_UNIVERSITIES.map((university) => {
    try {
      return {
        id: university.id || "",
        name: university.name || "Unknown University",
        abbreviation:
          university.abbreviation ||
          university.name?.substring(0, 3).toUpperCase() ||
          "UNK",
        fullName:
          university.fullName || university.name || "Unknown University",
        logo: university.logo || "/logos/universities/default.svg",
      };
    } catch (error) {
      console.warn("Error creating simplified university data:", error);
      return {
        id: "unknown",
        name: "Unknown University",
        abbreviation: "UNK",
        fullName: "Unknown University",
        logo: "/logos/universities/default.svg",
      };
    }
  });

// Export metadata for debugging - use comprehensive database stats
export const UNIVERSITY_METADATA = {
  ...COMPREHENSIVE_DATABASE_STATS,
  lastUpdated: new Date().toISOString(),
  version: "4.0.0-comprehensive",
  facultyDistribution: FACULTY_DISTRIBUTION,
  programDistribution: PROGRAM_DISTRIBUTION,
  assignmentRulesApplied: true,
  source: "comprehensive-programs-database",
};
