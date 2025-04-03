"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Save, Download, Share2, RefreshCwIcon as Refresh, Settings, Pen, Play } from "lucide-react"

export default function SandboxPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">
          Code <span className="text-purple-500">Sandbox</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Editor Section */}
          <div className="lg:col-span-8">
            <Card className="bg-gray-900 border-gray-800 mb-6">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <div>
                  <CardTitle>Code Editor</CardTitle>
                  <CardDescription>Real-time code execution environment</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select defaultValue="javascript">
                    <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-black rounded-md overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-900 px-4 py-2 border-b border-gray-800">
                    <div className="flex space-x-2">
                      <span className="h-3 w-3 rounded-full bg-red-500"></span>
                      <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                      <span className="h-3 w-3 rounded-full bg-green-500"></span>
                    </div>
                    <div className="text-xs text-gray-400">main.js</div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-800">
                        <Pen className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 font-mono text-sm h-80 overflow-y-auto bg-black">
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">1</div>
                      <pre className="text-purple-400">// Example: Simple counter using React</pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">2</div>
                      <pre className="text-blue-400">import</pre>
                      <pre className="text-white"> React, {"{ useState }"} </pre>
                      <pre className="text-blue-400">from</pre>
                      <pre className="text-green-400"> 'react'</pre>
                      <pre>;</pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">3</div>
                      <pre></pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">4</div>
                      <pre className="text-blue-400">function</pre>
                      <pre className="text-yellow-400"> Counter</pre>
                      <pre className="text-white">() {"{"}</pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">5</div>
                      <pre className="text-white pl-4">const [count, setCount] = useState(0);</pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">6</div>
                      <pre></pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">7</div>
                      <pre className="text-white pl-4">return (</pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">8</div>
                      <pre className="text-white pl-8">{"<div>"}</pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">9</div>
                      <pre className="text-white pl-12">{"<h1>Count: {count}</h1>"}</pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">10</div>
                      <pre className="text-white pl-12">
                        {"<button onClick={() => setCount(count + 1)}>Increment</button>"}
                      </pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">11</div>
                      <pre className="text-white pl-8">{"</div>"}</pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">12</div>
                      <pre className="text-white pl-4">);</pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">13</div>
                      <pre className="text-white">{"}"}</pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">14</div>
                      <pre></pre>
                    </div>
                    <div className="flex">
                      <div className="text-gray-600 mr-4 select-none text-right w-8">15</div>
                      <pre className="text-blue-400">export</pre>
                      <pre className="text-white"> </pre>
                      <pre className="text-blue-400">default</pre>
                      <pre className="text-white"> Counter;</pre>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t border-gray-800 pt-4 flex justify-between">
                <div className="flex space-x-2">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </Button>
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Output Console</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black rounded-md h-48 p-4 font-mono text-sm overflow-y-auto">
                  <div className="text-green-400">→ Running app...</div>
                  <div className="text-white">App started successfully at http://localhost:3000</div>
                  <div className="text-white">React counter component rendered</div>
                  <div className="text-white">Button clicked - count: 1</div>
                  <div className="text-white">Button clicked - count: 2</div>
                  <div className="text-white">Button clicked - count: 3</div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-800 pt-4">
                <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800 w-full">
                  <Refresh className="h-4 w-4 mr-2" />
                  Clear Console
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Sandbox Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Environment</label>
                    <Select defaultValue="node">
                      <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="node">Node.js</SelectItem>
                        <SelectItem value="browser">Browser</SelectItem>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="next">Next.js</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Node.js Version</label>
                    <Select defaultValue="16">
                      <SelectTrigger className="w-full bg-gray-800 border-gray-700">
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="18">v18.x (Latest)</SelectItem>
                        <SelectItem value="16">v16.x (LTS)</SelectItem>
                        <SelectItem value="14">v14.x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 block">Settings</label>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Auto Save</span>
                      </div>
                      <Switch id="autosave" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Auto Format</span>
                      </div>
                      <Switch id="autoformat" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Live Preview</span>
                      </div>
                      <Switch id="livepreview" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Dependencies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Search packages..." className="bg-gray-800 border-gray-700" />

                  <div>
                    <label className="text-sm text-gray-400 block mb-2">Installed</label>
                    <div className="space-y-2">
                      {[
                        { name: "react", version: "18.2.0" },
                        { name: "react-dom", version: "18.2.0" },
                        { name: "@babel/core", version: "7.20.12" },
                        { name: "typescript", version: "4.9.5" },
                      ].map((pkg, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-800 p-2 rounded-md">
                          <div className="text-sm">
                            <span className="font-medium">{pkg.name}</span>
                            <span className="text-gray-400 ml-2">v{pkg.version}</span>
                          </div>
                          <Badge variant="outline" className="text-xs border-purple-700 text-purple-400">
                            Installed
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Add Dependency</Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>Start with a pre-configured template</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: "React Counter", description: "Simple counter application" },
                    { name: "Todo App", description: "CRUD application with state management" },
                    { name: "API Client", description: "Fetch and display data from an API" },
                    { name: "Auth Flow", description: "Authentication flow with forms" },
                  ].map((template, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-800 p-3 rounded-md hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-xs text-gray-400">{template.description}</p>
                      </div>
                      <PlayCircle className="h-5 w-5 text-purple-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

