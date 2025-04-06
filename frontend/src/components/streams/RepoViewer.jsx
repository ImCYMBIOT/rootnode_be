import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react"; // ✅ Fixed import

const mockFiles = {
	src: {
		"App.js": "// App.js content",
		"index.js": "// index.js content",
	},
	public: {
		"index.html": "<!-- index.html content -->",
	},
	"README.md": "# Project README",
};

function FileExplorer({ files, onFileSelect }) {
	const renderTree = (node, path = "") => {
		return Object.entries(node).map(([name, value]) => {
			const currentPath = path ? `${path}/${name}` : name;
			if (typeof value === "string") {
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

export default function StreamingEditor() {
	const [fileContent, setFileContent] = useState("");
	const [filePath, setFilePath] = useState("");

	const handleFileSelect = (path) => {
		const parts = path.split("/");
		let content = mockFiles;
		for (let part of parts) {
			content = content[part];
		}
		setFileContent(content);
		setFilePath(path);
	};

	return (
		<div className="flex h-screen">
			<div className="w-1/4 border-r">
				<FileExplorer
					files={mockFiles}
					onFileSelect={handleFileSelect}
				/>
			</div>
			<div className="w-3/4">
				<div className="flex items-center justify-between border-b p-2">
					<span className="font-mono text-sm">
						{filePath || "No file selected"}
					</span>
				</div>
				<Editor
					height="calc(100% - 40px)"
					language="javascript"
					value={fileContent}
					options={{ readOnly: false, fontSize: 14 }}
				/>
			</div>
		</div>
	);
}
