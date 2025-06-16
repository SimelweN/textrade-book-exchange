import { Degree } from "@/types/university";

/**
 * COMPREHENSIVE PROGRAM ALLOCATION SYSTEM
 *
 * This file contains all programs specified by the user with proper allocation rules
 * and university-specific APS requirements.
 */

// University abbreviation mappings for easy reference
const UNIVERSITY_MAPPINGS = {
  UCT: "uct",
  WITS: "wits",
  SU: "su",
  UP: "up",
  UWC: "uwc",
  UNISA: "unisa",
  UFH: "ufh",
  UJ: "uj",
  RU: "ru",
  TUT: "tut",
  DUT: "dut",
  MUT: "mut",
  VUT: "vut",
  CPUT: "cput",
  CUT: "cut",
  UZ: "uz",
  UL: "ul",
  NWU: "nwu",
  UV: "uv",
  WSU: "wsu",
  UMP: "ump",
  UKZN: "ukzn",
  UNIVEN: "univen",
  SMU: "smu",
  UFS: "ufs",
  SPU: "spu",
  SOL: "sol",
  UNIZUL: "unizul",
  MSU: "msu",
} as const;

// Helper function to generate university-specific APS scores
const generateUniversityAPS = (
  baseAPS: number,
  universityType: string,
  isCompetitive: boolean = false,
): number => {
  let apsScore = baseAPS;

  // Adjust based on university type and competitiveness
  if (universityType === "Traditional University") {
    apsScore += isCompetitive ? 3 : 1;
  } else if (universityType === "University of Technology") {
    apsScore -= 2;
  }

  // Ensure minimum APS of 20 and maximum of 42
  return Math.max(20, Math.min(42, apsScore));
};

// Program allocation rules interface
interface ProgramAllocation {
  name: string;
  faculty: string;
  baseAPS: number;
  duration: string;
  description: string;
  allocation: "all" | { exclude: string[] } | { include: string[] };
  isCompetitive?: boolean;
  careerProspects: string[];
}

