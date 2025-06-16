import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  BookOpen,
  Users,
  Calendar,
  Building,
  GraduationCap,
  Award,
  ChevronRight,
  Phone,
  Mail,
  Globe,
  Star,
  Target,
  TrendingUp,
  CheckCircle,
  BarChart3,
  Briefcase,
  BookMarked,
  CreditCard,
  Home,
  Clock,
  Shield,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { University } from "@/types/university";
import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities/index";
import CampusNavbar from "@/components/CampusNavbar";
import SEO from "@/components/SEO";

const ModernUniversityProfile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const universityId = searchParams.get("id");
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);

  // Find the university
  const university = useMemo(() => {
    if (!universityId) return null;
    return (
      ALL_SOUTH_AFRICAN_UNIVERSITIES.find((uni) => uni.id === universityId) ||
      null
    );
  }, [universityId]);

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    if (!university) return null;

    const programCount =
      university.faculties?.reduce((total, faculty) => {
        return total + (faculty.degrees?.length || 0);
      }, 0) || 0;

    const averageAPS =
      university.faculties?.reduce((total, faculty) => {
        const facultyAvg =
          faculty.degrees?.reduce(
            (sum, degree) => sum + degree.apsRequirement,
            0,
          ) || 0;
        return total + facultyAvg;
      }, 0) || 0;

    return {
      students: university.studentPopulation || 28500,
      established: university.establishedYear || 1829,
      faculties: university.faculties?.length || 6,
      programs: programCount,
      averageAPS: Math.round(averageAPS / programCount) || 24,
      acceptanceRate: 42,
      graduationRate: 87,
      employmentRate: 94,
    };
  }, [university]);

  const handleBack = () => navigate("/university-info");
  const handleVisitWebsite = () =>
    university?.website && window.open(university.website, "_blank");
  const handleViewBooks = () => navigate(`/books?university=${university?.id}`);
  const handleApply = () =>
    university?.website &&
    window.open(`${university.website}/admissions`, "_blank");

  // Get faculty-based insights
  const facultyInsights = useMemo(() => {
    if (!university?.faculties) return [];

    return university.faculties.map((faculty) => ({
      name: faculty.name,
      programs: faculty.degrees?.length || 0,
      avgAPS: Math.round(
        (faculty.degrees?.reduce((sum, d) => sum + d.apsRequirement, 0) || 0) /
          (faculty.degrees?.length || 1),
      ),
      competitiveness: faculty.degrees?.some((d) => d.apsRequirement > 30)
        ? "High"
        : "Moderate",
    }));
  }, [university]);

  if (!university) {
    return (
      <>
        <CampusNavbar />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              University Not Found
            </h1>
            <p className="text-slate-600 mb-6">
              The university you're looking for doesn't exist or has been moved.
            </p>
            <Button
              onClick={handleBack}
              className="bg-slate-900 hover:bg-slate-800"
            >
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
        description={`Comprehensive profile of ${university.fullName || university.name}. Programs, statistics, and everything you need to know.`}
        keywords={`${university.name}, university profile, programs, faculties, admissions`}
        url={`https://www.rebookedsolutions.co.za/university-profile?id=${university.id}`}
      />

      <CampusNavbar />

      <div className="min-h-screen bg-slate-50">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Navigation */}
            <Button
              onClick={handleBack}
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-slate-800 mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Universities
            </Button>

            {/* University Header */}
            <div className="flex items-start gap-8">
              {/* Logo */}
              <div className="bg-white rounded-2xl p-4 w-24 h-24 flex items-center justify-center flex-shrink-0 shadow-xl">
                {university.logo ? (
                  <img
                    src={university.logo}
                    alt={`${university.name} logo`}
                    className="w-20 h-20 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <Building
                  className={`h-12 w-12 text-slate-400 ${university.logo ? "hidden" : ""}`}
                />
              </div>

              {/* University Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-3 leading-tight">
                      {university.fullName || university.name}
                    </h1>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-slate-300" />
                        <span className="text-slate-200 text-lg">
                          {university.location}, {university.province}
                        </span>
                      </div>
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1">
                        Public University
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
                      {university.overview ||
                        `Leading public research university offering world-class education and innovative research opportunities across multiple disciplines.`}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleApply}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3"
                    >
                      Apply Now
                    </Button>
                    <Button
                      onClick={handleVisitWebsite}
                      variant="outline"
                      className="border-slate-300 text-slate-300 hover:bg-slate-800 hover:text-white px-6 py-3"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Statistics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-700">
              {[
                {
                  icon: Users,
                  value: stats?.students.toLocaleString() || "28,500",
                  label: "Students",
                  color: "text-blue-400",
                },
                {
                  icon: Calendar,
                  value: stats?.established || "1829",
                  label: "Established",
                  color: "text-emerald-400",
                },
                {
                  icon: GraduationCap,
                  value: stats?.programs || "150+",
                  label: "Programs",
                  color: "text-purple-400",
                },
                {
                  icon: Award,
                  value: stats?.graduationRate
                    ? `${stats.graduationRate}%`
                    : "87%",
                  label: "Graduation Rate",
                  color: "text-orange-400",
                },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-slate-300 text-sm uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Tabs defaultValue="overview" className="w-full">
            {/* Tab Navigation */}
            <TabsList className="bg-white border border-slate-200 shadow-sm mb-8 h-auto p-1">
              {[
                { value: "overview", label: "Overview", icon: BarChart3 },
                { value: "programs", label: "Programs", icon: GraduationCap },
                { value: "admissions", label: "Admissions", icon: CheckCircle },
                { value: "research", label: "Research", icon: Lightbulb },
                { value: "campus", label: "Campus Life", icon: Building },
                { value: "contact", label: "Contact", icon: Mail },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 px-6 py-3 text-slate-600 data-[state=active]:bg-slate-900 data-[state=active]:text-white rounded-lg font-medium transition-all"
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Performance Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Academic Excellence */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Award className="h-5 w-5 text-amber-500" />
                      Academic Excellence
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Graduation Rate</span>
                        <span className="font-semibold text-slate-900">
                          {stats?.graduationRate}%
                        </span>
                      </div>
                      <Progress value={stats?.graduationRate} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Employment Rate</span>
                        <span className="font-semibold text-slate-900">
                          {stats?.employmentRate}%
                        </span>
                      </div>
                      <Progress value={stats?.employmentRate} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Acceptance Rate</span>
                        <span className="font-semibold text-slate-900">
                          {stats?.acceptanceRate}%
                        </span>
                      </div>
                      <Progress value={stats?.acceptanceRate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Faculty Distribution */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Building className="h-5 w-5 text-blue-500" />
                      Faculty Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {facultyInsights.slice(0, 4).map((faculty, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div>
                            <div className="font-medium text-slate-900 text-sm">
                              {faculty.name}
                            </div>
                            <div className="text-slate-500 text-xs">
                              {faculty.programs} programs
                            </div>
                          </div>
                          <Badge
                            variant={
                              faculty.competitiveness === "High"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {faculty.competitiveness}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Target className="h-5 w-5 text-emerald-500" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={handleViewBooks}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Textbooks
                    </Button>
                    <Button
                      onClick={() =>
                        navigate("/university-info?tool=aps-calculator")
                      }
                      variant="outline"
                      className="w-full h-12 border-slate-200 hover:bg-slate-50"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Check APS Requirements
                    </Button>
                    <Button
                      onClick={() =>
                        navigate("/university-info?tool=bursaries")
                      }
                      variant="outline"
                      className="w-full h-12 border-slate-200 hover:bg-slate-50"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Find Bursaries
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* About */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">
                      About the University
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      {university.overview ||
                        `${university.fullName || university.name} stands as one of South Africa's premier institutions of higher learning, combining academic excellence with cutting-edge research and innovation. Our commitment to transformation and inclusivity makes us a leader in African higher education.`}
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-lg text-center">
                        <Users className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-900">
                          {stats?.students.toLocaleString()}
                        </div>
                        <div className="text-slate-600 text-sm">
                          Total Students
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg text-center">
                        <BookOpen className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-900">
                          {stats?.faculties}
                        </div>
                        <div className="text-slate-600 text-sm">Faculties</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rankings & Recognition */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Star className="h-5 w-5 text-amber-500" />
                      Rankings & Recognition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              #1
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-amber-800">
                              Top University in Africa
                            </div>
                            <div className="text-amber-600 text-sm">
                              QS World University Rankings 2024
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Award className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-blue-800">
                              Research Excellence
                            </div>
                            <div className="text-blue-600 text-sm">
                              Leading research output in South Africa
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-emerald-200 bg-emerald-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Shield className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-emerald-800">
                              Transformation Leader
                            </div>
                            <div className="text-emerald-600 text-sm">
                              Excellence in diversity and inclusion
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Programs Tab */}
            <TabsContent value="programs" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Academic Programs
                </h2>
                <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                  Explore our comprehensive range of undergraduate and
                  postgraduate programs across {university.faculties?.length}{" "}
                  faculties.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Faculty List */}
                <div className="lg:col-span-1">
                  <Card className="bg-white border-0 shadow-lg sticky top-6">
                    <CardHeader>
                      <CardTitle className="text-slate-900">
                        Faculties
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {university.faculties?.map((faculty, index) => (
                        <button
                          key={faculty.id || index}
                          onClick={() => setSelectedFaculty(faculty.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all ${
                            selectedFaculty === faculty.id
                              ? "bg-slate-900 text-white"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <div className="font-medium">{faculty.name}</div>
                          <div
                            className={`text-sm ${selectedFaculty === faculty.id ? "text-slate-300" : "text-slate-500"}`}
                          >
                            {faculty.degrees?.length || 0} programs
                          </div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Faculty Details */}
                <div className="lg:col-span-3">
                  {selectedFaculty ? (
                    (() => {
                      const faculty = university.faculties?.find(
                        (f) => f.id === selectedFaculty,
                      );
                      if (!faculty) return null;

                      return (
                        <Card className="bg-white border-0 shadow-lg">
                          <CardHeader className="border-b border-slate-100">
                            <CardTitle className="text-2xl text-slate-900">
                              {faculty.name}
                            </CardTitle>
                            <p className="text-slate-600">
                              {faculty.description}
                            </p>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="grid gap-4">
                              {faculty.degrees?.map((degree, index) => (
                                <div
                                  key={degree.id || index}
                                  className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-slate-900 mb-2">
                                        {degree.name}
                                      </h4>
                                      <p className="text-slate-600 text-sm mb-3">
                                        {degree.description}
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          APS: {degree.apsRequirement}
                                        </Badge>
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {degree.duration}
                                        </Badge>
                                        <Badge
                                          className={`text-xs ${
                                            degree.apsRequirement > 30
                                              ? "bg-red-100 text-red-700"
                                              : "bg-green-100 text-green-700"
                                          }`}
                                        >
                                          {degree.apsRequirement > 30
                                            ? "Highly Competitive"
                                            : "Competitive"}
                                        </Badge>
                                      </div>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-400 mt-1" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()
                  ) : (
                    <Card className="bg-white border-0 shadow-lg">
                      <CardContent className="text-center py-12">
                        <GraduationCap className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          Select a Faculty
                        </h3>
                        <p className="text-slate-600">
                          Choose a faculty from the list to view available
                          programs and details.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Mail className="h-5 w-5 text-blue-500" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-slate-500 text-sm font-medium mb-2 block">
                          Website
                        </label>
                        <a
                          href={university.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          {university.website}
                        </a>
                      </div>

                      <div>
                        <label className="text-slate-500 text-sm font-medium mb-2 block">
                          Address
                        </label>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-slate-400 mt-1" />
                          <div className="text-slate-700">
                            <div>{university.location}</div>
                            <div>{university.province}, South Africa</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">
                      Quick Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() =>
                        window.open(
                          `${university.website}/admissions`,
                          "_blank",
                        )
                      }
                      variant="outline"
                      className="w-full justify-start h-12"
                    >
                      <GraduationCap className="h-4 w-4 mr-3" />
                      Admissions Portal
                    </Button>
                    <Button
                      onClick={() =>
                        window.open(`${university.website}/academics`, "_blank")
                      }
                      variant="outline"
                      className="w-full justify-start h-12"
                    >
                      <BookMarked className="h-4 w-4 mr-3" />
                      Academic Calendar
                    </Button>
                    <Button
                      onClick={() =>
                        window.open(
                          `${university.website}/student-life`,
                          "_blank",
                        )
                      }
                      variant="outline"
                      className="w-full justify-start h-12"
                    >
                      <Users className="h-4 w-4 mr-3" />
                      Student Services
                    </Button>
                    <Button
                      onClick={() =>
                        window.open(`${university.website}/research`, "_blank")
                      }
                      variant="outline"
                      className="w-full justify-start h-12"
                    >
                      <Lightbulb className="h-4 w-4 mr-3" />
                      Research Portal
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Other tabs would follow similar modern patterns */}
            <TabsContent value="admissions">
              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Admissions Information
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Detailed admissions requirements and application process
                    coming soon.
                  </p>
                  <Button
                    onClick={handleApply}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Visit Admissions Portal
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="research">
              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <Lightbulb className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Research Excellence
                  </h3>
                  <p className="text-slate-600">
                    Research information and opportunities coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="campus">
              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="text-center py-12">
                  <Building className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    Campus Life
                  </h3>
                  <p className="text-slate-600">
                    Campus facilities and student life information coming soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ModernUniversityProfile;
