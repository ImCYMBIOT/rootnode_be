import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#9333EA" />
              <path
                d="M2 17L12 22L22 17"
                stroke="#9333EA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="#9333EA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-xl font-bold">Root Node</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/streams" className="text-gray-300 hover:text-white transition-colors">
            Streams
          </Link>
          <Link href="/archives" className="text-gray-300 hover:text-white transition-colors">
            Archives
          </Link>
          <Link href="/sandbox" className="text-gray-300 hover:text-white transition-colors">
            Sandbox
          </Link>
          <Link href="/learn" className="text-gray-300 hover:text-white transition-colors">
            Learn
          </Link>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">
            Devs
          </a>
        </nav>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">Login</Button>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Code, stream & <span className="text-purple-500">solve problems.</span>
            </h1>
            <p className="text-gray-400 mb-8">Manage repositories, execute and stream code with no latency.</p>
            <div className="space-y-6">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6">Start Coding!</Button>
              <p className="text-sm text-gray-500">Your journey to becoming a better developer starts here.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-purple-900/30 blur-xl rounded-2xl"></div>
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="RGB Keyboard"
              width={600}
              height={400}
              className="relative rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/streams" className="p-6 rounded-lg hover:bg-gray-900/50 transition-colors">
            <div className="text-purple-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Stream Live Coding</h3>
            <p className="text-gray-400">
              Stream your coding sessions live for real-time interaction and feedback. Build using a global scale while
              sharing your screen with a collaborative community.
            </p>
          </Link>

          <Link href="/archives" className="p-6 rounded-lg hover:bg-gray-900/50 transition-colors">
            <div className="text-purple-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 8v13H3V8"></path>
                <path d="M1 3h22v5H1z"></path>
                <path d="M10 12h4"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Create Code Archives</h3>
            <p className="text-gray-400">
              Create, manage, and track your repositories with seamless version control. Simplify code commits,
              branching, and merging for efficient project management.
            </p>
          </Link>

          <Link href="/sandbox" className="p-6 rounded-lg hover:bg-gray-900/50 transition-colors">
            <div className="text-purple-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 10h-4v4h4v-4z"></path>
                <path d="M22 8v8h-8v8H6v-8H2V8h8V0h8v8h4z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Execute Code Instantly</h3>
            <p className="text-gray-400">
              Run your code instantly in the browser with our integrated sandbox—no set up needed. Supports multiple
              languages and services for quick demos, coding, or sharing projects.
            </p>
          </Link>
        </div>
      </section>

      {/* Content Creation Section */}
      <section className="container mx-auto py-16 bg-gradient-to-b from-transparent to-black/20 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold text-purple-500 mb-4">
              Publish Articles and Tutorials to Educate and Inspire the Developer Community
            </h2>
            <p className="text-gray-400 mb-6">
              Showcase your expertise by publishing articles and tutorials that educate and inspire fellow developers.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Showcase your expertise through articles and tutorials.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Share insights and tips with a global audience.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Promote your content on social channels with one click.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Empower others by sharing your knowledge.</span>
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/learn">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">Explore Learn Platform</Button>
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="absolute inset-0 bg-purple-900/30 blur-xl rounded-2xl"></div>
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Content Creation"
              width={600}
              height={400}
              className="relative rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-900/30 blur-xl rounded-2xl"></div>
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Collaboration"
              width={600}
              height={400}
              className="relative rounded-lg shadow-2xl"
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-500 mb-4">
              Collaborate with the Developer Community for Feedback, Support, and Growth
            </h2>
            <p className="text-gray-400 mb-6">
              Become part of a dynamic community where collaboration sparks creativity and advancement.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-purple-500/20 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <span>Share ideas and get feedback to refine your projects.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-purple-500/20 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <span>Join discussions that boost your skills and knowledge.</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-purple-500/20 p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-purple-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </div>
                <span>Exchange insights through comments and peer reviews.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-16 text-center">
        <h2 className="text-xl text-gray-400 mb-4">Code, Collaborate, and Create Together</h2>
        <h3 className="text-3xl md:text-4xl font-bold text-purple-500 mb-8 max-w-3xl mx-auto">
          Join a community where coders innovate, collaborate, and bring ideas to life!
        </h3>
        <Button className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-6 rounded-full">Register</Button>
      </section>

      {/* Footer */}
      <footer className="container mx-auto py-12 border-t border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ACME</h3>
          </div>
          <div>
            <h4 className="font-medium mb-4">First column</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  First page
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Second page
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Third
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Fourth
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Second</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Fifth page
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Sixth page
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Eighth
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Third</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Fifth page
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Sixth page
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Eighth
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12">
          <h4 className="font-medium mb-4">Subscribe</h4>
          <div className="flex gap-2">
            <Input type="email" placeholder="Your email" className="bg-gray-800 border-gray-700 text-white" />
            <Button className="bg-purple-600 hover:bg-purple-700">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">Join our newsletter to stay up to date on features and releases.</p>
        </div>
      </footer>
    </div>
  )
}

