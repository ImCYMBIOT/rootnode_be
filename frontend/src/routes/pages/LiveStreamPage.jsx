import React from "react";
import { useParams } from "react-router-dom";
import RepoViewer from "@/components/streams/RepoViewer";

const LiveStreamPage = () => {
	const { id } = useParams();

	return (
		<div className="h-screen w-full">
			<RepoViewer streamId={id} />
		</div>
	);
};

export default LiveStreamPage;
