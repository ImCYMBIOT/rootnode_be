import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Archives = () => {
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.uuid;
  const userName = user?.name;

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArchivesByUserID = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/user/${userId}/repos`);
      if (!response.ok) throw new Error("Failed to fetch repositories");
      console.log(response)
      const data = await response.json();
      setRepos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivesByUserID();
  }, []);

  const renderAllArchives = () => {
    if (loading) return <p>Loading archives...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;
    if (repos.length === 0) return <p>No archives found for {userName}.</p>;

    return (
      <ul className="space-y-2">
        {repos.map((repo) => (
          <li key={repo._id} className="rounded border p-3 shadow">
            <h3 className="text-lg font-bold">{repo.name}</h3>
            <p>{repo.description || "No description."}</p>
          </li>
        ))}
      </ul>
    );
  };

  const renderArchiveById = (id) => {
    const repo = repos.find((r) => r._id === id);
    if (!repo) return <p>No archive found with ID: {id}</p>;

    return (
      <div className="rounded border p-3 shadow">
        <h3 className="text-xl font-bold">{repo.name}</h3>
        <p>{repo.description}</p>
        <p className="mt-2 text-sm text-gray-500">UUID: {repo.uuid}</p>
      </div>
    );
  };

  return (
    <div className="p-6 min-h-[83.5vh] bg-background">
      <h1 className="text-5xl text-center text-white font-bold mb-4">Archives</h1>
      {id ? renderArchiveById(id) : renderAllArchives()}
    </div>
  );
};

export default Archives;
