import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  BookOpen,
  Users,
  Calendar,
  Search,
  Building,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { University, Faculty, Degree } from "@/types/university";
import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities/index";
import CampusNavbar from "@/components/CampusNavbar";
import SEO from "@/components/SEO";

interface UniversityProfileProps {}

const UniversityProfile: React.FC<UniversityProfileProps> = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const universityId = searchParams.get("id");
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  // Find the university
  const university = useMemo(() => {
    if (!universityId) return null;
    return (
      ALL_SOUTH_AFRICAN_UNIVERSITIES.find((uni) => uni.id === universityId) ||
      null
    );
  }, [universityId]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!university)
      return {
        students: "0",
        established: "N/A",
        faculties: 0,
        province: "N/A",
      };

    const programCount =
      university.faculties?.reduce((total, faculty) => {
        return total + (faculty.degrees?.length || 0);
      }, 0) || 0;

    return {
      students: university.studentPopulation
        ? university.studentPopulation > 1000
          ? `${Math.round(university.studentPopulation / 1000)}k+`
          : university.studentPopulation.toString()
        : "29,000+",
      established: university.establishedYear?.toString() || "1829",
      faculties: university.faculties?.length || 6,
      province: university.province || "Western Cape",
    };
  }, [university]);

  // Handle back navigation
  const handleBack = () => {
    navigate("/university-info");
  };

  // Handle faculty click
  const handleFacultyClick = (facultyId: string) => {
    if (selectedFaculty === facultyId) {
      setSelectedFaculty(null);
      setSelectedProgram(null);
    } else {
      setSelectedFaculty(facultyId);
      setSelectedProgram(null);
    }
  };

  // Handle program click
  const handleProgramClick = (programId: string) => {
    setSelectedProgram(selectedProgram === programId ? null : programId);
  };

  // Handle website visit
  const handleVisitWebsite = () => {
    if (university?.website) {
      window.open(university.website, "_blank");
    }
  };

  // Handle view books
  const handleViewBooks = () => {
    navigate(`/books?university=${university?.id}`);
  };

  // Handle APS requirements
  const handleAPSRequirements = () => {
    navigate("/university-info?tool=aps-calculator");
  };

  // Handle bursaries
  const handleBursaries = () => {
    navigate("/university-info?tool=bursaries");
  };

  // Get other universities in the same province
  const otherUniversitiesInProvince = useMemo(() => {
    if (!university) return [];
    return ALL_SOUTH_AFRICAN_UNIVERSITIES.filter(
      (uni) => uni.province === university.province && uni.id !== university.id,
    ).slice(0, 3);
  }, [university]);

  if (!university) {
    return (
      <>
        <CampusNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              University Not Found
            </h1>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Universities
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title={`${university.name} - University Profile | ReBooked Campus`}
        description={`Explore ${university.fullName || university.name} programs, faculties, and information. Complete guide to ${university.name}.`}
        keywords={`${university.name}, ${university.abbreviation}, university programs, faculties, South African universities`}
        url={`https://www.rebookedsolutions.co.za/university-profile?id=${university.id}`}
      />

      <CampusNavbar />

      <div className="min-h-screen bg-gray-50 text-center">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 text-center">
          <div className="max-w-7xl mx-auto px-4 py-8 text-center">
            {/* Back Button */}
            <div className="flex flex-col text-center mb-6">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="self-start bg-transparent border-none text-green-600 hover:bg-transparent hover:text-green-700 font-medium h-10 px-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Universities</span>
                <span className="sm:hidden">Back</span>
              </Button>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleVisitWebsite}
                  variant="outline"
                  className="flex items-center justify-center h-10 px-4 bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  <span>Visit Website</span>
                </Button>
                <Button
                  onClick={handleViewBooks}
                  className="flex items-center justify-center h-10 px-4 bg-green-600 text-white hover:bg-green-700"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>View Books</span>
                </Button>
              </div>
            </div>

            {/* University Header */}
            <div className="flex items-start text-center">
              {/* University Logo */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 w-20 h-20 flex items-center justify-center flex-shrink-0">
                {university.logo ? (
                  <img
                    src={university.logo}
                    alt={`${university.name} logo`}
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <Building
                  className={`h-12 w-12 text-gray-400 ${university.logo ? "hidden" : ""}`}
                />
              </div>

              {/* University Info */}
              <div className="flex-1 ml-6 text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {university.fullName || university.name}
                </h1>
                <div className="flex items-start text-left">
                  <div className="flex items-center text-left">
                    <MapPin className="h-4 w-4 mr-1 text-gray-600" />
                    <span className="text-gray-600">
                      <span>{university.location}</span>
                      <span>, </span>
                      <span>{university.province}</span>
                    </span>
                  </div>
                  <div className="flex items-center ml-4 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-700">
                    Public University
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="col-span-2">
              {/* About Section */}
              <Card className="bg-white border border-green-100 shadow-sm mb-8">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center">
                    <span>About </span>
                    <span>{university.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">
                    {university.overview ||
                      `${university.fullName || university.name} is a public research university located in ${university.location}, ${university.province}. It is consistently ranked among the top universities in the world.`}
                  </p>
                </CardContent>
              </Card>

              {/* Application Information */}
              <Card className="bg-white border-2 border-green-100 shadow-sm mt-8">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg font-semibold">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span>Application Information</span>
                    </span>
                    <div className="flex items-center bg-gray-100 border border-gray-200 rounded-full px-3 py-1 text-xs font-semibold gap-1">
                      <div className="h-4 w-4 rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <span className="text-gray-800">Not Available</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-gray-600 text-sm font-medium text-center">
                      <span>
                        Application information is not currently available
                        for{" "}
                      </span>
                      <span>{university.name}</span>
                      <span>
                        . Please visit the university website for the latest
                        application details.
                      </span>
                    </p>
                  </div>
                  <div className="mt-4 pt-2">
                    <Button
                      onClick={handleVisitWebsite}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 h-11"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      <span>Visit </span>
                      <span>{university.name}</span>
                      <span> Website</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Excellence Banner */}
              <Card className="bg-white border border-green-100 shadow-sm mt-8">
                <div className="relative h-64 bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=300&fit=crop&crop=center"
                    alt="Students studying with books"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20"></div>
                  <div className="absolute bottom-6 left-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Academic Excellence
                    </h2>
                    <p className="text-white/90">
                      <span>Discover your path to success at </span>
                      <span>{university.abbreviation}</span>
                    </p>
                  </div>
                </div>
              </Card>

              {/* Faculties & Schools */}
              <Card className="bg-white border border-green-100 shadow-sm mt-8">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center">
                    Faculties & Schools
                  </CardTitle>
                  <p className="text-green-700 mt-1.5 text-center">
                    Click on any faculty to explore available programs and
                    courses
                  </p>
                </CardHeader>
                <CardContent>
                  {university.faculties && university.faculties.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {university.faculties.map((faculty, index) => (
                        <div
                          key={faculty.id || index}
                          className="border border-gray-200 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:border-gray-300"
                          onClick={() => handleFacultyClick(faculty.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 cursor-pointer">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 transition-colors duration-150 hover:text-green-600">
                                {faculty.name}
                              </h3>
                              <p className="text-gray-600 text-sm leading-relaxed mb-3 overflow-hidden text-ellipsis">
                                {faculty.description ||
                                  "Faculty description coming soon"}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center bg-yellow-50 border border-green-100 rounded-full px-3 py-1 text-xs font-semibold text-yellow-700">
                                  {faculty.degrees?.length || 0} Programs
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600 hover:bg-transparent border-none h-11 px-4"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                      <BookOpen className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <p className="text-yellow-700 font-medium mb-2">
                        Program Information Loading
                      </p>
                      <p className="text-yellow-600 text-sm">
                        Faculty information is being processed. Programs and
                        course details will be available soon.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* University Statistics */}
              <Card className="bg-white border border-green-100 shadow-sm mt-8">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center">
                    University Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      {
                        icon: Users,
                        value: stats.students,
                        label: "Students",
                        color: "text-green-600",
                      },
                      {
                        icon: Calendar,
                        value: stats.established,
                        label: "Established",
                        color: "text-green-600",
                      },
                      {
                        icon: BookOpen,
                        value: stats.faculties,
                        label: "Faculties",
                        color: "text-green-600",
                      },
                      {
                        icon: MapPin,
                        value: stats.province,
                        label: "Province",
                        color: "text-green-600",
                      },
                    ].map((stat, index) => (
                      <div key={index} className="text-center p-4 rounded-lg">
                        <stat.icon
                          className={`h-6 w-6 ${stat.color} mx-auto mb-2`}
                        />
                        <div className={`text-2xl font-bold ${stat.color}`}>
                          {stat.value}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-white border border-green-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleViewBooks}
                    className="w-full bg-green-600 text-white hover:bg-green-700 h-11"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Browse Books for </span>
                    <span>{university.abbreviation}</span>
                  </Button>
                  <Button
                    onClick={handleAPSRequirements}
                    variant="outline"
                    className="w-full bg-green-50 border-green-200 text-green-600 hover:bg-green-100 h-11 mt-3"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    <span>Check APS Requirements</span>
                  </Button>
                  <Button
                    onClick={handleBursaries}
                    variant="outline"
                    className="w-full bg-green-50 border-green-200 text-green-600 hover:bg-green-100 h-11 mt-3"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    <span>Find Bursaries</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-white border border-green-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <label className="text-gray-700 text-sm font-medium mb-1 block">
                      Website
                    </label>
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 text-sm font-medium hover:underline break-all inline"
                    >
                      {university.website}
                    </a>
                  </div>
                  <div className="text-center mt-3">
                    <label className="text-gray-700 text-sm font-medium mb-1 block">
                      Location
                    </label>
                    <p className="text-gray-600 text-sm">
                      <span>{university.location}</span>
                      <span>, </span>
                      <span>{university.province}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Other Universities in Province */}
              <Card className="bg-white border border-green-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-center">
                    <span>Other Universities in </span>
                    <span>{university.province}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {otherUniversitiesInProvince.map((uni, index) => (
                      <Button
                        key={uni.id}
                        variant="outline"
                        className="w-full justify-between border border-gray-200 h-11 text-left"
                        onClick={() =>
                          navigate(`/university-profile?id=${uni.id}`)
                        }
                      >
                        <div className="text-gray-900 text-sm font-medium">
                          {uni.abbreviation}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {uni.location}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Detail Modal/Overlay */}
      {selectedFaculty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {
                    university.faculties?.find((f) => f.id === selectedFaculty)
                      ?.name
                  }
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedFaculty(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>

              <p className="text-gray-600 mb-6">
                {
                  university.faculties?.find((f) => f.id === selectedFaculty)
                    ?.description
                }
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Programs
                </h3>
                {university.faculties
                  ?.find((f) => f.id === selectedFaculty)
                  ?.degrees?.map((degree, index) => (
                    <div
                      key={degree.id || index}
                      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-300"
                      onClick={() => handleProgramClick(degree.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {degree.name}
                        </h4>
                        <Badge className="bg-green-600 text-white">
                          APS: {degree.apsRequirement}
                        </Badge>
                      </div>

                      {selectedProgram === degree.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-gray-600 mb-4">
                            {degree.description}
                          </p>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">
                                Duration
                              </h5>
                              <p className="text-gray-600">{degree.duration}</p>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">
                                APS Requirement
                              </h5>
                              <p className="text-gray-600">
                                {degree.apsRequirement} points
                              </p>
                            </div>
                          </div>

                          {degree.careerProspects &&
                            degree.careerProspects.length > 0 && (
                              <div className="mt-4">
                                <h5 className="font-semibold text-gray-900 mb-2">
                                  Career Prospects
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                  {degree.careerProspects.map(
                                    (career, careerIndex) => (
                                      <Badge
                                        key={careerIndex}
                                        variant="secondary"
                                        className="bg-blue-50 text-blue-700 border-blue-200"
                                      >
                                        {career}
                                      </Badge>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                          {degree.subjects && degree.subjects.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-semibold text-gray-900 mb-2">
                                Subject Requirements
                              </h5>
                              <div className="space-y-2">
                                {degree.subjects.map(
                                  (subject, subjectIndex) => (
                                    <div
                                      key={subjectIndex}
                                      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                                    >
                                      <span className="text-gray-700">
                                        {subject.name}
                                      </span>
                                      <Badge variant="outline">
                                        Level {subject.level}{" "}
                                        {subject.isRequired
                                          ? "(Required)"
                                          : "(Recommended)"}
                                      </Badge>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )) || (
                  <p className="text-gray-500 text-center py-8">
                    No programs available for this faculty.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UniversityProfile;
