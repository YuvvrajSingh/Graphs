# Graphs

This project automates commits to create custom art on your GitHub contribution graph by making commits with historical dates and provides daily automated commits for ongoing contributions.

## Features
- Automates commits with custom timestamps
- Generates art on the GitHub profile contribution graph  
- **NEW**: Daily automated commits starting from today
- Uses a JSON file to store commit data
- ES modules, async file operations, and batching for efficiency
- Windows Task Scheduler integration for automation

## Usage

### Historical Commits (Original Feature)
1. Install dependencies: `npm install`
2. Run the historical commit generator: `npm start`

### Daily Automated Commits (New Feature)
1. **Manual daily commit**: `npm run daily`
2. **Automated daily commits**: `npm run setup` (Run as Administrator)

## Automated Setup Instructions

1. **Open PowerShell as Administrator**
2. **Navigate to the project folder**
3. **Run the setup**: `npm run setup`

This will:
- Create a Windows Task Scheduler task
- Schedule daily commits at 2:00 PM, 6:00 PM, and 10:00 PM
- Generate 1-3 random commits per day with realistic timestamps
- Automatically push commits to your GitHub repository

## Files Created for Daily Automation
- `daily-commit.js` - Main daily commit script
- `daily-commit-scheduler.ps1` - PowerShell script for Task Scheduler
- `setup-scheduler.ps1` - Automated setup script
- `run-daily-commit.bat` - Manual batch file runner
- `daily-commits.log` - Log file for daily commit operations
- `scheduler.log` - Log file for scheduled task operations

## Customization
- Modify commit times in `setup-scheduler.ps1`
- Adjust number of daily commits in `daily-commit.js` 
- Change commit messages and content as needed

---

See `implement.md` for the full feature list.
