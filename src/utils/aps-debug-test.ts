import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities";

// Quick debug function to test program allocation
export const debugAPSPrograms = () => {
  console.log("🔍 APS Debug Test Starting...");

  const totalUniversities = ALL_SOUTH_AFRICAN_UNIVERSITIES.length;
  console.log(`📊 Total Universities: ${totalUniversities}`);

  let totalPrograms = 0;
  let universitiesWithPrograms = 0;
  let universitiesWithoutPrograms: string[] = [];

  ALL_SOUTH_AFRICAN_UNIVERSITIES.forEach((university) => {
    const universityPrograms =
      university.faculties?.reduce(
        (total, faculty) => total + (faculty.degrees?.length || 0),
        0,
      ) || 0;

    totalPrograms += universityPrograms;

    if (universityPrograms > 0) {
      universitiesWithPrograms++;
    } else {
      universitiesWithoutPrograms.push(university.name);
    }

    console.log(
      `🏫 ${university.name}: ${universityPrograms} programs across ${university.faculties?.length || 0} faculties`,
    );
  });

  console.log(`\n📈 Summary:
  - Total Universities: ${totalUniversities}
  - Universities with Programs: ${universitiesWithPrograms}
  - Universities without Programs: ${universitiesWithoutPrograms.length}
  - Total Programs: ${totalPrograms}
  `);

  if (universitiesWithoutPrograms.length > 0) {
    console.warn(
      `⚠️ Universities without programs:`,
      universitiesWithoutPrograms,
    );
  }

  // Test APS calculation
  console.log("\n🧮 Testing APS ranges:");
  const samplePrograms = [];
  for (let i = 0; i < Math.min(5, totalPrograms); i++) {
    const uni = ALL_SOUTH_AFRICAN_UNIVERSITIES[0];
    const faculty = uni.faculties?.[0];
    const program = faculty?.degrees?.[i];
    if (program) {
      samplePrograms.push({
        name: program.name,
        aps: program.apsRequirement,
        university: uni.name,
      });
    }
  }

  console.table(samplePrograms);

  return {
    totalUniversities,
    universitiesWithPrograms,
    totalPrograms,
    universitiesWithoutPrograms,
  };
};

// Auto-run in development
if (import.meta.env.DEV) {
  setTimeout(() => debugAPSPrograms(), 1000);
}
