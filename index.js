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

// Generate a random number of commits for a given day (0-4)
function getRandomCommits() {
  return random.int(0, 4);
}

// Generate a random time for a commit within a day
function getRandomTime(date) {
  const hour = random.int(8, 22); // Working hours
  const minute = random.int(0, 59);
  const second = random.int(0, 59);
  return moment(date)
    .set({ hour, minute, second })
    .format("YYYY-MM-DDTHH:mm:ss");
}

// Generate a legit-looking contribution pattern for the last N weeks
async function commitLegitArt(weeks = 52, daysPerWeek = 7) {
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < daysPerWeek; d++) {
      // Skip some days (simulate weekends/inactivity)
      if (random.float() < 0.2) continue;
      const offset = w * 7 + d;
      const baseDate = moment().subtract(offset, "days");
      const commitsToday = getRandomCommits();
      for (let c = 0; c < commitsToday; c++) {
        const date = getRandomTime(baseDate);
        await makeCommit(`Legit commit (${w},${d},${c})`, date);
        await writeCommitData({ w, d, c, date });
      }
    }
  }
  await git.push();
}

// Run the legit art commit generator for the past year
commitLegitArt(52, 7); // 52 weeks, 7 days per week