// Complete program allocation database
export const COMPREHENSIVE_PROGRAMS: ProgramAllocation[] = [
  // Faculty of Engineering / Engineering and Built Environment
  {
    name: "Civil Engineering",
    faculty: "Engineering",
    baseAPS: 35,
    duration: "4 years",
    description:
      "Design, construct and maintain civil infrastructure including buildings, roads, bridges, and water systems.",
    allocation: { exclude: ["uwc", "unisa", "ufh"] },
    isCompetitive: true,
    careerProspects: [
      "Civil Engineer",
      "Structural Engineer",
      "Project Manager",
      "Construction Manager",
      "Infrastructure Consultant",
    ],
  },
  {
    name: "Mechanical Engineering",
    faculty: "Engineering",
    baseAPS: 35,
    duration: "4 years",
    description:
      "Design, develop and manufacture mechanical systems, machines and devices.",
    allocation: { exclude: ["uwc", "unisa", "ufh"] },
    isCompetitive: true,
    careerProspects: [
      "Mechanical Engineer",
      "Design Engineer",
      "Manufacturing Engineer",
      "Energy Engineer",
      "Automotive Engineer",
    ],
  },
  {
    name: "Electrical Engineering",
    faculty: "Engineering",
    baseAPS: 36,
    duration: "4 years",
    description:
      "Design and develop electrical systems, electronics, and power systems.",
    allocation: { exclude: ["uwc", "unisa", "ufh"] },
    isCompetitive: true,
    careerProspects: [
      "Electrical Engineer",
      "Power Systems Engineer",
      "Electronics Engineer",
      "Control Systems Engineer",
      "Telecommunications Engineer",
    ],
  },
  {
    name: "Chemical Engineering",
    faculty: "Engineering",
    baseAPS: 37,
    duration: "4 years",
    description:
      "Apply chemistry and physics principles to transform raw materials into useful products.",
    allocation: { exclude: ["uj", "unisa", "ufh"] },
    isCompetitive: true,
    careerProspects: [
      "Chemical Engineer",
      "Process Engineer",
      "Environmental Engineer",
      "Petroleum Engineer",
      "Materials Engineer",
    ],
  },
  {
    name: "Industrial Engineering",
    faculty: "Engineering",
    baseAPS: 34,
    duration: "4 years",
    description:
      "Optimize complex processes and systems for efficiency and productivity.",
    allocation: { exclude: ["uwc", "unisa"] },
    isCompetitive: true,
    careerProspects: [
      "Industrial Engineer",
      "Operations Manager",
      "Quality Engineer",
      "Systems Analyst",
      "Supply Chain Manager",
    ],
  },
  {
    name: "Computer Engineering",
    faculty: "Engineering",
    baseAPS: 36,
    duration: "4 years",
    description: "Design and develop computer hardware and software systems.",
    allocation: { exclude: ["uct", "up", "unisa"] },
    isCompetitive: true,
    careerProspects: [
      "Computer Engineer",
      "Hardware Engineer",
      "Software Engineer",
      "Systems Engineer",
      "Embedded Systems Developer",
    ],
  },
  {
    name: "Mechatronics",
    faculty: "Engineering",
    baseAPS: 35,
    duration: "4 years",
    description:
      "Integrate mechanical, electrical and computer engineering for intelligent systems.",
    allocation: { exclude: ["uwc", "unisa", "ufh", "mut"] },
    isCompetitive: true,
    careerProspects: [
      "Mechatronics Engineer",
      "Automation Engineer",
      "Robotics Engineer",
      "Control Systems Engineer",
      "Design Engineer",
    ],
  },
  {
    name: "Mining Engineering",
    faculty: "Engineering",
    baseAPS: 34,
    duration: "4 years",
    description:
      "Extract minerals and resources from the earth safely and efficiently.",
    allocation: { exclude: ["uwc", "unisa", "ufh", "ru"] },
    isCompetitive: true,
    careerProspects: [
      "Mining Engineer",
      "Geological Engineer",
      "Mine Manager",
      "Safety Engineer",
      "Resource Specialist",
    ],
  },
  {
    name: "Environmental Engineering",
    faculty: "Engineering",
    baseAPS: 33,
    duration: "4 years",
    description:
      "Protect environmental and human health through engineering solutions.",
    allocation: { exclude: ["uwc", "unisa"] },
    careerProspects: [
      "Environmental Engineer",
      "Water Treatment Engineer",
      "Air Quality Engineer",
      "Sustainability Consultant",
      "Environmental Manager",
    ],
  },
  {
    name: "Agricultural Engineering",
    faculty: "Engineering",
    baseAPS: 32,
    duration: "4 years",
    description:
      "Apply engineering principles to agricultural production and processing.",
    allocation: { exclude: ["uwc", "unisa", "ufh"] },
    careerProspects: [
      "Agricultural Engineer",
      "Irrigation Engineer",
      "Food Processing Engineer",
      "Farm Manager",
      "Agricultural Consultant",
    ],
  },
  {
    name: "Construction Management",
    faculty: "Engineering",
    baseAPS: 28,
    duration: "3 years",
    description: "Manage construction projects from planning to completion.",
    allocation: "all",
    careerProspects: [
      "Construction Manager",
      "Project Manager",
      "Site Manager",
      "Quantity Surveyor",
      "Building Inspector",
    ],
  },
  {
    name: "Quantity Surveying",
    faculty: "Engineering",
    baseAPS: 30,
    duration: "4 years",
    description: "Manage costs and contracts for construction projects.",
    allocation: "all",
    careerProspects: [
      "Quantity Surveyor",
      "Cost Manager",
      "Project Manager",
      "Construction Consultant",
      "Property Developer",
    ],
  },
  {
    name: "Architecture",
    faculty: "Engineering",
    baseAPS: 35,
    duration: "5 years",
    description:
      "Design buildings and spaces that are functional, safe and aesthetically pleasing.",
    allocation: { exclude: ["unisa", "ufh", "mut"] },
    isCompetitive: true,
    careerProspects: [
      "Architect",
      "Urban Planner",
      "Design Consultant",
      "Project Manager",
      "Heritage Specialist",
    ],
  },

  // Faculty of Health Sciences / Medicine and Health
  {
    name: "Bachelor of Medicine and Bachelor of Surgery (MBChB)",
    faculty: "Health Sciences",
    baseAPS: 40,
    duration: "6 years",
    description:
      "Comprehensive medical training to become a qualified medical doctor.",
    allocation: "all",
    isCompetitive: true,
    careerProspects: [
      "Medical Doctor",
      "Specialist Physician",
      "Surgeon",
      "General Practitioner",
      "Medical Researcher",
    ],
  },
  {
    name: "Bachelor of Dental Surgery (BDS)",
    faculty: "Health Sciences",
    baseAPS: 38,
    duration: "5 years",
    description: "Training in oral health care and dental treatment.",
    allocation: { exclude: ["unisa", "ufh", "mut"] },
    isCompetitive: true,
    careerProspects: [
      "Dentist",
      "Oral Surgeon",
      "Orthodontist",
      "Dental Specialist",
      "Dental Practice Owner",
    ],
  },
  {
    name: "Bachelor of Pharmacy (BPharm)",
    faculty: "Health Sciences",
    baseAPS: 35,
    duration: "4 years",
    description: "Training in pharmaceutical sciences and patient care.",
    allocation: "all",
    isCompetitive: true,
    careerProspects: [
      "Pharmacist",
      "Hospital Pharmacist",
      "Industrial Pharmacist",
      "Regulatory Affairs",
      "Pharmaceutical Researcher",
    ],
  },
  {
    name: "Bachelor of Physiotherapy",
    faculty: "Health Sciences",
    baseAPS: 34,
    duration: "4 years",
    description:
      "Rehabilitation and treatment of movement disorders and injuries.",
    allocation: "all",
    careerProspects: [
      "Physiotherapist",
      "Sports Therapist",
      "Rehabilitation Specialist",
      "Private Practitioner",
      "Hospital Therapist",
    ],
  },
  {
    name: "Bachelor of Occupational Therapy",
    faculty: "Health Sciences",
    baseAPS: 33,
    duration: "4 years",
    description: "Help people overcome challenges to daily living and working.",
    allocation: "all",
    careerProspects: [
      "Occupational Therapist",
      "Rehabilitation Specialist",
      "Community Health Worker",
      "Private Practitioner",
      "Research Therapist",
    ],
  },
  {
    name: "Bachelor of Nursing Science",
    faculty: "Health Sciences",
    baseAPS: 30,
    duration: "4 years",
    description:
      "Comprehensive nursing education for patient care and health promotion.",
    allocation: "all",
    careerProspects: [
      "Registered Nurse",
      "Nurse Manager",
      "Specialist Nurse",
      "Community Health Nurse",
      "Nurse Educator",
    ],
  },

  // Faculty of Humanities / Arts and Social Sciences
  {
    name: "Bachelor of Arts in English",
    faculty: "Humanities",
    baseAPS: 25,
    duration: "3 years",
    description:
      "Study of English literature, language, and communication skills.",
    allocation: "all",
    careerProspects: [
      "Teacher",
      "Writer",
      "Editor",
      "Journalist",
      "Communications Specialist",
    ],
  },
  {
    name: "History",
    faculty: "Humanities",
    baseAPS: 25,
    duration: "3 years",
    description: "Study of past events, cultures, and civilizations.",
    allocation: "all",
    careerProspects: [
      "Historian",
      "Teacher",
      "Museum Curator",
      "Archivist",
      "Research Analyst",
    ],
  },
  {
    name: "Psychology",
    faculty: "Humanities",
    baseAPS: 30,
    duration: "3 years",
    description:
      "Study of human behavior, mental processes, and psychological disorders.",
    allocation: "all",
    careerProspects: [
      "Psychologist",
      "Counselor",
      "Therapist",
      "Research Psychologist",
      "Industrial Psychologist",
    ],
  },
  {
    name: "Sociology",
    faculty: "Humanities",
    baseAPS: 26,
    duration: "3 years",
    description:
      "Study of society, social relationships, and social institutions.",
    allocation: "all",
    careerProspects: [
      "Social Researcher",
      "Community Developer",
      "Social Worker",
      "Policy Analyst",
      "NGO Worker",
    ],
  },
  {
    name: "Political Science",
    faculty: "Humanities",
    baseAPS: 27,
    duration: "3 years",
    description: "Study of government, politics, and political behavior.",
    allocation: "all",
    careerProspects: [
      "Political Analyst",
      "Government Official",
      "Diplomat",
      "Policy Researcher",
      "Political Journalist",
    ],
  },
  {
    name: "Philosophy",
    faculty: "Humanities",
    baseAPS: 26,
    duration: "3 years",
    description:
      "Study of fundamental questions about existence, knowledge, and ethics.",
    allocation: "all",
    careerProspects: [
      "Teacher",
      "Writer",
      "Ethicist",
      "Consultant",
      "Academic Researcher",
    ],
  },

  // Faculty of Commerce / Business and Management
  {
    name: "Bachelor of Commerce in Accounting",
    faculty: "Commerce",
    baseAPS: 32,
    duration: "3 years",
    description:
      "Financial accounting, management accounting, and auditing principles.",
    allocation: "all",
    careerProspects: [
      "Accountant",
      "Auditor",
      "Financial Manager",
      "Tax Consultant",
      "Chief Financial Officer",
    ],
  },
  {
    name: "Finance",
    faculty: "Commerce",
    baseAPS: 31,
    duration: "3 years",
    description: "Corporate finance, investments, and financial markets.",
    allocation: "all",
    careerProspects: [
      "Financial Analyst",
      "Investment Advisor",
      "Bank Manager",
      "Financial Planner",
      "Risk Manager",
    ],
  },
  {
    name: "Economics",
    faculty: "Commerce",
    baseAPS: 30,
    duration: "3 years",
    description: "Economic theory, policy analysis, and market behavior.",
    allocation: "all",
    careerProspects: [
      "Economist",
      "Policy Analyst",
      "Research Analyst",
      "Financial Consultant",
      "Government Advisor",
    ],
  },
  {
    name: "Marketing",
    faculty: "Commerce",
    baseAPS: 28,
    duration: "3 years",
    description: "Consumer behavior, advertising, and brand management.",
    allocation: "all",
    careerProspects: [
      "Marketing Manager",
      "Brand Manager",
      "Digital Marketer",
      "Sales Manager",
      "Market Research Analyst",
    ],
  },
  {
    name: "Business Management",
    faculty: "Commerce",
    baseAPS: 27,
    duration: "3 years",
    description: "General management principles and business strategy.",
    allocation: "all",
    careerProspects: [
      "Business Manager",
      "Operations Manager",
      "General Manager",
      "Entrepreneur",
      "Management Consultant",
    ],
  },

  // Faculty of Law
  {
    name: "Bachelor of Laws (LLB)",
    faculty: "Law",
    baseAPS: 34,
    duration: "4 years",
    description:
      "Comprehensive legal education covering all major areas of law.",
    allocation: "all",
    isCompetitive: true,
    careerProspects: [
      "Lawyer",
      "Advocate",
      "Legal Advisor",
      "Judge",
      "Legal Consultant",
    ],
  },

  // Faculty of Science / Natural Sciences
  {
    name: "Bachelor of Science in Computer Science",
    faculty: "Science",
    baseAPS: 32,
    duration: "3 years",
    description:
      "Programming, algorithms, software development, and computer systems.",
    allocation: "all",
    careerProspects: [
      "Software Developer",
      "Systems Analyst",
      "Data Scientist",
      "IT Manager",
      "Cybersecurity Specialist",
    ],
  },
  {
    name: "Mathematics",
    faculty: "Science",
    baseAPS: 31,
    duration: "3 years",
    description:
      "Pure and applied mathematics, statistics, and mathematical modeling.",
    allocation: "all",
    careerProspects: [
      "Mathematician",
      "Statistician",
      "Data Analyst",
      "Actuary",
      "Research Scientist",
    ],
  },
  {
    name: "Physics",
    faculty: "Science",
    baseAPS: 32,
    duration: "3 years",
    description:
      "Classical and modern physics, quantum mechanics, and thermodynamics.",
    allocation: "all",
    careerProspects: [
      "Physicist",
      "Research Scientist",
      "Engineering Physicist",
      "Medical Physicist",
      "Science Teacher",
    ],
  },
  {
    name: "Chemistry",
    faculty: "Science",
    baseAPS: 31,
    duration: "3 years",
    description: "Organic, inorganic, analytical, and physical chemistry.",
    allocation: "all",
    careerProspects: [
      "Chemist",
      "Research Scientist",
      "Quality Control Analyst",
      "Environmental Scientist",
      "Science Teacher",
    ],
  },
  {
    name: "Biological Sciences",
    faculty: "Science",
    baseAPS: 30,
    duration: "3 years",
    description:
      "Study of living organisms, ecology, and biological processes.",
    allocation: "all",
    careerProspects: [
      "Biologist",
      "Research Scientist",
      "Environmental Consultant",
      "Science Teacher",
      "Laboratory Technician",
    ],
  },

  // Faculty of Education
  {
    name: "Bachelor of Education Foundation Phase",
    faculty: "Education",
    baseAPS: 25,
    duration: "4 years",
    description: "Teaching methodology for learners in grades R-3.",
    allocation: "all",
    careerProspects: [
      "Foundation Phase Teacher",
      "Early Childhood Educator",
      "Curriculum Developer",
      "Educational Consultant",
      "School Principal",
    ],
  },
  {
    name: "Bachelor of Education Intermediate Phase",
    faculty: "Education",
    baseAPS: 25,
    duration: "4 years",
    description: "Teaching methodology for learners in grades 4-6.",
    allocation: "all",
    careerProspects: [
      "Intermediate Phase Teacher",
      "Subject Specialist",
      "Curriculum Developer",
      "Educational Consultant",
      "School Principal",
    ],
  },
  {
    name: "Bachelor of Education Senior Phase",
    faculty: "Education",
    baseAPS: 26,
    duration: "4 years",
    description: "Teaching methodology for learners in grades 7-9.",
    allocation: "all",
    careerProspects: [
      "Senior Phase Teacher",
      "Subject Head",
      "Curriculum Developer",
      "Educational Consultant",
      "School Principal",
    ],
  },

  // Faculty of Information Technology / Computer Science
  {
    name: "Bachelor of Information Technology",
    faculty: "Information Technology",
    baseAPS: 30,
    duration: "3 years",
    description: "Information systems, networking, and technology management.",
    allocation: "all",
    careerProspects: [
      "IT Specialist",
      "Systems Administrator",
      "Network Manager",
      "IT Consultant",
      "Database Administrator",
    ],
  },
  {
    name: "Bachelor of Software Engineering",
    faculty: "Information Technology",
    baseAPS: 32,
    duration: "4 years",
    description: "Software design, development, and project management.",
    allocation: "all",
    careerProspects: [
      "Software Engineer",
      "Software Architect",
      "Full-Stack Developer",
      "DevOps Engineer",
      "Technical Lead",
    ],
  },
  {
    name: "Bachelor of Cybersecurity",
    faculty: "Information Technology",
    baseAPS: 31,
    duration: "3 years",
    description:
      "Information security, network security, and cyber threat management.",
    allocation: "all",
    careerProspects: [
      "Cybersecurity Analyst",
      "Security Engineer",
      "Ethical Hacker",
      "Security Consultant",
      "Information Security Manager",
    ],
  },
];

