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
		file: null,
	});

	// Sample Videos
	const sampleVideos = [
		{
			type: "Video",
			title: "Intro to React",
			author: "John Doe",
			description: "Build dynamic UIs using React.",
		},
		{
			type: "Video",
			title: "JS in Depth",
			author: "Jane Doe",
			description: "Explore JavaScript concepts like async and closures.",
		},
	];

	// Sample Articles
	const sampleArticles = [
		{
			type: "Article",
			title: "Understanding CSS Grid",
			author: "Emily Zhang",
			description: "Build complex layouts using grid.",
		},
		{
			type: "Article",
			title: "Node.js Crash Course",
			author: "Michael Scott",
			description: "Learn backend fundamentals with Node.",
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
		setNewContent({ ...newContent, file: e.target.files[0] });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Submitted content:", newContent);
		if (newContent.file) {
			console.log("Uploaded file:", newContent.file.name);
		}
		setNewContent({
			type: "Article",
			title: "",
			author: "",
			description: "",
			file: null,
		});
		setShowForm(false);
	};

	return (
		<div className="min-h-screen bg-background text-white">
			{/* Navbar */}
			<nav className="bg-gray-900 flex items-center justify-center p-4">
				<div className="flex space-x-2">
					<input
						type="text"
						placeholder="Search for technologies..."
						className="text-purple-500 w-96 rounded bg-white p-2 focus:outline-none"
					/>
					<Button text={"Search"} />
				</div>
			</nav>

			{/* Tabs */}
			<div className="mb-4 mt-6 flex w-full justify-center space-x-4 overflow-x-auto">
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
				<div className="bg-gray-800 mx-auto mb-10 max-w-lg rounded-lg p-6 shadow-md">
					<h2 className="text-blue-400 mb-4 text-2xl font-bold">
						Create New Content
					</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<select
							name="type"
							value={newContent.type}
							onChange={handleInputChange}
							className={`w-full rounded p-2 text-white focus:outline-none focus:ring-2 ${
								newContent.type === "Article"
									? "bg-[#6B21A8]"
									: "bg-[#9333EA]"
							}`}
						>
							<option
								value="Article"
								className="text-purple-100 bg-[#6B21A8]"
							>
								Article
							</option>
							<option
								value="Video"
								className="text-purple-100 bg-[#9333EA]"
							>
								Video
							</option>
						</select>

						<input
							type="text"
							name="title"
							value={newContent.title}
							onChange={handleInputChange}
							placeholder="Title"
							className="text-purple-200 placeholder-purple-400 w-full rounded bg-[#1F1B24] p-2"
							required
						/>

						<input
							type="text"
							name="author"
							value={newContent.author}
							onChange={handleInputChange}
							placeholder="Author"
							className="text-purple-200 placeholder-purple-400 w-full rounded bg-[#1F1B24] p-2"
							required
						/>

						<textarea
							name="description"
							value={newContent.description}
							onChange={handleInputChange}
							placeholder="Description"
							className="text-purple-200 placeholder-purple-400 w-full rounded bg-[#1F1B24] p-2"
							required
						/>

						{newContent.type === "Video" ? (
							<input
								type="file"
								accept="video/*"
								onChange={handleFileChange}
								className="bg-gray-700 text-purple-200 w-full rounded p-2"
								required
							/>
						) : (
							<input
								type="file"
								accept=".pdf,.doc,.docx"
								onChange={handleFileChange}
								className="bg-gray-700 text-purple-200 w-full rounded p-2"
								required
							/>
						)}

						<button
							type="submit"
							className="bg-purple-600 hover:bg-purple-700 w-full rounded p-2 text-white transition duration-300"
						>
							Submit
						</button>
					</form>
				</div>
			)}

			{/* Content Display */}
			{selectedCategory !== "Create" && (
				<div className="mx-auto mt-6 max-w-4xl px-4">
					{filteredContent.length === 0 ? (
						<p className="text-gray-400 text-center">
							No content available.
						</p>
					) : (
						filteredContent.map((item, index) => (
							<div
								key={index}
								className="bg-gray-800 mb-4 rounded-lg p-4 shadow-md"
							>
								<h3 className="text-purple-400 text-lg font-bold">
									{item.title}
								</h3>
								<p className="text-gray-300 text-sm">
									By {item.author}
								</p>
								<p className="text-gray-200 mt-2">
									{item.description}
								</p>
							</div>
						))
					)}
				</div>
			)}
		</div>
	);
};

export default LearnPage;
