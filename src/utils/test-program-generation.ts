import { generateUniversityPrograms } from "@/constants/universities/comprehensive-program-allocation";
import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities";

// Simple test to verify program generation
export const testProgramGeneration = () => {
  console.log("🧪 Testing program generation...");

  // Test direct program generation
  const testPrograms = generateUniversityPrograms(
    "uct",
    "Traditional University",
  );
  console.log(`📊 Direct generation for UCT: ${testPrograms.length} programs`);

  if (testPrograms.length > 0) {
    console.log("✅ First program:", testPrograms[0]);
  }

  // Test university data
  console.log(
    `🏫 Universities loaded: ${ALL_SOUTH_AFRICAN_UNIVERSITIES.length}`,
  );

  if (ALL_SOUTH_AFRICAN_UNIVERSITIES.length > 0) {
    const firstUni = ALL_SOUTH_AFRICAN_UNIVERSITIES[0];
    console.log(`🔍 First university:`, {
      name: firstUni.name,
      facultiesCount: firstUni.faculties?.length || 0,
      hasPrograms: firstUni.faculties?.[0]?.degrees?.length || 0,
    });
  }

  return {
    testPrograms: testPrograms.length,
    universities: ALL_SOUTH_AFRICAN_UNIVERSITIES.length,
  };
};

// Auto-run in development
if (import.meta.env.DEV) {
  setTimeout(() => testProgramGeneration(), 2000);
}
