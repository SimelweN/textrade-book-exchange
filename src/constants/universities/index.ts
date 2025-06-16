import { University } from "@/types/university";
import {
  ALL_26_SA_UNIVERSITIES,
  UNIVERSITY_COUNT_SUMMARY,
} from "./complete-sa-universities";
import {
  generateStandardFaculties,
  UNIVERSITIES_NEEDING_PROGRAMS,
  COMMON_DEGREE_TEMPLATES,
  FORCE_COMPREHENSIVE_PROGRAMS,
} from "./complete-programs-database";
import { fixProgramFacultyAssignments } from "@/utils/programFacultyUtils";
import { assignComprehensivePrograms } from "@/utils/comprehensiveProgramRules";

// Function to ensure all universities have complete programs
const ensureCompletePrograms = (universities: University[]): University[] => {
  try {
    return universities.map((university) => {
      try {
        // Validate university structure
        if (!university || !university.id || !university.name) {
          console.warn("Invalid university data:", university);
          return university;
        }

        // Ensure faculties array exists
        if (!university.faculties || !Array.isArray(university.faculties)) {
          console.warn(
            `University ${university.name} has invalid faculties array`,
          );
          university.faculties = [];
        }

        // Calculate total degrees for this university
        const totalDegrees = university.faculties.reduce((total, faculty) => {
          if (!faculty || !faculty.degrees || !Array.isArray(faculty.degrees)) {
            return total;
          }
          return total + faculty.degrees.length;
        }, 0);

        // CONSERVATIVE criteria: Only enhance universities with very few programs AND in the verified list
        // This prevents corruption of existing well-structured university data
        if (
          FORCE_COMPREHENSIVE_PROGRAMS ||
          (totalDegrees < 10 &&
            UNIVERSITIES_NEEDING_PROGRAMS.includes(university.id))
        ) {
          try {
            const standardFaculties = generateStandardFaculties(
              university.name,
              university.id,
            );

            // Start with existing faculties
            const mergedFaculties = [...university.faculties];

            // Add missing faculties or enhance existing ones
            standardFaculties.forEach((standardFaculty) => {
              try {
                const existingFacultyIndex = mergedFaculties.findIndex(
                  (f) =>
                    f &&
                    f.id &&
                    f.name &&
                    (f.id === standardFaculty.id ||
                      f.id.includes(standardFaculty.id) ||
                      f.name
                        .toLowerCase()
                        .includes(
                          standardFaculty.name.toLowerCase().split(" ")[2] ||
                            "",
                        ) ||
                      f.name
                        .toLowerCase()
                        .includes(
                          standardFaculty.name.toLowerCase().split(" ")[1] ||
                            "",
                        )),
                );

                if (existingFacultyIndex === -1) {
                  // Add entirely new faculty
                  mergedFaculties.push(standardFaculty);
                } else {
                  // Enhance existing faculty with more degrees - be more aggressive
                  const existingFaculty = mergedFaculties[existingFacultyIndex];

                  if (!existingFaculty.degrees) {
                    existingFaculty.degrees = [];
                  }

                  const newDegrees = standardFaculty.degrees.filter(
                    (degree) =>
                      degree &&
                      degree.id &&
                      degree.name &&
                      !existingFaculty.degrees.some(
                        (existing) =>
                          existing &&
                          existing.id &&
                          existing.name &&
                          (existing.id === degree.id ||
                            existing.name
                              .toLowerCase()
                              .includes(
                                degree.name.toLowerCase().split(" ")[1] || "",
                              ) ||
                            degree.name
                              .toLowerCase()
                              .includes(
                                existing.name.toLowerCase().split(" ")[1] || "",
                              )),
                      ),
                  );

                  // Add all new degrees to ensure comprehensive coverage
                  existingFaculty.degrees.push(...newDegrees);
                }
              } catch (facultyError) {
                console.warn(
                  "Error processing standard faculty:",
                  facultyError,
                );
              }
            });

            return { ...university, faculties: mergedFaculties };
          } catch (enhancementError) {
            console.warn(
              `Error enhancing university ${university.name}:`,
              enhancementError,
            );
            return university;
          }
        }

        // Even for universities with enough programs, ensure minimum faculty count
        if (university.faculties.length < 8) {
          try {
            const standardFaculties = generateStandardFaculties(
              university.name,
              university.id,
            );
            const mergedFaculties = [...university.faculties];

            // Add essential faculties if missing
            const essentialFaculties = standardFaculties.filter(
              (f) =>
                f &&
                f.id &&
                (f.id === "commerce" ||
                  f.id === "science" ||
                  f.id === "humanities" ||
                  f.id === "engineering" ||
                  f.id === "health-sciences" ||
                  f.id === "education" ||
                  f.id === "law" ||
                  f.id === "information-technology"),
            );

            essentialFaculties.forEach((essentialFaculty) => {
              try {
                const exists = mergedFaculties.some(
                  (f) =>
                    f &&
                    f.id &&
                    f.name &&
                    (f.id === essentialFaculty.id ||
                      f.name
                        .toLowerCase()
                        .includes(
                          essentialFaculty.name.toLowerCase().split(" ")[2] ||
                            "",
                        )),
                );

                if (!exists) {
                  mergedFaculties.push(essentialFaculty);
                }
              } catch (essentialError) {
                console.warn("Error adding essential faculty:", essentialError);
              }
            });

            return { ...university, faculties: mergedFaculties };
          } catch (minimalError) {
            console.warn(
              `Error adding minimal faculties to ${university.name}:`,
              minimalError,
            );
            return university;
          }
        }

        return university;
      } catch (universityError) {
        console.error(
          `Error processing university ${university?.name || "Unknown"}:`,
          universityError,
        );
        return university; // Return original university if processing fails
      }
    });
  } catch (error) {
    console.error("Error in ensureCompletePrograms:", error);
    return universities; // Return original universities if function fails
  }
};

