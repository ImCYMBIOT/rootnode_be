import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Archives = () => {
	const navigate = useNavigate();

	const user = JSON.parse(localStorage.getItem("user"));
	const userId = user?.uuid;

	const [repos, setRepos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [notFound, setNotFound] = useState(false);

	const [showModal, setShowModal] = useState(false);
	const [repoName, setRepoName] = useState("");
	const [description, setdescription] = useState("");
	const [createError, setCreateError] = useState(null);

	const fetchArchivesByUserID = async () => {
		if (!userId) return;

		try {
			const response = await fetch(
				`http://localhost:3000/repo/user/${userId}/repos`,
			);

			if (response.status === 404) {
				setNotFound(true);
				setRepos([]);
			} else if (!response.ok) {
				throw new Error("Failed to fetch repositories");
			} else {
				const data = await response.json();
				setRepos(data);
				setNotFound(false);
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchArchivesByUserID();
	}, []);

	const handleCreateRepo = async () => {
		if (!repoName.trim()) return;

		try {
			const response = await fetch("http://localhost:3000/repo/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					repoName,
					description,
					uuid: userId,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Error creating repository");
			}

			setShowModal(false);
			setRepoName("");
			setdescription("");
			setCreateError(null);
			fetchArchivesByUserID(); // Refresh list
		} catch (err) {
			setCreateError(err.message);
		}
	};

	const renderAllArchives = () => {
		if (loading) return <p>Loading archives...</p>;
		if (error) return <p className="text-red-600">Error: {error}</p>;

		if (notFound || repos.length === 0) {
			return (
				<div className="flex h-[60vh] flex-col items-center justify-center text-white">
					<p className="mb-4 text-xl">
						No code archives found. Create some!
					</p>
				</div>
			);
		}

		return (
			<ul className="space-y-2">
				{repos.map((repo) => (
					<li
						key={repo._id}
						className="rounded border p-3 text-white shadow"
					>
            {console.log(repo)}
						<h3 className="text-lg font-bold">{repo.name}</h3>
						<p>{repo.description || "No description."}</p>
					</li>
				))}
			</ul>
		);
	};

	return (
		<div className="min-h-[83.5vh] bg-background p-6">
			<h1 className="mb-4 text-center text-5xl font-bold text-white">
				Archives
			</h1>

			<div className="mb-10 mt-4 flex justify-center">
				<button
					onClick={() => setShowModal(true)}
					className="rounded bg-light-purple px-6 py-3 font-semibold text-white hover:bg-bright-purple"
				>
					Create Archive
				</button>
			</div>

			{renderAllArchives()}

			{showModal && (
				<div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
					<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
						<h2 className="mb-4 text-xl font-bold">
							Create New Repository
						</h2>

						{createError && (
							<p className="text-red-500 mb-2">{createError}</p>
						)}

						<input
							type="text"
							placeholder="Archive Name"
							value={repoName}
							onChange={(e) => setRepoName(e.target.value)}
							className="mb-4 w-full rounded border px-3 py-2"
						/>

						<textarea
							placeholder="Archive Description"
							value={description}
							onChange={(e) => setdescription(e.target.value)}
							className="mb-4 w-full rounded border px-3 py-2"
						/>

						<div className="flex justify-end gap-2">
							<button
								onClick={() => {
									setShowModal(false);
									setCreateError(null);
									setRepoName("");
									setdescription("");
								}}
								className="bg-gray-300 hover:bg-gray-400 rounded px-4 py-2"
							>
								Cancel
							</button>

							<button
								onClick={handleCreateRepo}
								className="rounded bg-light-purple px-4 py-2 text-white hover:bg-bright-purple"
							>
								Create
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Archives;
