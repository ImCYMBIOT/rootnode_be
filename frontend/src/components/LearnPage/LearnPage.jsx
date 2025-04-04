import { useState } from "react";
import Button from "../Button/Button";

const LearnPage = () => {
	const [selectedCategory, setSelectedCategory] = useState("Home");
	const [showForm, setShowForm] = useState(false);
	const [newContent, setNewContent] = useState({
		type: "Article",
		title: "",
		author: "",
		description: "",
		videoFile: null, // new for video file upload
	});

	// Sample video content
	const sampleVideos = [
		{
			type: "Video",
			title: "React for Beginners",
			author: "John Doe",
			description: "Start building with React in under 20 minutes.",
		},
		{
			type: "Video",
			title: "JavaScript Deep Dive",
			author: "Jane Smith",
			description: "Master closures, scopes, and the event loop.",
		},
	];

	// Sample article content
	const sampleArticles = [
		{
			type: "Article",
			title: "Demystifying Promises in JS",
			author: "Alex Green",
			description: "Understand how async code works with promises.",
		},
		{
			type: "Article",
			title: "CSS Flexbox vs Grid",
			author: "Sarah Blue",
			description: "Learn when to use Flexbox and when to use Grid.",
		},
	];

	const allContent = [...sampleArticles, ...sampleVideos];

	let filteredContent = [];
	if (selectedCategory === "Home") filteredContent = allContent;
	if (selectedCategory === "Videos") filteredContent = sampleVideos;
	if (selectedCategory === "Articles") filteredContent = sampleArticles;

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewContent({ ...newContent, [name]: value });
	};

	const handleFileChange = (e) => {
		setNewContent({ ...newContent, videoFile: e.target.files[0] });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Submitted content:", newContent);
		if (newContent.type === "Video" && newContent.videoFile) {
			console.log("Video file to upload:", newContent.videoFile.name);
		}
		// Reset
		setNewContent({
			type: "Article",
			title: "",
			author: "",
			description: "",
			videoFile: null,
		});
		setShowForm(false);
	};

	return (
		<div className="min-h-screen bg-[#121212] text-white">
			{/* Navbar */}
			<nav className="flex items-center justify-center bg-gray-900 p-4">
				<div className="flex space-x-2">
					<input
						type="text"
						placeholder="Search for technologies..."
						className="w-96 rounded bg-white p-2 text-purple-500 focus:outline-none"
					/>
					<Button text={"Search"} />
				</div>
			</nav>

			{/* Tabs */}
			<div className="mt-6 mb-4 flex w-full justify-center space-x-4 overflow-x-auto">
				{["Home", "Videos", "Articles", "Create"].map((category) => (
					<button
						key={category}
						onClick={() => {
							setSelectedCategory(category);
							if (category === "Create") setShowForm(true);
							else setShowForm(false);
						}}
						className={`${
							selectedCategory === category
								? "bg-purple-700"
								: "bg-purple-500 hover:bg-purple-600"
						} rounded p-2 text-white shadow-md transition duration-300`}
					>
						{category}
					</button>
				))}
			</div>

			{/* Create Section */}
			{selectedCategory === "Create" && showForm && (
				<div className="mx-auto max-w-lg rounded-lg bg-gray-800 p-6 shadow-md mb-10">
					<h2 className="mb-4 text-2xl font-bold text-purple-400">Create New Content</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<select
							name="type"
							value={newContent.type}
							onChange={handleInputChange}
							className={`w-full rounded p-2 text-white focus:outline-none focus:ring-2 ${
								newContent.type === "Article" ? "bg-[#6B21A8]" : "bg-[#9333EA]"
							}`}
						>
							<option value="Article" className="bg-[#6B21A8] text-white">
								Article
							</option>
							<option value="Video" className="bg-[#9333EA] text-white">
								Video
							</option>
						</select>

						<input
							type="text"
							name="title"
							value={newContent.title}
							onChange={handleInputChange}
							placeholder="Title"
							className="w-full rounded bg-gray-700 p-2 text-white"
							required
						/>

						<input
							type="text"
							name="author"
							value={newContent.author}
							onChange={handleInputChange}
							placeholder="Author"
							className="w-full rounded bg-gray-700 p-2 text-white"
							required
						/>

						<textarea
							name="description"
							value={newContent.description}
							onChange={handleInputChange}
							placeholder="Description"
							className="w-full rounded bg-gray-700 p-2 text-white"
							required
						/>

						{newContent.type === "Video" && (
							<input
								type="file"
								accept="video/*"
								onChange={handleFileChange}
								className="w-full rounded bg-gray-700 p-2 text-white"
								required
							/>
						)}

						<button
							type="submit"
							className="w-full rounded bg-purple-600 p-2 text-white hover:bg-purple-700 transition duration-300"
						>
							Submit
						</button>
					</form>
				</div>
			)}

			{/* Content Display (not shown in Create section) */}
			{selectedCategory !== "Create" && (
				<div className="mt-6 max-w-4xl mx-auto px-4">
					{filteredContent.length === 0 ? (
						<p className="text-center text-gray-400">No content available.</p>
					) : (
						filteredContent.map((item, index) => (
							<div key={index} className="mb-4 rounded-lg bg-gray-800 p-4 shadow-md">
								<h3 className="text-lg font-bold text-purple-400">{item.title}</h3>
								<p className="text-sm text-gray-300">By {item.author}</p>
								<p className="mt-2 text-gray-200">{item.description}</p>
								{item.type === "Video" && item.url && (
									<a
										href={item.url}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-2 inline-block text-purple-500 hover:text-purple-300"
									>
										Watch Video
									</a>
								)}
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default LearnPage;