// Function to generate programs for a specific university
export const generateUniversityPrograms = (
  universityId: string,
  universityType: string,
  excludedPrograms: string[] = [],
): Degree[] => {
  const programs: Degree[] = [];

  COMPREHENSIVE_PROGRAMS.forEach((program, index) => {
    let shouldInclude = false;

    // Check allocation rules
    if (program.allocation === "all") {
      shouldInclude = true;
    } else if ("exclude" in program.allocation) {
      shouldInclude = !program.allocation.exclude.includes(universityId);
    } else if ("include" in program.allocation) {
      shouldInclude = program.allocation.include.includes(universityId);
    }

    // Check if program is excluded for this university
    if (excludedPrograms.includes(program.name)) {
      shouldInclude = false;
    }

    if (shouldInclude) {
      const universitySpecificAPS = generateUniversityAPS(
        program.baseAPS,
        universityType,
        program.isCompetitive,
      );

      programs.push({
        id: `${universityId}-${program.name.toLowerCase().replace(/\s+/g, "-")}-${index}`,
        name: program.name,
        code: program.name.toUpperCase().replace(/\s+/g, ""),
        faculty: program.faculty,
        duration: program.duration,
        apsRequirement: universitySpecificAPS,
        description: program.description,
        subjects: [], // Will be populated with appropriate subjects
        careerProspects: program.careerProspects,
        assignmentRule: program.allocation,
      });
    }
  });

  return programs;
};

// Function to get all unique faculties
export const getAllFaculties = (): string[] => {
  const faculties = new Set<string>();
  COMPREHENSIVE_PROGRAMS.forEach((program) => {
    faculties.add(program.faculty);
  });
  return Array.from(faculties);
};

// Function to count programs by faculty
export const getProgramCountByFaculty = (): Record<string, number> => {
  const counts: Record<string, number> = {};
  COMPREHENSIVE_PROGRAMS.forEach((program) => {
    counts[program.faculty] = (counts[program.faculty] || 0) + 1;
  });
  return counts;
};

// Export program statistics
export const PROGRAM_STATISTICS = {
  totalPrograms: COMPREHENSIVE_PROGRAMS.length,
  facultyCount: getAllFaculties().length,
  programsByFaculty: getProgramCountByFaculty(),
  competitivePrograms: COMPREHENSIVE_PROGRAMS.filter((p) => p.isCompetitive)
    .length,
  universalPrograms: COMPREHENSIVE_PROGRAMS.filter(
    (p) => p.allocation === "all",
  ).length,
};
