const simpleGit = require("simple-git");

async function createRepo(repoPath) {
  const git = simpleGit(repoPath);
  await git.init();
}

async function commitChanges(repoPath, commitMessage) {
  const git = simpleGit(repoPath);
  try {
    await git.add("./*");
    await git.commit(commitMessage);
  } catch (error) {
    console.error("Failed to commit changes:", error);
    throw new Error("Commit failed.");
  }
}

async function pushChanges(repoPath, remote, branch) {
  const git = simpleGit(repoPath);
  await git.push(remote, branch);
}

module.exports = { createRepo, commitChanges, pushChanges };
