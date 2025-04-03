const simpleGit = require("simple-git");

async function resolveConflicts(repoPath) {
  const git = simpleGit(repoPath);

  try {
    // Try auto-merging
    await git.pull("--rebase");
    console.log("Merge successful, no conflicts.");
  } catch (error) {
    console.log("Merge conflict detected. Attempting to resolve...");

    // If conflicts exist, resolve by choosing "theirs"
    await git.raw(["checkout", "--theirs", "."]);
    await git.add("./*");
    await git.commit("Resolved merge conflict (chose theirs)");
    console.log("Conflict resolved.");
  }
}

module.exports = { resolveConflicts };
