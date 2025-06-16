import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  University as UniversityIcon,
  MapPin,
  Users,
  ExternalLink,
  BookOpen,
  TrendingUp,
  Award,
  Star,
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Globe,
  GraduationCap,
  Building,
  Phone,
  Mail,
} from "lucide-react";
import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities";
import { University } from "@/types/university";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const PopularUniversities = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedUniversities, setExpandedUniversities] = useState<Set<string>>(
    new Set(),
  );
  const [showAll, setShowAll] = useState<Record<string, boolean>>({
    all: false,
    traditional: false,
    technology: false,
    comprehensive: false,
  });

  // Safe data loading with error handling
  const universities = useMemo(() => {
    try {
      if (
        !ALL_SOUTH_AFRICAN_UNIVERSITIES ||
        !Array.isArray(ALL_SOUTH_AFRICAN_UNIVERSITIES)
      ) {
        console.warn("Universities data not available");
        return [];
      }

      return ALL_SOUTH_AFRICAN_UNIVERSITIES.filter((university) => {
        // Basic validation
        return (
          university &&
          university.id &&
          university.name &&
          university.location &&
          university.faculties &&
          Array.isArray(university.faculties)
        );
      });
    } catch (error) {
      console.error("Error loading universities:", error);
      return [];
    }
  }, []);

  // Categorize universities safely
  const categorizedUniversities = useMemo(() => {
    try {
      const traditional = universities.filter(
        (uni) =>
          uni.type === "Traditional University" ||
          [
            "uct",
            "wits",
            "stellenbosch",
            "up",
            "ukzn",
            "uj",
            "nwu",
            "ufs",
            "ru",
            "unisa",
            "ufh",
            "univen",
            "unizulu",
            "ul",
            "uwc",
            "ump",
            "nmu",
          ].includes(uni.id),
      );

      const technology = universities.filter(
        (uni) =>
          uni.type === "University of Technology" ||
          ["cput", "dut", "tut", "vut", "cut", "mut"].includes(uni.id),
      );

      const comprehensive = universities.filter(
        (uni) =>
          uni.type === "Comprehensive University" || ["wsu"].includes(uni.id),
      );

      return { traditional, technology, comprehensive };
    } catch (error) {
      console.error("Error categorizing universities:", error);
      return { traditional: [], technology: [], comprehensive: [] };
    }
  }, [universities]);

  // Get program count safely
  const getProgramCount = (university: University): number => {
    try {
      if (!university.faculties || !Array.isArray(university.faculties)) {
        return 0;
      }

      return university.faculties.reduce((total, faculty) => {
        if (!faculty || !faculty.degrees || !Array.isArray(faculty.degrees)) {
          return total;
        }
        return total + faculty.degrees.length;
      }, 0);
    } catch (error) {
      console.warn(
        `Error calculating program count for ${university.name}:`,
        error,
      );
      return 0;
    }
  };

  // Get featured universities based on criteria
  const getFeaturedUniversities = () => {
    try {
      return universities
        .filter((uni) => {
          const programCount = getProgramCount(uni);
          return (
            programCount > 15 || // Has many programs
            (uni.studentPopulation && uni.studentPopulation > 20000) || // Large student body
            [
              "uct",
              "wits",
              "stellenbosch",
              "up",
              "ukzn",
              "uj",
              "unisa",
              "nwu",
            ].includes(uni.id)
          ); // Top universities
        })
        .slice(0, 6);
    } catch (error) {
      console.error("Error getting featured universities:", error);
      return [];
    }
  };

  const featuredUniversities = getFeaturedUniversities();

  // Toggle university expansion
  const toggleUniversityExpansion = (universityId: string) => {
    const newExpanded = new Set(expandedUniversities);
    if (newExpanded.has(universityId)) {
      newExpanded.delete(universityId);
    } else {
      newExpanded.add(universityId);
    }
    setExpandedUniversities(newExpanded);
  };

  // Toggle show all for category
  const toggleShowAll = (category: string) => {
    setShowAll((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // University card component with expand functionality
  const UniversityCard = ({
    university,
    isExpanded = false,
  }: {
    university: University;
    isExpanded?: boolean;
  }) => {
    const programCount = getProgramCount(university);
    const isExpandedState = expandedUniversities.has(university.id);

    try {
      return (
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-emerald-500 group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
                  {university.name || "Unknown University"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {university.fullName ||
                    university.name ||
                    "Unknown University"}
                </CardDescription>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {university.location || "Unknown"},{" "}
                      {university.province || "Unknown"}
                    </span>
                  </div>
                  {university.establishedYear && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Est. {university.establishedYear}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant="outline"
                  className="text-xs border-emerald-200 text-emerald-700"
                >
                  {university.abbreviation ||
                    university.name?.substring(0, 3).toUpperCase() ||
                    "UNI"}
                </Badge>
                {university.type && (
                  <Badge className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200">
                    {university.type.replace(" University", "")}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {university.overview ||
                `${university.name} is a South African university offering various academic programs.`}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center bg-emerald-50 rounded-lg p-3">
                <div className="text-lg font-bold text-emerald-600">
                  {programCount}
                </div>
                <div className="text-xs text-gray-600">Programs</div>
              </div>

              <div className="text-center bg-blue-50 rounded-lg p-3">
                <div className="text-lg font-bold text-blue-600">
                  {university.studentPopulation
                    ? university.studentPopulation > 1000
                      ? `${Math.round(university.studentPopulation / 1000)}k+`
                      : university.studentPopulation.toString()
                    : "N/A"}
                </div>
                <div className="text-xs text-gray-600">Students</div>
              </div>
            </div>

            {/* Faculty preview */}
            {university.faculties && university.faculties.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2">
                  Top Faculties:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {university.faculties.slice(0, 3).map((faculty, index) => (
                    <Badge
                      key={faculty.id || index}
                      variant="secondary"
                      className="text-xs bg-gray-100"
                    >
                      {faculty.name || "Unknown Faculty"}
                    </Badge>
                  ))}
                  {university.faculties.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100">
                      +{university.faculties.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Expanded content */}
            {isExpandedState && (
              <div className="border-t border-gray-100 pt-4 mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                {/* Contact Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Contact Information
                  </h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    {university.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        <a
                          href={university.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                          {university.website.replace("https://", "")}
                        </a>
                      </div>
                    )}
                    {university.admissionsContact && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span>{university.admissionsContact}</span>
                      </div>
                    )}
                    {university.studentPortal && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3 h-3" />
                        <a
                          href={university.studentPortal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                          Student Portal
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Application Information */}
                {university.applicationInfo && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Application Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Status:</span>
                        <Badge
                          className={cn(
                            "text-xs",
                            university.applicationInfo.isOpen
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-red-100 text-red-800 border-red-200",
                          )}
                        >
                          {university.applicationInfo.isOpen
                            ? "Open"
                            : "Closed"}
                        </Badge>
                      </div>
                      {university.applicationInfo.openingDate && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Opens:</span>
                          <span className="text-gray-900">
                            {university.applicationInfo.openingDate}
                          </span>
                        </div>
                      )}
                      {university.applicationInfo.closingDate && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Closes:</span>
                          <span className="text-gray-900">
                            {university.applicationInfo.closingDate}
                          </span>
                        </div>
                      )}
                      {university.applicationInfo.applicationFee && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Fee:</span>
                          <span className="text-gray-900">
                            {university.applicationInfo.applicationFee}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* All Faculties */}
                {university.faculties && university.faculties.length > 3 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      All Faculties
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {university.faculties.map((faculty, index) => (
                        <div
                          key={faculty.id || index}
                          className="bg-gray-50 rounded p-2"
                        >
                          <div className="text-xs font-medium text-gray-900">
                            {faculty.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {faculty.description}
                          </div>
                          <div className="text-xs text-emerald-600 mt-1">
                            {faculty.degrees?.length || 0} programs available
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={() =>
                  navigate(`/university-info?university=${university.id}`)
                }
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <UniversityIcon className="w-4 h-4 mr-2" />
                View Details
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/books?university=${university.id}`)}
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Books
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleUniversityExpansion(university.id)}
                className="text-gray-500 hover:text-emerald-600"
              >
                {isExpandedState ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } catch (error) {
      console.error(
        `Error rendering university card for ${university.name}:`,
        error,
      );
      return (
        <Card className="border-red-200">
          <CardContent className="p-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Error loading university information
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      );
    }
  };

  // Main component render
  if (universities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UniversityIcon className="w-5 h-5" />
            <span>Popular Universities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              University data is currently loading or unavailable. Please try
              again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UniversityIcon className="w-5 h-5 text-emerald-600" />
          <span>Explore South African Universities</span>
        </CardTitle>
        <CardDescription>
          Discover the perfect university for your academic journey. Click "View
          More" to expand university details.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
            >
              Featured ({featuredUniversities.length})
            </TabsTrigger>
            <TabsTrigger
              value="traditional"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
            >
              Traditional ({categorizedUniversities.traditional.length})
            </TabsTrigger>
            <TabsTrigger
              value="technology"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
            >
              Technology ({categorizedUniversities.technology.length})
            </TabsTrigger>
            <TabsTrigger
              value="comprehensive"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
            >
              Comprehensive ({categorizedUniversities.comprehensive.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredUniversities.length > 0 ? (
                featuredUniversities
                  .slice(0, showAll.all ? undefined : 6)
                  .map((university) => (
                    <UniversityCard
                      key={university.id}
                      university={university}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <UniversityIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    No featured universities available at the moment.
                  </p>
                </div>
              )}
            </div>

            {featuredUniversities.length > 6 && (
              <div className="text-center">
                <Button
                  onClick={() => toggleShowAll("all")}
                  variant="outline"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  {showAll.all ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      View More Universities ({featuredUniversities.length -
                        6}{" "}
                      more)
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="traditional" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Traditional Universities
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Research-focused universities offering undergraduate and
                postgraduate degrees across various disciplines.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {categorizedUniversities.traditional.length > 0 ? (
                categorizedUniversities.traditional
                  .slice(0, showAll.traditional ? undefined : 9)
                  .map((university) => (
                    <UniversityCard
                      key={university.id}
                      university={university}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600">
                    No traditional universities data available.
                  </p>
                </div>
              )}
            </div>

            {categorizedUniversities.traditional.length > 9 && (
              <div className="text-center">
                <Button
                  onClick={() => toggleShowAll("traditional")}
                  variant="outline"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  {showAll.traditional ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      View More Universities (
                      {categorizedUniversities.traditional.length - 9} more)
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="technology" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Universities of Technology
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Technology-focused institutions emphasizing practical skills and
                applied sciences.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {categorizedUniversities.technology.length > 0 ? (
                categorizedUniversities.technology
                  .slice(0, showAll.technology ? undefined : 6)
                  .map((university) => (
                    <UniversityCard
                      key={university.id}
                      university={university}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600">
                    No universities of technology data available.
                  </p>
                </div>
              )}
            </div>

            {categorizedUniversities.technology.length > 6 && (
              <div className="text-center">
                <Button
                  onClick={() => toggleShowAll("technology")}
                  variant="outline"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  {showAll.technology ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      View All Technology Universities
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="comprehensive" className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Comprehensive Universities
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Universities offering both traditional academic and
                technology-focused programs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {categorizedUniversities.comprehensive.length > 0 ? (
                categorizedUniversities.comprehensive
                  .slice(0, showAll.comprehensive ? undefined : 6)
                  .map((university) => (
                    <UniversityCard
                      key={university.id}
                      university={university}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600">
                    No comprehensive universities data available.
                  </p>
                </div>
              )}
            </div>

            {categorizedUniversities.comprehensive.length > 6 && (
              <div className="text-center">
                <Button
                  onClick={() => toggleShowAll("comprehensive")}
                  variant="outline"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  {showAll.comprehensive ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-2" />
                      View All Comprehensive Universities
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-emerald-600">
                {universities.length}
              </div>
              <div className="text-sm text-gray-600">Universities</div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {universities.reduce(
                  (total, uni) => total + getProgramCount(uni),
                  0,
                )}
                +
              </div>
              <div className="text-sm text-gray-600">Programs</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {
                  universities.filter((uni) => uni.applicationInfo?.isOpen)
                    .length
                }
              </div>
              <div className="text-sm text-gray-600">Applications Open</div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">9</div>
              <div className="text-sm text-gray-600">Provinces</div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-6 text-center">
          <Button
            onClick={() => navigate("/university-info?tool=aps-calculator")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Calculate Your APS & Find Programs
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PopularUniversities;