// Function to validate and clean university data
const validateUniversityData = (universities: University[]): University[] => {
  try {
    return universities.filter((university) => {
      // Basic validation
      if (!university || !university.id || !university.name) {
        console.warn("Filtered out invalid university:", university);
        return false;
      }

      // Ensure required properties exist
      if (!university.faculties) {
        university.faculties = [];
      }

      if (!university.location) {
        university.location = "South Africa";
      }

      if (!university.province) {
        university.province = "Unknown";
      }

      if (!university.overview) {
        university.overview = `${university.name} is a South African university offering various academic programs.`;
      }

      if (!university.website) {
        university.website = `https://www.${university.id}.ac.za`;
      }

      // Validate faculties
      if (Array.isArray(university.faculties)) {
        university.faculties = university.faculties.filter((faculty) => {
          if (!faculty || !faculty.id || !faculty.name) {
            return false;
          }

          // Ensure degrees array exists
          if (!faculty.degrees) {
            faculty.degrees = [];
          }

          // Validate degrees
          if (Array.isArray(faculty.degrees)) {
            faculty.degrees = faculty.degrees.filter((degree) => {
              if (!degree || !degree.id || !degree.name) {
                return false;
              }

              // Ensure required degree properties
              if (
                typeof degree.apsRequirement !== "number" ||
                degree.apsRequirement < 0
              ) {
                degree.apsRequirement = 26; // Default minimum
              }

              if (!degree.duration) {
                degree.duration = "3 years";
              }

              if (!degree.description) {
                degree.description = `${degree.name} program offered by ${university.name}.`;
              }

              if (
                !degree.careerProspects ||
                !Array.isArray(degree.careerProspects)
              ) {
                degree.careerProspects = ["Various career opportunities"];
              }

              if (!degree.subjects || !Array.isArray(degree.subjects)) {
                degree.subjects = [];
              }

              return true;
            });
          }

          return true;
        });
      }

      return true;
    });
  } catch (error) {
    console.error("Error validating university data:", error);
    return universities;
  }
};

