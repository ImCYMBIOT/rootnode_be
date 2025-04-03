import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, GitBranch, GitCommit, GitMerge, Star, GitFork, Plus, Filter, Clock, FolderGit } from "lucide-react"

export default function ArchivesPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Code <span className="text-purple-500">Archives</span>
            </h1>
            <p className="text-gray-400 mt-1">Centralized hub for all your repositories</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            New Repository
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Repository Navigator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search repositories..." className="pl-10 bg-gray-800 border-gray-700" />
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Filters</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="personal" className="rounded-sm bg-gray-800 border-gray-600" />
                      <label htmlFor="personal" className="text-sm">
                        Personal repositories
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="collaborated" className="rounded-sm bg-gray-800 border-gray-600" />
                      <label htmlFor="collaborated" className="text-sm">
                        Collaborated repositories
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="forked" className="rounded-sm bg-gray-800 border-gray-600" />
                      <label htmlFor="forked" className="text-sm">
                        Forked repositories
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Languages</h3>
                  <div className="space-y-2">
                    {["JavaScript", "TypeScript", "Python", "Go", "Rust"].map((lang) => (
                      <div key={lang} className="flex items-center space-x-2">
                        <input type="checkbox" id={lang} className="rounded-sm bg-gray-800 border-gray-600" />
                        <label htmlFor={lang} className="text-sm">
                          {lang}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full border-gray-700 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 mt-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    action: "Committed to",
                    repo: "next-auth-example",
                    time: "2 hours ago",
                    icon: <GitCommit className="h-4 w-4 text-green-400" />,
                  },
                  {
                    action: "Created branch",
                    repo: "ui-components",
                    time: "5 hours ago",
                    icon: <GitBranch className="h-4 w-4 text-blue-400" />,
                  },
                  {
                    action: "Merged PR in",
                    repo: "api-service",
                    time: "1 day ago",
                    icon: <GitMerge className="h-4 w-4 text-purple-400" />,
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <p className="text-sm">
                        {item.action} <span className="text-purple-400 font-medium">{item.repo}</span>
                      </p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="repositories" className="w-full">
              <TabsList className="bg-gray-900 border-b border-gray-800 w-full justify-start rounded-none p-0">
                <TabsTrigger
                  value="repositories"
                  className="py-3 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                >
                  Repositories
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="py-3 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="version-control"
                  className="py-3 px-6 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-purple-500 rounded-none"
                >
                  Version Control
                </TabsTrigger>
              </TabsList>

              <TabsContent value="repositories" className="mt-6">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      name: "next-auth-example",
                      description: "Example implementation of NextAuth.js for authentication",
                      language: "TypeScript",
                      stars: 45,
                      forks: 12,
                      updated: "2 hours ago",
                      private: false,
                    },
                    {
                      name: "ui-components",
                      description: "Reusable UI components built with React and Tailwind CSS",
                      language: "JavaScript",
                      stars: 128,
                      forks: 34,
                      updated: "3 days ago",
                      private: false,
                    },
                    {
                      name: "api-service",
                      description: "Backend API service built with Express and MongoDB",
                      language: "JavaScript",
                      stars: 72,
                      forks: 18,
                      updated: "1 week ago",
                      private: true,
                    },
                    {
                      name: "data-visualization",
                      description: "Interactive data visualization dashboard using D3.js",
                      language: "JavaScript",
                      stars: 93,
                      forks: 27,
                      updated: "2 weeks ago",
                      private: false,
                    },
                  ].map((repo, index) => (
                    <Card key={index} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                      <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <FolderGit className="h-4 w-4 text-purple-400" />
                            <CardTitle className="text-lg">{repo.name}</CardTitle>
                            {repo.private && (
                              <Badge variant="outline" className="text-xs border-yellow-600 text-yellow-500">
                                Private
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-gray-400 mt-1">{repo.description}</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                          <Star className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardFooter className="pt-0 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                            <span className="text-gray-400">{repo.language}</span>
                          </div>
                          <div className="flex items-center text-gray-400">
                            <Star className="h-4 w-4 mr-1" />
                            {repo.stars}
                          </div>
                          <div className="flex items-center text-gray-400">
                            <GitFork className="h-4 w-4 mr-1" />
                            {repo.forks}
                          </div>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          Updated {repo.updated}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "E-commerce Platform",
                      progress: 75,
                      status: "In Progress",
                      repos: 3,
                      contributors: 5,
                    },
                    {
                      name: "Mobile App Redesign",
                      progress: 30,
                      status: "In Progress",
                      repos: 2,
                      contributors: 3,
                    },
                    {
                      name: "Documentation Site",
                      progress: 100,
                      status: "Completed",
                      repos: 1,
                      contributors: 2,
                    },
                    {
                      name: "API Integration",
                      progress: 50,
                      status: "In Progress",
                      repos: 2,
                      contributors: 4,
                    },
                  ].map((project, index) => (
                    <Card key={index} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{project.name}</CardTitle>
                          <Badge
                            className={
                              project.status === "Completed"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-blue-600 hover:bg-blue-700"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1">
                          <div className="text-sm text-gray-400">Progress</div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-right text-xs text-gray-400">{project.progress}%</div>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between">
                        <div className="text-sm text-gray-400">
                          <span className="font-medium">{project.repos}</span> repositories
                        </div>
                        <div className="flex items-center">
                          <div className="flex -space-x-2">
                            {Array.from({ length: Math.min(3, project.contributors) }).map((_, i) => (
                              <Avatar key={i} className="h-6 w-6 border-2 border-gray-900">
                                <AvatarFallback className="text-xs">U{i + 1}</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          {project.contributors > 3 && (
                            <span className="text-xs text-gray-400 ml-2">+{project.contributors - 3} more</span>
                          )}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="version-control" className="mt-6">
                <Card className="bg-gray-900 border-gray-800 mb-6">
                  <CardHeader>
                    <CardTitle>Version Control Overview</CardTitle>
                    <CardDescription>Track changes, manage branches, and collaborate efficiently</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <GitCommit className="h-5 w-5 text-green-400" />
                          <h3 className="font-semibold">Commits</h3>
                        </div>
                        <p className="text-3xl font-bold">243</p>
                        <p className="text-sm text-gray-400">Last 30 days</p>
                      </div>

                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <GitBranch className="h-5 w-5 text-blue-400" />
                          <h3 className="font-semibold">Branches</h3>
                        </div>
                        <p className="text-3xl font-bold">18</p>
                        <p className="text-sm text-gray-400">Active branches</p>
                      </div>

                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center space-x-3 mb-2">
                          <GitMerge className="h-5 w-5 text-purple-400" />
                          <h3 className="font-semibold">Pull Requests</h3>
                        </div>
                        <p className="text-3xl font-bold">12</p>
                        <p className="text-sm text-gray-400">Open PRs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle>Recent Git Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-2.5 top-0 bottom-0 w-px bg-gray-800"></div>
                      <div className="space-y-6">
                        {[
                          {
                            type: "commit",
                            message: "Fix authentication bug in login flow",
                            repo: "next-auth-example",
                            time: "2 hours ago",
                            icon: <GitCommit className="h-5 w-5 text-green-400" />,
                          },
                          {
                            type: "branch",
                            message: "Created new branch feature/user-profiles",
                            repo: "ui-components",
                            time: "5 hours ago",
                            icon: <GitBranch className="h-5 w-5 text-blue-400" />,
                          },
                          {
                            type: "merge",
                            message: "Merged PR #42: Implement user settings page",
                            repo: "api-service",
                            time: "1 day ago",
                            icon: <GitMerge className="h-5 w-5 text-purple-400" />,
                          },
                          {
                            type: "commit",
                            message: "Update README with installation instructions",
                            repo: "data-visualization",
                            time: "2 days ago",
                            icon: <GitCommit className="h-5 w-5 text-green-400" />,
                          },
                          {
                            type: "merge",
                            message: "Merged PR #37: Add chart export functionality",
                            repo: "data-visualization",
                            time: "3 days ago",
                            icon: <GitMerge className="h-5 w-5 text-purple-400" />,
                          },
                        ].map((activity, index) => (
                          <div key={index} className="flex">
                            <div className="flex-shrink-0 z-10 relative">
                              <div className="h-6 w-6 rounded-full bg-gray-800 flex items-center justify-center">
                                {activity.icon}
                              </div>
                            </div>
                            <div className="ml-4 flex-grow">
                              <p className="text-white font-medium">{activity.message}</p>
                              <div className="flex items-center text-sm text-gray-400 mt-1">
                                <span>in {activity.repo}</span>
                                <span className="mx-2">•</span>
                                <span>{activity.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

