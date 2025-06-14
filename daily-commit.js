// Daily commit automation script
import fs from "fs/promises";
import path from "path";
import simpleGit from "simple-git";
import moment from "moment";
import random from "random";

const git = simpleGit();
const dataPath = path.resolve("./data.json");
const logPath = path.resolve("./daily-commits.log");

// Generate a timestamp for today with random time
function getTodaysRandomTime() {
  const hour = random.int(8, 22); // Working hours
  const minute = random.int(0, 59);
  const second = random.int(0, 59);
  return moment()
    .set({ hour, minute, second })
    .format("YYYY-MM-DDTHH:mm:ss");
}

// Write commit data to JSON file
async function writeCommitData(data) {
  let existing = [];
  try {
    const file = await fs.readFile(dataPath, "utf-8");
    existing = JSON.parse(file);
  } catch (e) {
    console.log("Creating new data.json file");
  }
  existing.push(data);
  await fs.writeFile(dataPath, JSON.stringify(existing, null, 2));
}

// Write to log file
async function writeLog(message) {
  const timestamp = moment().format("YYYY-MM-DD HH:mm:ss");
  const logEntry = `[${timestamp}] ${message}\n`;
  await fs.writeFile(logPath, logEntry, { flag: "a" });
  console.log(logEntry.trim());
}

// Make a commit with today's date
async function makeDailyCommit(message, date) {
  const commitContent = `Daily automated commit - ${moment().format("YYYY-MM-DD")}\nTimestamp: ${date}\nRandom data: ${Math.random()}`;
  await fs.writeFile("dummy.txt", commitContent + "\n", { flag: "a" });
  await git.add(".");
  await git.commit(message, undefined, { "--date": date });
}

// Check if we already made commits today
async function hasCommitsToday() {
  try {
    const today = moment().format("YYYY-MM-DD");
    const file = await fs.readFile(dataPath, "utf-8");
    const existing = JSON.parse(file);
    return existing.some(entry => entry.date && entry.date.startsWith(today));
  } catch (e) {
    return false;
  }
}

// Generate commits for today
async function generateDailyCommits() {
  try {
    await writeLog("Starting daily commit generation...");
    
    // Check if we already made commits today
    if (await hasCommitsToday()) {
      await writeLog("Commits already made today, skipping...");
      return;
    }

    // Generate 1-3 commits for today with random times
    const commitsToday = random.int(1, 4);
    await writeLog(`Generating ${commitsToday} commits for today`);

    for (let i = 0; i < commitsToday; i++) {
      const date = getTodaysRandomTime();
      const message = `Daily contribution ${i + 1}/${commitsToday}`;
      
      await makeDailyCommit(message, date);
      await writeCommitData({
        type: "daily",
        date: date,
        message: message,
        commitNumber: i + 1,
        totalCommits: commitsToday
      });
      
      await writeLog(`Created commit ${i + 1}/${commitsToday}: ${message}`);
      
      // Small delay between commits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Push to remote
    await writeLog("Pushing commits to remote repository...");
    await git.push();
    await writeLog("Daily commits completed successfully!");

  } catch (error) {
    await writeLog(`Error during daily commit generation: ${error.message}`);
    console.error("Error:", error);
  }
}

// Run the daily commit generation
generateDailyCommits();