// Initialize university data with comprehensive error handling
let allUniversities: University[] = [];

try {
  // Start with the complete, audited database of all 26 South African public universities
  if (!ALL_26_SA_UNIVERSITIES || !Array.isArray(ALL_26_SA_UNIVERSITIES)) {
    console.error(
      "ALL_26_SA_UNIVERSITIES is not properly defined or is not an array",
    );
    allUniversities = [];
  } else {
    allUniversities = [...ALL_26_SA_UNIVERSITIES];

    // Validate and clean data first
    allUniversities = validateUniversityData(allUniversities);

    // Ensure all universities have complete programs
    allUniversities = ensureCompletePrograms(allUniversities);

    // Apply comprehensive program assignment based on user specifications
    try {
      allUniversities = assignComprehensivePrograms(allUniversities);
    } catch (error) {
      console.warn(
        "Error in assignComprehensivePrograms, continuing with current data:",
        error,
      );
    }

    // Fix program-faculty assignments to ensure proper categorization
    try {
      allUniversities = allUniversities.map((university) => {
        try {
          return fixProgramFacultyAssignments(university);
        } catch (error) {
          console.warn(
            `Error fixing program assignments for ${university.name}:`,
            error,
          );
          return university;
        }
      });
    } catch (error) {
      console.warn(
        "Error in fixProgramFacultyAssignments, continuing with current data:",
        error,
      );
    }

    // Final validation
    allUniversities = validateUniversityData(allUniversities);
  }
} catch (error) {
  console.error("Critical error initializing university data:", error);
  allUniversities = [];
}

// Export the processed university data
export const ALL_SOUTH_AFRICAN_UNIVERSITIES: University[] = allUniversities;

// Alias for backward compatibility
export const SOUTH_AFRICAN_UNIVERSITIES = ALL_SOUTH_AFRICAN_UNIVERSITIES;

// Production-ready university data loaded
if (import.meta.env.DEV) {
  try {
    const totalPrograms = allUniversities.reduce((total, uni) => {
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
    }, 0);

    console.log(
      `📚 ReBooked Campus: ${allUniversities.length} universities loaded with ${totalPrograms} programs`,
    );

    // Detailed logging for debugging
    const universitiesWithoutPrograms = allUniversities.filter((uni) => {
      const totalDegrees = uni.faculties.reduce(
        (total, fac) => total + (fac.degrees ? fac.degrees.length : 0),
        0,
      );
      return totalDegrees === 0;
    });

    if (universitiesWithoutPrograms.length > 0) {
      console.warn(
        `⚠️ Universities with no programs:`,
        universitiesWithoutPrograms.map((u) => u.name),
      );
    }

    const universitiesWithFewPrograms = allUniversities.filter((uni) => {
      const totalDegrees = uni.faculties.reduce(
        (total, fac) => total + (fac.degrees ? fac.degrees.length : 0),
        0,
      );
      return totalDegrees > 0 && totalDegrees < 10;
    });

    if (universitiesWithFewPrograms.length > 0) {
      console.info(
        `ℹ️ Universities with few programs:`,
        universitiesWithFewPrograms.map((u) => ({
          name: u.name,
          programs: u.faculties.reduce(
            (total, fac) => total + (fac.degrees ? fac.degrees.length : 0),
            0,
          ),
        })),
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

// Export metadata for debugging
export const UNIVERSITY_METADATA = {
  totalUniversities: allUniversities.length,
  totalPrograms: allUniversities.reduce(
    (total, uni) =>
      total +
      uni.faculties.reduce(
        (facTotal, fac) => facTotal + (fac.degrees?.length || 0),
        0,
      ),
    0,
  ),
  lastUpdated: new Date().toISOString(),
  version: "2.0.0",
};
