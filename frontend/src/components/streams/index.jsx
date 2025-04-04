import React from "react";
import AllStreams from "./AllStreams";
import { useParams } from "react-router-dom";


const Stream = () => {
	const {id} = useParams;
	console.log(id)
	return (
		<div>
			<h1>Streams</h1>
			{id ? "Starting your stream" :  <AllStreams />}
		</div>
	);
};

export default Stream;
