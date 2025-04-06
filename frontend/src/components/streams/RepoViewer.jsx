import React, { useState, useEffect } from "react";
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

export default function Repoviewer({ uuid, repoId }) {
	const [fileContent, setFileContent] = useState("");
	const [filePath, setFilePath] = useState("");
	const [fileTree, setFileTree] = useState(null);

	useEffect(() => {
		if (!uuid || !repoId) return;

		fetch(`http://localhost:3000/file-tree/${uuid}/${repoId}`)
			.then((res) => res.json())
			.then((data) => setFileTree(data))
			.catch((err) => console.error("Failed to load repo tree", err));
	}, [uuid, repoId]);

	const handleFileSelect = (relativePath) => {
		setFilePath(relativePath);
		fetch(
			`http://localhost:3000/fs/${uuid}/${repoId}/read-file?relativePath=${encodeURIComponent(
				relativePath,
			)}`,
		)
			.then((res) => res.json())
			.then((data) => setFileContent(data.content))
			.catch((err) => console.error("Failed to load file content", err));
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
					options={{ readOnly: false, fontSize: 14 }}
				/>
			</div>
		</div>
	);
}
