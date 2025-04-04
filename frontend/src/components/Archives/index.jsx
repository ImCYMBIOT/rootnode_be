import React from "react";
import { useParams } from "react-router-dom";

const Archives = () => {
  const { id } = useParams();

  const renderAllArchives = () => {
    return <>All Archives</>;
  };

  const renderArchiveById = (id) => {
    return <>Archive by ID: {id}</>;
  };

  return (
    <div>
      <h1>Archives</h1>
      {id ? renderArchiveById(id) : renderAllArchives()}
    </div>
  );
};

export default Archives;
