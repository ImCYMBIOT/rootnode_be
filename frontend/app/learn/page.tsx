import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BookOpen,
  Video,
  Code,
  FileText,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  PlayCircle,
  Star,
  Clock,
  Award,
  Tag,
} from "lucide-react"

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-purple-500">Learn</span> & Share
            </h1>
            <p className="text-gray-400 mt-1">Knowledge sharing platform for developers</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">Create Content</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800 sticky top-4">
              <CardHeader>
                <CardTitle>Content Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3 px-2 py-2 rounded-md bg-purple-800/20 text-purple-400">
                    <BookOpen className="h-5 w-5" />
                    <span>All Content</span>
                  </div>

                  <div className="flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-gray-800">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span>Articles</span>
                  </div>

                  <div className="flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-gray-800">
                    <Video className="h-5 w-5 text-gray-400" />
                    <span>Video Tutorials</span>
                  </div>

                  <div className="flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-gray-800">
                    <Code className="h-5 w-5 text-gray-400" />
                    <span>Code Examples</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {["React", "JavaScript", "TypeScript", "Node.js", "Next.js", "CSS", "GraphQL", "API"].map((tag) => (
                      <Badge key={tag} variant="outline" className="border-gray-700 hover:bg-gray-800 cursor-pointer">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Filters</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="featured" className="rounded-sm bg-gray-800 border-gray-600" />
                      <label htmlFor="featured" className="text-sm">
                        Featured
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="latest" className="rounded-sm bg-gray-800 border-gray-600" />
                      <label htmlFor="latest" className="text-sm">
                        Latest
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="popular" className="rounded-sm bg-gray-800 border-gray-600" />
                      <label htmlFor="popular" className="text-sm">
                        Most Popular
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="beginner" className="rounded-sm bg-gray-800 border-gray-600" />
                      <label htmlFor="beginner" className="text-sm">
                        Beginner Friendly
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="relative">
                <Input
                  placeholder="Search for articles, tutorials, or code examples..."
                  className="bg-gray-800 border-gray-700 pl-10"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <Tabs defaultValue="trending" className="mb-6">
              <TabsList className="bg-gray-900 border-b border-gray-800 w-full justify-start rounded-none p-0">
                <TabsTrigger
                  value="trending"
                  className="py-3 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                >
                  Trending
                </TabsTrigger>
                <TabsTrigger
                  value="latest"
                  className="py-3 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                >
                  Latest
                </TabsTrigger>
                <TabsTrigger
                  value="bookmarked"
                  className="py-3 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                >
                  Bookmarked
                </TabsTrigger>
                <TabsTrigger
                  value="following"
                  className="py-3 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                >
                  Following
                </TabsTrigger>
              </TabsList>

              {/* Featured Article */}
              <div className="mb-8">
                <div className="relative rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>
                  <div className="h-64 bg-gray-800"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className="bg-purple-600">Featured</Badge>
                      <Badge variant="outline" className="text-white border-white/30">
                        Tutorial
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Building Modern Web Applications with Next.js 13</h2>
                    <p className="text-gray-300 mb-4 max-w-3xl">
                      Learn how to leverage the power of Next.js 13 to build fast, SEO-friendly, and feature-rich web
                      applications with server components, streaming, and the app directory.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">John Doe</p>
                          <p className="text-sm text-gray-400">Published 3 days ago</p>
                        </div>
                      </div>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Read Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Mastering TypeScript: Advanced Type Techniques",
                    description:
                      "Explore advanced TypeScript features like conditional types, mapped types, and type inference",
                    author: "Sarah Johnson",
                    time: "1 week ago",
                    readTime: "12 min read",
                    likes: 348,
                    comments: 42,
                    type: "Article",
                    tags: ["TypeScript", "JavaScript"],
                  },
                  {
                    title: "Building a Real-time Chat App with React and Firebase",
                    description: "Step-by-step tutorial on creating a scalable real-time chat application",
                    author: "Michael Chen",
                    time: "2 weeks ago",
                    readTime: "20 min read",
                    likes: 512,
                    comments: 78,
                    type: "Tutorial",
                    tags: ["React", "Firebase", "Real-time"],
                  },
                  {
                    title: "Modern Authentication Patterns for Web Applications",
                    description: "Implement secure authentication flows using OAuth, JWT, and more",
                    author: "Alex Rivera",
                    time: "3 days ago",
                    readTime: "15 min read",
                    likes: 192,
                    comments: 24,
                    type: "Article",
                    tags: ["Security", "Auth", "OAuth"],
                  },
                  {
                    title: "Optimizing React Performance: Advanced Techniques",
                    description: "Learn how to identify and fix performance bottlenecks in React applications",
                    author: "Emma Wilson",
                    time: "5 days ago",
                    readTime: "18 min read",
                    likes: 275,
                    comments: 31,
                    type: "Video",
                    tags: ["React", "Performance"],
                  },
                  {
                    title: "Building a Design System with Tailwind CSS",
                    description: "Create a consistent design language for your applications using Tailwind CSS",
                    author: "David Park",
                    time: "1 day ago",
                    readTime: "10 min read",
                    likes: 167,
                    comments: 19,
                    type: "Tutorial",
                    tags: ["CSS", "Design", "Tailwind"],
                  },
                  {
                    title: "Serverless Architecture: Best Practices",
                    description: "Learn how to design and implement serverless applications with AWS Lambda",
                    author: "Sophia Martinez",
                    time: "2 days ago",
                    readTime: "14 min read",
                    likes: 203,
                    comments: 28,
                    type: "Article",
                    tags: ["Serverless", "AWS", "Architecture"],
                  },
                ].map((article, index) => (
                  <Card
                    key={index}
                    className="bg-gray-900 border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge
                          variant="outline"
                          className={
                            article.type === "Article"
                              ? "border-blue-500 text-blue-400"
                              : article.type === "Tutorial"
                                ? "border-green-500 text-green-400"
                                : "border-purple-500 text-purple-400"
                          }
                        >
                          {article.type === "Article" ? (
                            <FileText className="h-3 w-3 mr-1" />
                          ) : article.type === "Tutorial" ? (
                            <BookOpen className="h-3 w-3 mr-1" />
                          ) : (
                            <Video className="h-3 w-3 mr-1" />
                          )}
                          {article.type}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="mt-2 text-xl">{article.title}</CardTitle>
                      <CardDescription className="text-gray-400 mt-1">{article.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-gray-800 hover:bg-gray-700">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t border-gray-800 pt-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{article.author}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              {article.time} • {article.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-400">
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-sm">{article.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="h-4 w-4" />
                          <span className="text-sm">{article.comments}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                  Load More
                </Button>
              </div>
            </Tabs>
          </div>
        </div>

        {/* Community Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">
              Join Our <span className="text-purple-500">Community</span>
            </h2>
            <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
              Connect with other developers, share knowledge, and grow together in our vibrant community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Award className="h-12 w-12 text-purple-500" />
                </div>
                <CardTitle className="text-center">Monetize Your Content</CardTitle>
                <CardDescription className="text-center text-gray-400">
                  Earn rewards for your high-quality tutorials and articles
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">
                  Turn your knowledge into income with our creator program. Get paid for views, engagement, and helping
                  others learn.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="border-purple-700 text-purple-400 hover:bg-purple-900/20">
                  Learn More
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Code className="h-12 w-12 text-purple-500" />
                </div>
                <CardTitle className="text-center">Integrated Repositories</CardTitle>
                <CardDescription className="text-center text-gray-400">
                  Connect your content with live code examples
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">
                  Link your articles directly to repositories, providing readers with real-world examples they can
                  explore and execute.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="border-purple-700 text-purple-400 hover:bg-purple-900/20">
                  Connect Repos
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Star className="h-12 w-12 text-purple-500" />
                </div>
                <CardTitle className="text-center">Build Your Reputation</CardTitle>
                <CardDescription className="text-center text-gray-400">
                  Become recognized for your expertise
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300">
                  Gain followers, receive feedback, and establish yourself as an authority in your field through quality
                  content.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="border-purple-700 text-purple-400 hover:bg-purple-900/20">
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

