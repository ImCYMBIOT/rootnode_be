import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

function FileExplorer({ files, onFileSelect, basePath = "" }) {
	const renderTree = (node, path = "") => {
		return Object.entries(node).map(([name, value]) => {
			const currentPath = path ? `${path}/${name}` : name;
			if (value === "file") {
				return (
					<div
						key={currentPath}
						onClick={() => onFileSelect(currentPath)}
						className="hover:bg-gray-200 cursor-pointer p-1"
					>
						📄 {name}
					</div>
				);
			} else {
				return (
					<div key={currentPath}>
						<div className="p-1 font-bold">📁 {name}</div>
						<div className="pl-4">
							{renderTree(value, currentPath)}
						</div>
					</div>
				);
			}
		});
	};

	return (
		<div className="h-full overflow-y-auto p-2">{renderTree(files)}</div>
	);
}

export default function RepoViewer({ uuid }) {
	const [fileContent, setFileContent] = useState("");
	const [filePath, setFilePath] = useState("");
	const [fileTree, setFileTree] = useState(null);
	const [repoId, setRepoId] = useState(null); // Dynamically fetch repoId
	const saveTimeout = useRef(null);
	const wsRef = useRef(null);

	// Fetch the repoId based on the uuid
	useEffect(() => {
		if (!uuid) return;

		fetch(`http://localhost:3000/repo/user/${uuid}/repos`)
			.then((res) => res.json())
			.then((repos) => {
				if (repos.length > 0) {
					setRepoId(repos[0]._id); // Use the first repo by default
					console.log("✅ Repo ID fetched:", repos[0]._id);
				} else {
					console.error("❌ No repositories found for this user");
				}
			})
			.catch((err) =>
				console.error("❌ Failed to fetch repositories", err),
			);
	}, [uuid]);

	// Fetch the file tree once the repoId is available
	useEffect(() => {
		if (!uuid || !repoId) return;

		// Fetch file tree
		fetch(`http://localhost:3000/files/user/${uuid}/repo/${repoId}`)
			.then((res) => res.json())
			.then((data) => {
				console.log("✅ File tree loaded:", data);
				setFileTree(data);
			})
			.catch((err) => console.error("❌ Failed to load repo tree", err));

		// Setup WebSocket for live updates
		wsRef.current = new WebSocket("ws://localhost:3000");
		wsRef.current.onmessage = (event) => {
			const msg = JSON.parse(event.data);
			if (msg.repoId === repoId) {
				console.log("🔁 Repo update received via WS", msg);
				fetch(`http://localhost:3000/files/user/${uuid}/repo/${repoId}`)
					.then((res) => res.json())
					.then((data) => setFileTree(data))
					.catch((err) =>
						console.error("❌ Failed to refresh tree", err),
					);
			}
		};

		return () => wsRef.current?.close();
	}, [uuid, repoId]);

	const handleFileSelect = (relativePath) => {
		setFilePath(relativePath);
		fetch(
			`http://localhost:3000/files/${repoId}/file-content?filePath=${encodeURIComponent(
				relativePath,
			)}`,
		)
			.then((res) => res.json())
			.then((data) => setFileContent(data.content))
			.catch((err) => console.error("Failed to load file content", err));
	};

	const handleEditorChange = (value) => {
		setFileContent(value);

		if (saveTimeout.current) {
			clearTimeout(saveTimeout.current);
		}

		saveTimeout.current = setTimeout(() => {
			if (!filePath) return;

			fetch(`http://localhost:3000/files/update-file`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					uuid,
					repoId,
					relativePath: filePath,
					content: value,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log("✅ Auto-saved", data);
				})
				.catch((err) => console.error("Failed to auto-save", err));
		}, 250); // Auto-save every 0.25 seconds
	};

	return (
		<div className="flex h-full">
			<div className="border-gray-300 w-1/4 border-r">
				<h2 className="border-b p-2 font-bold">📁 Repo Explorer</h2>
				{fileTree ? (
					<FileExplorer
						files={fileTree}
						onFileSelect={handleFileSelect}
					/>
				) : (
					<p className="p-2">Loading...</p>
				)}
			</div>
			<div className="flex w-3/4 flex-col">
				<div className="bg-gray-100 font-mono border-b p-2 text-sm">
					{filePath || "No file selected"}
				</div>
				<Editor
					height="100%"
					language="javascript"
					value={fileContent}
					onChange={handleEditorChange}
					options={{ readOnly: false, fontSize: 14 }}
				/>
			</div>
		</div>
	);
}
