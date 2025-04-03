import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, Share2, PlayCircle, Settings, Mic, Video, ScreenShare } from "lucide-react"

export default function StreamsPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">
          Live Coding <span className="text-purple-500">Streams</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stream Content */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Start Your Stream</h3>
                  <p className="text-gray-400 mt-2">Share your coding session with the world</p>
                </div>
              </div>

              {/* Stream Controls - Only visible when streaming */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 hidden">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="sm" className="text-white bg-purple-600/20 hover:bg-purple-600/30">
                      <Mic className="h-5 w-5 mr-2" />
                      Mute
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white bg-purple-600/20 hover:bg-purple-600/30">
                      <Video className="h-5 w-5 mr-2" />
                      Camera
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white bg-purple-600/20 hover:bg-purple-600/30">
                      <ScreenShare className="h-5 w-5 mr-2" />
                      Share Screen
                    </Button>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700">End Stream</Button>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Stream Title</h2>
                  <p className="text-gray-400">Started streaming 20 minutes ago</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">Start Streaming</Button>
              </div>

              <div className="flex items-center justify-between border-y border-gray-800 py-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">Coder Name</h3>
                    <p className="text-sm text-gray-400">20.4K followers</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    <ThumbsUp className="h-5 w-5 mr-2" />
                    Like
                  </Button>
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Stream Description</h3>
                <p className="text-gray-300">
                  In this coding session, I'll be building a real-time chat application using React and Firebase. We'll
                  cover component architecture, state management, and real-time database integration.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="bg-purple-900/30 px-3 py-1 rounded-full text-sm text-purple-300">#React</span>
                  <span className="bg-purple-900/30 px-3 py-1 rounded-full text-sm text-purple-300">#Firebase</span>
                  <span className="bg-purple-900/30 px-3 py-1 rounded-full text-sm text-purple-300">#WebDev</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Live Chat</h3>
                <span className="text-sm text-gray-400">125 viewers</span>
              </div>

              <div className="h-64 overflow-y-auto mb-4 space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U1</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold text-purple-400">@user123:</span>
                      <span className="text-gray-300"> How do you handle authentication in this setup?</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U2</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold text-purple-400">@devGuru:</span>
                      <span className="text-gray-300"> This is a great approach to state management!</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U3</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold text-purple-400">@codeNewbie:</span>
                      <span className="text-gray-300"> Could you explain the useEffect dependency array again?</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Input placeholder="Send a message" className="bg-gray-800 border-gray-700" />
                <Button className="bg-purple-600 hover:bg-purple-700">Send</Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-4">Stream Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Stream Title</label>
                  <Input defaultValue="Building a Real-time Chat App" className="bg-gray-800 border-gray-700" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Description</label>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-white h-24"
                    defaultValue="In this coding session, I'll be building a real-time chat application using React and Firebase."
                  ></textarea>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Tags</label>
                  <Input defaultValue="React, Firebase, WebDev" className="bg-gray-800 border-gray-700" />
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
              </div>
            </div>

            <h3 className="font-semibold mb-4">Recommended Streams</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-gray-900 border-gray-800 overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">LIVE</div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-sm">Advanced TypeScript Patterns</h4>
                        <p className="text-xs text-gray-400">CodeMaster • 1.2K watching</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

