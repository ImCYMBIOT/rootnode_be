import React from "react";
import { useParams } from "react-router-dom";

const ContributePage = () => {
	const { id } = useParams();
	return <div>ContributePage {id}</div>;
};

export default ContributePage;
