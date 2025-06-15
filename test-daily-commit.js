// Test script to force a daily commit (for testing purposes)
import fs from "fs/promises";
import path from "path";
import simpleGit from "simple-git";
import moment from "moment";
import random from "random";

const git = simpleGit();
const dataPath = path.resolve("./data.json");

function getTodaysRandomTime() {
  const hour = random.int(8, 22);
  const minute = random.int(0, 59);
  const second = random.int(0, 59);
  return moment().set({ hour, minute, second }).format("YYYY-MM-DDTHH:mm:ss");
}

async function writeCommitData(data) {
  let existing = [];
  try {
    const file = await fs.readFile(dataPath, "utf-8");
    existing = JSON.parse(file);
  } catch (e) {}
  existing.push(data);
  await fs.writeFile(dataPath, JSON.stringify(existing, null, 2));
}

async function makeDailyCommit(message, date) {
  const commitContent = `TEST: Daily automated commit - ${moment().format(
    "YYYY-MM-DD"
  )}\nTimestamp: ${date}\nTest run: ${Math.random()}`;
  await fs.writeFile("dummy.txt", commitContent + "\n", { flag: "a" });
  await git.add(".");
  await git.commit(message, undefined, { "--date": date });
}

// Force generate one test commit
async function generateTestCommit() {
  console.log("Generating test commit...");
  const date = getTodaysRandomTime();
  const message = `Test daily contribution - ${moment().format("HH:mm")}`;

  await makeDailyCommit(message, date);
  await writeCommitData({
    type: "test",
    date: date,
    message: message,
  });

  console.log(`Created test commit: ${message} at ${date}`);
  console.log("Test commit completed! Check your git log.");
}

generateTestCommit();
