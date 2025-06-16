import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities";

const UniversityDebug = () => {
  console.log(
    "🏫 Total Universities Loaded:",
    ALL_SOUTH_AFRICAN_UNIVERSITIES.length,
  );
  console.log(
    "🏫 University List:",
    ALL_SOUTH_AFRICAN_UNIVERSITIES.map((u) => ({
      id: u.id,
      name: u.name,
      type: u.type,
    })),
  );

  const traditional = ALL_SOUTH_AFRICAN_UNIVERSITIES.filter(
    (u) => u.type === "Traditional University",
  );
  const technology = ALL_SOUTH_AFRICAN_UNIVERSITIES.filter(
    (u) => u.type === "University of Technology",
  );
  const comprehensive = ALL_SOUTH_AFRICAN_UNIVERSITIES.filter(
    (u) => u.type === "Comprehensive University",
  );

  console.log("📊 Breakdown:");
  console.log(
    "- Traditional:",
    traditional.length,
    traditional.map((u) => u.abbreviation),
  );
  console.log(
    "- Technology:",
    technology.length,
    technology.map((u) => u.abbreviation),
  );
  console.log(
    "- Comprehensive:",
    comprehensive.length,
    comprehensive.map((u) => u.abbreviation),
  );

  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded text-xs z-50">
      {ALL_SOUTH_AFRICAN_UNIVERSITIES.length} Unis Loaded
    </div>
  );
};

export default UniversityDebug;
