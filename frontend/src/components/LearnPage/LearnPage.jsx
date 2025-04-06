import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import { FaPlus, FaSearch } from "react-icons/fa";

const LearnPage = () => {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [showCreate, setShowCreate] = useState(false);
  const [uploadType, setUploadType] = useState("video");
  const [uploadData, setUploadData] = useState({
    title: "",
    author: "",
    description: "",
    file: null,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchResources = async () => {
    try {
      setLoading(true);
      const [videosRes, articlesRes] = await Promise.all([
        axios.get("http://localhost:3000/learn/videos"),
        axios.get("http://localhost:3000/learn/articles"),
      ]);

      const videos = videosRes.data.map((v) => ({ ...v, type: "Video" }));
      const articles = articlesRes.data.map((a) => ({ ...a, type: "Article" }));

      const allResources = [...videos, ...articles].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setResources(allResources);
      setFilteredResources(allResources);
    } catch (err) {
      setError("Failed to fetch resources");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleFilterChange = (type) => {
    setActiveTab(type);
    setShowCreate(false);

    if (type === "Home") {
      const videos = resources.filter((r) => r.type === "Video");
      const articles = resources.filter((r) => r.type === "Article");

      const shuffledVideos = [...videos].sort(() => 0.5 - Math.random());
      const shuffledArticles = [...articles].sort(() => 0.5 - Math.random());

      const videoCount = 4;
      const articleCount = 5;

      const selectedVideos = shuffledVideos.slice(0, videoCount);
      const selectedArticles = shuffledArticles.slice(0, articleCount);

      const combined = [...selectedVideos, ...selectedArticles]
        .sort(() => 0.5 - Math.random())
        .slice(0, 9); // Just in case

      setFilteredResources(combined);
    } else {
      setFilteredResources(resources.filter((r) => r.type === type));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadData((prev) => ({ ...prev, file }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", uploadData.title);
      formData.append("author", uploadData.author);
      formData.append("description", uploadData.description);
      formData.append(uploadType, uploadData.file);

      await axios.post(
        `http://localhost:3000/learn/${uploadType}s`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadData({
        title: "",
        author: "",
        description: "",
        file: null,
      });
      setUploadType("video");
      setShowCreate(false);
      fetchResources();
    } catch (err) {
      setError("Failed to upload file");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = resources.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
    setFilteredResources(filtered);
    setActiveTab("Search");
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-2 rounded-l-md bg-gray-800 text-white focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-[#8122bc] px-4 py-2 rounded-r-md text-white hover:bg-purple-700"
          >
            <FaSearch />
          </button>
        </div>

        {/* Filter + Create Centered */}
        <div className="flex justify-center flex-wrap gap-4 mb-8">
          {["Home", "Video", "Article"].map((tab) => (
            <div key={tab} className="bg-[#8122bc] p-3 rounded-lg shadow-lg">
              <button
                onClick={() => handleFilterChange(tab)}
                className={`px-5 py-2 rounded font-semibold w-28 ${
                  activeTab === tab && !showCreate
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {tab}
              </button>
            </div>
          ))}

          <div className="bg-gray-800 p-3 rounded-lg shadow-lg">
            <button
              onClick={() => {
                setShowCreate(true);
                setActiveTab("");
              }}
              className="bg-[#8122bc] hover:bg-blue-700 px-5 py-2 rounded w-28 flex justify-center gap-2 text-white"
            >
              <FaPlus /> Create
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreate && (
          <form
            onSubmit={handleSubmit}
            className="bg-[#3c3ca6] p-6 rounded-lg mb-8 max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-4 text-white">
              Create New Content
            </h2>
            <div className="grid gap-4">
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="bg-[#3c3ca6] text-white px-4 py-2 rounded-lg"
              >
                <option value="video">Video</option>
                <option value="article">Article</option>
              </select>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={uploadData.title}
                onChange={handleInputChange}
                className="bg-[#3c3ca6] text-white px-4 py-2 rounded-lg"
                required
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={uploadData.author}
                onChange={handleInputChange}
                className="bg-[#3c3ca6] text-white px-4 py-2 rounded-lg"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={uploadData.description}
                onChange={handleInputChange}
                className="bg-[#3c3ca6] text-white px-4 py-2 rounded-lg"
                required
              />
              <input
                type="file"
                accept={uploadType === "video" ? "video/*" : ".pdf,.doc,.docx"}
                onChange={handleFileChange}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white font-semibold"
              >
                {loading ? "Uploading..." : "Submit"}
              </button>
            </div>
          </form>
        )}

        {/* Error */}
        {error && <div className="bg-red-600 p-4 rounded mb-6">{error}</div>}

        {/* Grid */}
        {!showCreate && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((item) => (
              <div
                key={item._id}
                className="bg-[#3c3ca6] rounded-lg overflow-hidden shadow-md flex flex-col"
              >
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1 text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-2">By {item.author}</p>
                  <p className="text-gray-200 mb-4">{item.description}</p>

                  {item.type === "Video" && (
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <ReactPlayer
                        url={item.videoUrl}
                        controls
                        width="100%"
                        height="100%"
                      />
                    </div>
                  )}

                  {item.type === "Article" && (
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline mt-2 block"
                    >
                      Download Article
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnPage;
  