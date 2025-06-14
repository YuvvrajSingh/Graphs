// Entry point for automating GitHub contribution art
import fs from "fs/promises";
import path from "path";
import simpleGit from "simple-git";
import moment from "moment";
import random from "random";

const git = simpleGit();
const dataPath = path.resolve("./data.json");

// Generate a timestamp in GitHub's format
function getGitHubDate(offsetDays = 0) {
  return moment().subtract(offsetDays, "days").format("YYYY-MM-DDTHH:mm:ss");
}

// Write commit data to JSON file
async function writeCommitData(data) {
  let existing = [];
  try {
    const file = await fs.readFile(dataPath, "utf-8");
    existing = JSON.parse(file);
  } catch (e) {}
  existing.push(data);
  await fs.writeFile(dataPath, JSON.stringify(existing, null, 2));
}

// Make a commit with a specific date
async function makeCommit(message, date) {
  await fs.writeFile("dummy.txt", `${message} @ ${date}\n`, { flag: "a" });
  await git.add(".");
  await git.commit(message, undefined, { "--date": date });
}

// Example: batch commits for a week (X axis) and days (Y axis)
async function commitArt(xWeeks = 1, yDays = 7) {
  for (let x = 0; x < xWeeks; x++) {
    for (let y = 0; y < yDays; y++) {
      const offset = x * 7 + y;
      const date = getGitHubDate(offset);
      await makeCommit(`Art commit (${x},${y})`, date);
      await writeCommitData({ x, y, date });
    }
  }
  await git.push();
}

// Run the art commit generator
commitArt(2, 7); // Example: 2 weeks, 7 days
