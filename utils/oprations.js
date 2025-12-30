const { time } = require("console");
const fs = require("fs-extra");
const path = require("path");
const userFilePath = path.join(__dirname, "../data/users.json");
const projectFilePath = path.join(__dirname, "../data/projects.json");
const timeEntryFilePath = path.join(__dirname, "../data/timeEntries.json");
const sessionFilePath = path.join(__dirname, "../data/session.json");
const summaryByTimeEntryFilePath = path.join(
  __dirname,
  "../data/summary/summaryByTimeEntry.json"
);
fs.ensureFileSync(userFilePath);
if (fs.readFileSync(userFilePath, "utf8") === "") {
  fs.writeFileSync(userFilePath, JSON.stringify([], null, 2));
}

fs.ensureFileSync(projectFilePath);
if (fs.readFileSync(projectFilePath, "utf8") === "") {
  fs.writeFileSync(projectFilePath, JSON.stringify([], null, 2));
}

fs.ensureFileSync(timeEntryFilePath);
if (fs.readFileSync(timeEntryFilePath, "utf8") === "") {
  fs.writeFileSync(timeEntryFilePath, JSON.stringify([], null, 2));
}

fs.ensureFileSync(sessionFilePath);
if (fs.readFileSync(sessionFilePath, "utf8") === "") {
  fs.writeFileSync(sessionFilePath, JSON.stringify([], null, 2));
}

fs.ensureFileSync(summaryByTimeEntryFilePath);
if (fs.readFileSync(summaryByTimeEntryFilePath, "utf8") === "") {
  fs.writeFileSync(summaryByTimeEntryFilePath, JSON.stringify([], null, 2));
}
const readData = (file) => {
  try {
    return fs.readJSONSync(file);
  } catch (error) {
    return [];
  }
};
const writeData = (file, data) => {
  fs.writeJsonSync(file, data, { spaces: 2 });
};

const getUsers = () => readData(userFilePath);
const saveUser = (data) => writeData(userFilePath, data);

const getProjects = () => readData(projectFilePath);
const saveProject = (data) => writeData(projectFilePath, data);

const getTimeEntries = () => readData(timeEntryFilePath);
const saveTimeEntry = (data) => writeData(timeEntryFilePath, data);

const getSessions = () => readData(sessionFilePath);
const saveSession = (data) => writeData(sessionFilePath, data);

const getSummaryByTimeEntry = () => readData(summaryByTimeEntryFilePath);
const saveSummaryByTimeEntry = (data) =>
  writeData(summaryByTimeEntryFilePath, data);

const getDate = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  return `${dd}/${mm}/${yyyy}`;
};

function getDateDifference(startISO, endISO) {
  const startDate = new Date(startISO);
  const endDate = new Date(endISO);

  if (isNaN(startDate) || isNaN(endDate)) {
    throw new Error("Invalid ISO date string provided");
  }

  const diffMs = Math.abs(endDate - startDate); // milliseconds difference

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  return {
    days, // inclusive day count
    hours, // remaining hours after days
    minutes, // remaining minutes after hours
    totalHours, // full duration in hours
    totalMinutes, // full duration in minutes
  };
}
function convertMinutes(totalMinutes) {
  if (typeof totalMinutes !== "number" || totalMinutes < 0) {
    throw new Error("Total minutes must be a non-negative number");
  }

  const MINUTES_IN_DAY = 24 * 60;

  const days = Math.floor(totalMinutes / MINUTES_IN_DAY);
  const remainingAfterDays = totalMinutes % MINUTES_IN_DAY;

  const hours = Math.floor(remainingAfterDays / 60);
  const minutes = remainingAfterDays % 60;

  return {
    days,
    hours,
    minutes,
  };
} // Outputs something like "2025-12-25T10:30:45.123Z"
module.exports = {
  readData,
  writeData,
  getUsers,
  saveUser,
  getProjects,
  saveProject,
  getTimeEntries,
  saveTimeEntry,
  getDate,
  getSessions,
  saveSession,
  getDateDifference,
  getSummaryByTimeEntry,
  saveSummaryByTimeEntry,
  convertMinutes,
};
