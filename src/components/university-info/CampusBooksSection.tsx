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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Filter,
  TrendingUp,
  Users,
  MapPin,
  Star,
  ShoppingCart,
  ExternalLink,
  University,
  GraduationCap,
  DollarSign,
  Package,
  AlertCircle,
} from "lucide-react";
import { ALL_SOUTH_AFRICAN_UNIVERSITIES } from "@/constants/universities";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CampusBooksSection = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Get universities safely
  const universities = useMemo(() => {
    try {
      if (
        !ALL_SOUTH_AFRICAN_UNIVERSITIES ||
        !Array.isArray(ALL_SOUTH_AFRICAN_UNIVERSITIES)
      ) {
        console.warn("Universities data not available");
        return [];
      }

      return ALL_SOUTH_AFRICAN_UNIVERSITIES.filter(
        (uni) =>
          uni &&
          uni.id &&
          uni.name &&
          uni.faculties &&
          Array.isArray(uni.faculties),
      );
    } catch (error) {
      console.error("Error loading universities for books section:", error);
      return [];
    }
  }, []);

  // Get faculties from selected university
  const availableFaculties = useMemo(() => {
    try {
      if (!selectedUniversity) return [];

      const university = universities.find(
        (uni) => uni.id === selectedUniversity,
      );
      if (!university || !university.faculties) return [];

      return university.faculties.filter(
        (faculty) => faculty && faculty.id && faculty.name,
      );
    } catch (error) {
      console.error("Error getting faculties:", error);
      return [];
    }
  }, [selectedUniversity, universities]);

  // Mock book data for demonstration
  const mockBooks = [
    {
      id: "1",
      title: "Introduction to Chemistry",
      author: "Dr. Smith",
      isbn: "978-0-123456-78-9",
      price: 450,
      condition: "Good",
      university: "uct",
      faculty: "Science",
      level: "1st Year",
      seller: "Student123",
      location: "Cape Town",
      image: "/placeholder-book.jpg",
      description: "Comprehensive chemistry textbook for first-year students",
      tags: ["Chemistry", "Science", "First Year"],
    },
    {
      id: "2",
      title: "Business Management Fundamentals",
      author: "Prof. Johnson",
      isbn: "978-0-987654-32-1",
      price: 380,
      condition: "Excellent",
      university: "wits",
      faculty: "Commerce",
      level: "1st Year",
      seller: "BookLover",
      location: "Johannesburg",
      image: "/placeholder-book.jpg",
      description: "Essential business management concepts and principles",
      tags: ["Business", "Management", "Commerce"],
    },
    {
      id: "3",
      title: "Engineering Mathematics",
      author: "Dr. Brown",
      isbn: "978-0-456789-01-2",
      price: 520,
      condition: "Very Good",
      university: "stellenbosch",
      faculty: "Engineering",
      level: "2nd Year",
      seller: "MathGuru",
      location: "Stellenbosch",
      image: "/placeholder-book.jpg",
      description: "Advanced mathematics for engineering students",
      tags: ["Mathematics", "Engineering", "Second Year"],
    },
    {
      id: "4",
      title: "Human Anatomy & Physiology",
      author: "Dr. Wilson",
      isbn: "978-0-234567-89-0",
      price: 680,
      condition: "Good",
      university: "up",
      faculty: "Health Sciences",
      level: "1st Year",
      seller: "MedStudent",
      location: "Pretoria",
      image: "/placeholder-book.jpg",
      description: "Comprehensive guide to human anatomy and physiology",
      tags: ["Anatomy", "Medicine", "Health Sciences"],
    },
  ];

  // Filter books based on search criteria
  const filteredBooks = useMemo(() => {
    try {
      let filtered = [...mockBooks];

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (book) =>
            book.title.toLowerCase().includes(searchLower) ||
            book.author.toLowerCase().includes(searchLower) ||
            book.description.toLowerCase().includes(searchLower) ||
            book.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
        );
      }

      if (selectedUniversity && selectedUniversity !== "all") {
        filtered = filtered.filter(
          (book) => book.university === selectedUniversity,
        );
      }

      if (selectedFaculty && selectedFaculty !== "all") {
        filtered = filtered.filter((book) => book.faculty === selectedFaculty);
      }

      if (selectedLevel && selectedLevel !== "all") {
        filtered = filtered.filter((book) => book.level === selectedLevel);
      }

      return filtered;
    } catch (error) {
      console.error("Error filtering books:", error);
      return [];
    }
  }, [searchTerm, selectedUniversity, selectedFaculty, selectedLevel]);

  // Book card component
  const BookCard = ({ book }: { book: any }) => {
    const getConditionColor = (condition: string) => {
      switch (condition.toLowerCase()) {
        case "excellent":
          return "bg-green-100 text-green-800 border-green-200";
        case "very good":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "good":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "fair":
          return "bg-orange-100 text-orange-800 border-orange-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    const universityInfo = universities.find(
      (uni) => uni.id === book.university,
    );

    return (
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900 mb-1">
                {book.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                by {book.author}
              </CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getConditionColor(book.condition)}>
                  {book.condition}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {book.level}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                R{book.price}
              </div>
              <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="mb-3">
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <University className="w-4 h-4" />
              <span>{universityInfo?.name || book.university}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>{book.faculty}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{book.location}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {book.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {book.tags.slice(0, 3).map((tag: string, index: number) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-gray-100"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>Sold by: {book.seller}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current text-yellow-400" />
              <span>4.5</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate(`/book/${book.id}`)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              View Details
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="border-green-200 text-green-600 hover:bg-green-50"
              onClick={() => navigate(`/cart?add=${book.id}`)}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (universities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>Campus Books</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              University data is currently loading. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Image */}
      <div className="relative text-center space-y-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop&crop=center"
            alt="Stack of university textbooks"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/80 to-blue-50/80" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="w-8 h-8 text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Campus Textbook Marketplace
            </h2>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Buy and sell university textbooks with fellow students. Find
            affordable books for your courses and sell your used textbooks to
            help other students.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Find Your Books</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by title, author, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                University
              </label>
              <Select
                value={selectedUniversity}
                onValueChange={setSelectedUniversity}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {universities.map((university) => (
                    <SelectItem key={university.id} value={university.id}>
                      {university.abbreviation || university.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Faculty
              </label>
              <Select
                value={selectedFaculty}
                onValueChange={setSelectedFaculty}
                disabled={!selectedUniversity}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Faculties</SelectItem>
                  {availableFaculties.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.name}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Level
              </label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="1st Year">1st Year</SelectItem>
                  <SelectItem value="2nd Year">2nd Year</SelectItem>
                  <SelectItem value="3rd Year">3rd Year</SelectItem>
                  <SelectItem value="4th Year">4th Year</SelectItem>
                  <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm ||
            selectedUniversity ||
            selectedFaculty ||
            selectedLevel) && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedUniversity("all");
                  setSelectedFaculty("all");
                  setSelectedLevel("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Available Books ({filteredBooks.length})</span>
            <Button
              onClick={() => navigate("/books")}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Marketplace
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No books found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or browse all available
                books.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedUniversity("all");
                  setSelectedFaculty("all");
                  setSelectedLevel("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBooks.slice(0, 6).map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {filteredBooks.length > 6 && (
            <div className="text-center mt-6">
              <Button
                onClick={() => navigate("/books")}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                View All {filteredBooks.length} Books
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats and Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>Marketplace Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">2,500+</div>
                <div className="text-sm text-gray-600">Books Available</div>
              </div>
              <div className="text-center bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">1,200+</div>
                <div className="text-sm text-gray-600">Happy Students</div>
              </div>
              <div className="text-center bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">R350</div>
                <div className="text-sm text-gray-600">Avg. Savings</div>
              </div>
              <div className="text-center bg-orange-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-orange-600">4.8★</div>
                <div className="text-sm text-gray-600">Avg. Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5 text-green-600" />
              <span>Getting Started</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => navigate("/sell-book")}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Sell Your Books
            </Button>

            <Button
              onClick={() => navigate("/books")}
              variant="outline"
              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse All Books
            </Button>

            <Button
              onClick={() => navigate("/wishlist")}
              variant="outline"
              className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <Star className="w-4 h-4 mr-2" />
              Create Wishlist
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampusBooksSection;
