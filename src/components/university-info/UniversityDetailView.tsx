import React from "react";
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Users,
  BookOpen,
  GraduationCap,
  Globe,
  Mail,
  Calendar,
  Award,
  Building,
  Phone,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { University } from "@/types/university";

interface UniversityDetailViewProps {
  university: University;
  onBack: () => void;
}

const UniversityDetailView: React.FC<UniversityDetailViewProps> = ({
  university,
  onBack,
}) => {
  // Calculate program count
  const totalPrograms =
    university.faculties?.reduce((total, faculty) => {
      return total + (faculty.degrees?.length || 0);
    }, 0) || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Navigation */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-2 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Universities
        </Button>
      </div>

      {/* University Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* University Logo & Basic Info */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-200">
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
                <GraduationCap
                  className={`h-12 w-12 text-gray-400 ${university.logo ? "hidden" : ""}`}
                />
              </div>
            </div>

            {/* University Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {university.fullName || university.name}
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {university.abbreviation}
                  </p>

                  <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin
                        className="h-5 w-5"
                        style={{ color: "rgb(68, 171, 131)" }}
                      />
                      <span>
                        {university.location}, {university.province}
                      </span>
                    </div>
                    {university.establishedYear && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span>Established {university.establishedYear}</span>
                      </div>
                    )}
                  </div>

                  {/* University Type */}
                  {university.type && (
                    <div className="mb-6">
                      <Badge
                        variant="secondary"
                        className="text-sm px-4 py-2"
                        style={{
                          backgroundColor: "rgba(68, 171, 131, 0.1)",
                          color: "rgb(68, 171, 131)",
                          border: "1px solid rgba(68, 171, 131, 0.2)",
                        }}
                      >
                        {university.type}
                      </Badge>
                    </div>
                  )}

                  {/* University Overview */}
                  {university.overview && (
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {university.overview}
                    </p>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-3 lg:w-48">
                  {university.website && (
                    <Button
                      onClick={() => window.open(university.website, "_blank")}
                      className="text-white transition-colors"
                      style={{
                        backgroundColor: "rgb(68, 171, 131)",
                        borderColor: "rgb(68, 171, 131)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgb(56, 142, 108)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgb(68, 171, 131)";
                      }}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                  {university.studentPortal && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(university.studentPortal, "_blank")
                      }
                      className="border-gray-300 hover:border-gray-400"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Student Portal
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="bg-white px-8 py-6 border-t border-gray-100">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div
                className="text-3xl font-bold mb-1"
                style={{ color: "rgb(68, 171, 131)" }}
              >
                {totalPrograms}
              </div>
              <div className="text-sm text-gray-600">Academic Programs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700 mb-1">
                {university.faculties?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Faculties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700 mb-1">
                {university.studentPopulation
                  ? university.studentPopulation > 1000
                    ? `${Math.round(university.studentPopulation / 1000)}k+`
                    : university.studentPopulation.toString()
                  : "N/A"}
              </div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700 mb-1">
                {university.campuses?.length || 1}
              </div>
              <div className="text-sm text-gray-600">
                Campus{(university.campuses?.length || 1) !== 1 ? "es" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger
            value="programs"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Programs
          </TabsTrigger>
          <TabsTrigger
            value="admissions"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Admissions
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </TabsTrigger>
          <TabsTrigger
            value="campus"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Building className="h-4 w-4 mr-2" />
            Campus
          </TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="mt-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Academic Programs
              </CardTitle>
              <p className="text-gray-600">
                Explore the {totalPrograms} programs offered across{" "}
                {university.faculties?.length || 0} faculties
              </p>
            </CardHeader>
            <CardContent>
              {university.faculties && university.faculties.length > 0 ? (
                <div className="space-y-8">
                  {university.faculties.map((faculty, index) => (
                    <div
                      key={faculty.id || index}
                      className="bg-gray-50 rounded-xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "rgba(68, 171, 131, 0.1)" }}
                        >
                          <Building
                            className="h-6 w-6"
                            style={{ color: "rgb(68, 171, 131)" }}
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {faculty.name}
                          </h3>
                          <p className="text-gray-600">
                            {faculty.degrees?.length || 0} programs available
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-6">
                        {faculty.description}
                      </p>

                      {faculty.degrees && faculty.degrees.length > 0 ? (
                        <div className="grid gap-4">
                          {faculty.degrees.map((degree, degreeIndex) => (
                            <div
                              key={degree.id || degreeIndex}
                              className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors"
                            >
                              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    {degree.name}
                                  </h4>
                                  <p className="text-gray-600 mb-4 leading-relaxed">
                                    {degree.description}
                                  </p>

                                  <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge
                                      variant="outline"
                                      className="bg-gray-50"
                                    >
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {degree.duration}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      style={{
                                        backgroundColor:
                                          "rgba(68, 171, 131, 0.1)",
                                        color: "rgb(68, 171, 131)",
                                        borderColor: "rgba(68, 171, 131, 0.3)",
                                      }}
                                    >
                                      <Award className="h-3 w-3 mr-1" />
                                      APS: {degree.apsRequirement}
                                    </Badge>
                                  </div>

                                  {degree.careerProspects &&
                                    degree.careerProspects.length > 0 && (
                                      <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                          Career Opportunities:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {degree.careerProspects
                                            .slice(0, 4)
                                            .map((career, careerIndex) => (
                                              <Badge
                                                key={careerIndex}
                                                variant="secondary"
                                                className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                              >
                                                {career}
                                              </Badge>
                                            ))}
                                          {degree.careerProspects.length >
                                            4 && (
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              +
                                              {degree.careerProspects.length -
                                                4}{" "}
                                              more
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>No specific programs listed for this faculty.</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No Programs Available
                  </h3>
                  <p className="text-gray-500">
                    Program information for this university is not yet
                    available.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admissions" className="mt-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Admissions Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {university.applicationInfo ? (
                <div className="grid gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Application Status
                    </h3>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`px-4 py-2 ${
                          university.applicationInfo.isOpen
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {university.applicationInfo.isOpen
                          ? "Open for Applications"
                          : "Applications Closed"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {university.applicationInfo.academicYear && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Academic Year
                        </h4>
                        <p className="text-gray-600">
                          {university.applicationInfo.academicYear}
                        </p>
                      </div>
                    )}

                    {university.applicationInfo.openingDate && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Opening Date
                        </h4>
                        <p className="text-gray-600">
                          {university.applicationInfo.openingDate}
                        </p>
                      </div>
                    )}

                    {university.applicationInfo.closingDate && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Closing Date
                        </h4>
                        <p className="text-gray-600">
                          {university.applicationInfo.closingDate}
                        </p>
                      </div>
                    )}

                    {university.applicationInfo.applicationFee && (
                      <div className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Application Fee
                        </h4>
                        <p className="text-gray-600">
                          {university.applicationInfo.applicationFee}
                        </p>
                      </div>
                    )}
                  </div>

                  {university.applicationInfo.applicationMethod && (
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h3 className="text-lg font-semibold text-blue-900 mb-3">
                        Application Method
                      </h3>
                      <p className="text-blue-800">
                        {university.applicationInfo.applicationMethod}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No Admissions Information
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Please visit the university website for current application
                    details.
                  </p>
                  {university.website && (
                    <Button
                      onClick={() => window.open(university.website, "_blank")}
                      className="text-white"
                      style={{ backgroundColor: "rgb(68, 171, 131)" }}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit University Website
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="mt-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {/* Primary Contact Methods */}
                <div className="grid md:grid-cols-2 gap-6">
                  {university.website && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Globe
                          className="h-6 w-6"
                          style={{ color: "rgb(68, 171, 131)" }}
                        />
                        <h3 className="text-lg font-semibold">Website</h3>
                      </div>
                      <a
                        href={university.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 underline break-all"
                      >
                        {university.website}
                      </a>
                    </div>
                  )}

                  {university.admissionsContact && (
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <Mail
                          className="h-6 w-6"
                          style={{ color: "rgb(68, 171, 131)" }}
                        />
                        <h3 className="text-lg font-semibold">Admissions</h3>
                      </div>
                      <p className="text-gray-700">
                        {university.admissionsContact}
                      </p>
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin
                      className="h-6 w-6"
                      style={{ color: "rgb(68, 171, 131)" }}
                    />
                    <h3 className="text-lg font-semibold">Location</h3>
                  </div>
                  <p className="text-gray-700 text-lg">
                    {university.location}, {university.province}
                  </p>
                </div>

                {/* Student Portal */}
                {university.studentPortal && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">
                        Student Portal
                      </h3>
                    </div>
                    <a
                      href={university.studentPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline break-all"
                    >
                      {university.studentPortal}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campus" className="mt-8">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Campus Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {/* Main Campus */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Main Campus</h3>
                  <div className="flex items-center gap-3">
                    <MapPin
                      className="h-5 w-5"
                      style={{ color: "rgb(68, 171, 131)" }}
                    />
                    <span className="text-gray-700">
                      {university.location}, {university.province}
                    </span>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  {university.establishedYear && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Established
                      </h4>
                      <p className="text-gray-600 text-lg">
                        {university.establishedYear}
                      </p>
                    </div>
                  )}

                  {university.studentPopulation && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Student Population
                      </h4>
                      <p className="text-gray-600 text-lg">
                        Approximately{" "}
                        {university.studentPopulation.toLocaleString()} students
                      </p>
                    </div>
                  )}
                </div>

                {/* All Campuses */}
                {university.campuses && university.campuses.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4">All Campuses</h3>
                    <div className="grid gap-3">
                      {university.campuses.map((campus, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Building className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700">{campus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UniversityDetailView;
