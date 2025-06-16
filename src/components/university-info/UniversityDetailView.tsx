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
  Phone,
  Calendar,
  Award,
  Building,
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
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Universities
        </Button>
      </div>

      {/* University Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* University logo */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-lg flex items-center justify-center">
                {university.logo ? (
                  <img
                    src={university.logo}
                    alt={`${university.name} logo`}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <GraduationCap
                  className={`h-8 w-8 sm:h-10 sm:w-10 text-blue-600 ${university.logo ? "hidden" : ""}`}
                />
              </div>
            </div>

            {/* University info */}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl mb-2">
                {university.fullName || university.name}
              </CardTitle>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                  {university.location}, {university.province}
                </span>
              </div>

              {/* University type and established */}
              <div className="flex flex-wrap gap-2 mb-3">
                {university.type && (
                  <Badge variant="secondary" className="text-xs">
                    {university.type}
                  </Badge>
                )}
                {university.establishedYear && (
                  <Badge variant="outline" className="text-xs">
                    Est. {university.establishedYear}
                  </Badge>
                )}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center bg-blue-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-blue-600">
                    {totalPrograms}
                  </div>
                  <div className="text-xs text-gray-600">Programs</div>
                </div>
                <div className="text-center bg-green-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-green-600">
                    {university.faculties?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600">Faculties</div>
                </div>
                <div className="text-center bg-purple-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-purple-600">
                    {university.studentPopulation
                      ? university.studentPopulation > 1000
                        ? `${Math.round(university.studentPopulation / 1000)}k+`
                        : university.studentPopulation.toString()
                      : "N/A"}
                  </div>
                  <div className="text-xs text-gray-600">Students</div>
                </div>
                <div className="text-center bg-orange-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-orange-600">
                    {university.campuses?.length || 1}
                  </div>
                  <div className="text-xs text-gray-600">
                    Campus{(university.campuses?.length || 1) !== 1 ? "es" : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* University overview */}
          {university.overview && (
            <p className="text-gray-700 leading-relaxed mb-4">
              {university.overview}
            </p>
          )}

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3">
            {university.website && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(university.website, "_blank")}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Website
              </Button>
            )}
            {university.studentPortal && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(university.studentPortal, "_blank")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Student Portal
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="admissions">Admissions</TabsTrigger>
          <TabsTrigger value="campus">Campus</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Academic Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {university.faculties && university.faculties.length > 0 ? (
                <div className="space-y-6">
                  {university.faculties.map((faculty, index) => (
                    <div
                      key={faculty.id || index}
                      className="border rounded-lg p-4"
                    >
                      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {faculty.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {faculty.description}
                      </p>

                      {faculty.degrees && faculty.degrees.length > 0 ? (
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm text-gray-800">
                            Programs ({faculty.degrees.length}):
                          </h4>
                          <div className="grid gap-3">
                            {faculty.degrees.map((degree, degreeIndex) => (
                              <div
                                key={degree.id || degreeIndex}
                                className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500"
                              >
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-sm text-gray-900 mb-1">
                                      {degree.name}
                                    </h5>
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                      {degree.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {degree.duration}
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        APS: {degree.apsRequirement}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {degree.careerProspects &&
                                  degree.careerProspects.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                      <p className="text-xs text-gray-600 mb-1">
                                        Career Prospects:
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {degree.careerProspects
                                          .slice(0, 3)
                                          .map((career, careerIndex) => (
                                            <Badge
                                              key={careerIndex}
                                              variant="outline"
                                              className="text-xs bg-green-50 text-green-700 border-green-200"
                                            >
                                              {career}
                                            </Badge>
                                          ))}
                                        {degree.careerProspects.length > 3 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            +{degree.careerProspects.length - 3}{" "}
                                            more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm italic">
                          No specific programs listed for this faculty.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    No program information available.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Website */}
              {university.website && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Website</p>
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 hover:underline text-sm truncate block"
                    >
                      {university.website}
                    </a>
                  </div>
                </div>
              )}

              {/* Student Portal */}
              {university.studentPortal && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Student Portal</p>
                    <a
                      href={university.studentPortal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 hover:underline text-sm truncate block"
                    >
                      {university.studentPortal}
                    </a>
                  </div>
                </div>
              )}

              {/* Admissions Contact */}
              {university.admissionsContact && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Admissions</p>
                    <p className="text-sm text-gray-600">
                      {university.admissionsContact}
                    </p>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-600">
                    {university.location}, {university.province}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Admissions Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {university.applicationInfo ? (
                <div className="space-y-4">
                  {/* Application Status */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">
                      Application Status
                    </span>
                    <Badge
                      className={
                        university.applicationInfo.isOpen
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {university.applicationInfo.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>

                  {/* Academic Year */}
                  {university.applicationInfo.academicYear && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Academic Year</span>
                      <span className="text-sm">
                        {university.applicationInfo.academicYear}
                      </span>
                    </div>
                  )}

                  {/* Application Dates */}
                  {university.applicationInfo.openingDate && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Opening Date</span>
                      <span className="text-sm">
                        {university.applicationInfo.openingDate}
                      </span>
                    </div>
                  )}

                  {university.applicationInfo.closingDate && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Closing Date</span>
                      <span className="text-sm">
                        {university.applicationInfo.closingDate}
                      </span>
                    </div>
                  )}

                  {/* Application Fee */}
                  {university.applicationInfo.applicationFee && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">
                        Application Fee
                      </span>
                      <span className="text-sm">
                        {university.applicationInfo.applicationFee}
                      </span>
                    </div>
                  )}

                  {/* Application Method */}
                  {university.applicationInfo.applicationMethod && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium mb-1">
                        Application Method
                      </p>
                      <p className="text-sm text-gray-600">
                        {university.applicationInfo.applicationMethod}
                      </p>
                    </div>
                  )}

                  {/* Late Applications */}
                  {university.applicationInfo.lateApplications && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium mb-2">
                        Late Applications
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Available</span>
                          <Badge
                            variant={
                              university.applicationInfo.lateApplications
                                .available
                                ? "default"
                                : "secondary"
                            }
                          >
                            {university.applicationInfo.lateApplications
                              .available
                              ? "Yes"
                              : "No"}
                          </Badge>
                        </div>
                        {university.applicationInfo.lateApplications
                          .deadline && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Deadline</span>
                            <span className="text-sm">
                              {
                                university.applicationInfo.lateApplications
                                  .deadline
                              }
                            </span>
                          </div>
                        )}
                        {university.applicationInfo.lateApplications
                          .additionalFee && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Additional Fee</span>
                            <span className="text-sm">
                              {
                                university.applicationInfo.lateApplications
                                  .additionalFee
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    No admissions information available.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Please visit the university website for current application
                    details.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campus" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Campus Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Main Campus Location */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium mb-1">Main Campus</p>
                  <p className="text-sm text-gray-600">
                    {university.location}, {university.province}
                  </p>
                </div>

                {/* Additional Campuses */}
                {university.campuses && university.campuses.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium mb-2">All Campuses</p>
                    <div className="space-y-1">
                      {university.campuses.map((campus, index) => (
                        <p key={index} className="text-sm text-gray-600">
                          • {campus}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Student Population */}
                {university.studentPopulation && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">
                      Student Population
                    </p>
                    <p className="text-sm text-gray-600">
                      Approximately{" "}
                      {university.studentPopulation.toLocaleString()} students
                    </p>
                  </div>
                )}

                {/* Established Year */}
                {university.establishedYear && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Established</p>
                    <p className="text-sm text-gray-600">
                      {university.establishedYear}
                    </p>
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
