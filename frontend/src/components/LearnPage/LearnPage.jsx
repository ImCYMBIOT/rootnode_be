import { useState, useEffect } from "react";
import Button from "../Button/Button";
import ReactPlayer from "react-player";

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

	const [videos, setVideos] = useState([]);
	const [articles, setArticles] = useState([]);
	const [displayCount, setDisplayCount] = useState(9);

	useEffect(() => {
		fetch("http://localhost:3000/learn/videos")
			.then((res) => res.json())
			.then((data) => setVideos(data))
			.catch((err) => console.error("Error fetching videos:", err));

		fetch("http://localhost:3000/learn/articles")
			.then((res) => res.json())
			.then((data) => setArticles(data))
			.catch((err) => console.error("Error fetching articles:", err));
	}, []);

	let filteredContent = [];

	if (selectedCategory === "Home") {
		const maxItems = 9;
		const half = Math.floor(maxItems / 2);

		let displayArticles = articles.slice(0, half);
		let displayVideos = videos.slice(0, maxItems - displayArticles.length);

		if (displayArticles.length < half) {
			displayVideos = videos.slice(0, maxItems - displayArticles.length);
		}
		if (displayVideos.length < maxItems - half) {
			displayArticles = articles.slice(
				0,
				maxItems - displayVideos.length,
			);
		}

		filteredContent = [...displayArticles, ...displayVideos];
	} else if (selectedCategory === "Videos") {
		filteredContent = videos.slice(0, displayCount);
	} else if (selectedCategory === "Articles") {
		filteredContent = articles.slice(0, displayCount);
	}

	const isAllContentLoaded =
		(selectedCategory === "Home" && articles.length + videos.length <= 9) ||
		(selectedCategory === "Videos" && videos.length <= displayCount) ||
		(selectedCategory === "Articles" && articles.length <= displayCount);

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

	const handleLoadMore = () => {
		setDisplayCount(displayCount + 9);
	};

	return (
		<div className="min-h-screen bg-background text-white">
			<nav className="bg-gray-900 flex items-center justify-center p-4">
				<div className="flex space-x-2">
					<input
						type="text"
						placeholder="Search for technologies..."
						className="text-purple-300 w-96 rounded bg-[#1F1B24] p-2 focus:outline-none"
					/>
					<Button text={"Search"} />
				</div>
			</nav>

			<div className="mb-4 mt-6 flex w-full justify-center space-x-4 overflow-x-auto">
				{["Home", "Videos", "Articles", "Create"].map((category) => (
					<button
						key={category}
						onClick={() => {
							setSelectedCategory(category);
							if (category === "Create") setShowForm(true);
							else setShowForm(false);
							setDisplayCount(9);
						}}
						className={`$ { selectedCategory === category ? "bg-purple-700" : "bg-purple-500 hover:bg-purple-600" } rounded p-2 text-white shadow-md transition duration-300`}
					>
						{category}
					</button>
				))}
			</div>

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
							className={`$ { newContent.type === "Article" ? bg-[#551e98] } w-full rounded p-2 text-white focus:outline-none focus:ring-2`}
						>
							<option value="Article">Article</option>
							<option value="Video">Video</option>
						</select>

						<input
							type="text"
							name="title"
							value={newContent.title}
							onChange={handleInputChange}
							placeholder="Title"
							className="text-purple-200 placeholder-purple-400 w-full rounded bg-[#551e98] p-2"
							required
						/>

						<input
							type="text"
							name="author"
							value={newContent.author}
							onChange={handleInputChange}
							placeholder="Author"
							className="text-purple-200 placeholder-purple-400 w-full rounded bg-[#551e98] p-2"
							required
						/>

						<textarea
							name="description"
							value={newContent.description}
							onChange={handleInputChange}
							placeholder="Description"
							className="text-purple-200 placeholder-purple-400 w-full rounded bg-[#551e98] p-2"
							required
						/>

						<input
							type="file"
							accept={
								newContent.type === "Video"
									? "video/*"
									: ".pdf,.doc,.docx"
							}
							onChange={handleFileChange}
							className="bg-gray-700 text-purple-200 w-full rounded p-2"
							required
						/>

						<button
							type="submit"
							className="bg-purple-600 hover:bg-purple-700 w-full rounded p-2 text-white transition duration-300"
						>
							Submit
						</button>
					</form>
				</div>
			)}

			{selectedCategory !== "Create" && (
				<div className="min-h-screen w-full px-8 py-6">
					{filteredContent.length === 0 ? (
						<p className="text-gray-400 w-full text-center">
							No content available.
						</p>
					) : (
						<div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
							{filteredContent.map((item, index) => (
								<div
									key={index}
									className="flex min-h-[400px] flex-col justify-between rounded-xl bg-gradient-to-br from-[#4c1d95] to-[#6b21a8] p-4 shadow-xl transition-transform duration-300 hover:scale-105"
								>
									<h3 className="text-purple-300 mb-2 text-xl font-semibold">
										{item.title}
									</h3>
									<p className="text-gray-300 mb-1 text-lg">
										By {item.author}
									</p>
									<p className="text-gray-100 mb-2 text-lg">
										{item.description}
									</p>

									{item.type === "Article" &&
										item.filepath && (
											<a
												href={`/${item.filepath}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-400 text-lg underline"
											>
												Read Article
											</a>
										)}

									{item.type === "Video" && item.filepath && (
										<div className="mt-3 aspect-video w-full overflow-hidden rounded-lg">
											<ReactPlayer
												url={`http://localhost:3000/${item.filepath}`}
												controls
												width="100%"
												height="100%"
												config={{
													file: {
														attributes: {
															controlsList:
																"nodownload",
														},
													},
												}}
											/>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default LearnPage;
