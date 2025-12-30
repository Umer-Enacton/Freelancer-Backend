const {
  getProjects,
  getUsers,
  getTimeEntries,
  saveTimeEntry,
  getDate,
  getDateDifference,
} = require("../utils/oprations");

const getAllTimeEntries = (req, res) => {
  try {
    const timeEntries = getTimeEntries();
    return res.status(200).json({
      success: true,
      message: "All timeEntries",
      timeEntries,
    });
  } catch (error) {
    console.error("JSON parse error:", error);
    return res.status(500).json({ message: "Invalid timeEntries data" });
  }
};
const getTimeEntryById = (req, res) => {
  try {
    const id = req.params.id;
    const timeEntries = getTimeEntries();
    const timeEntry = timeEntries.find((u) => u.id == id);

    if (!timeEntry) {
      return res
        .status(404)
        .json({ success: false, message: "timeEntry not found" });
    }
    return res.status(200).json({
      success: true,
      message: "timeEntry fetched successfully",
      timeEntry,
    });
  } catch (error) {
    console.error("JSON parse error:", error);
    return res.status(500).json({ message: "Invalid timeEntries data" });
  }
};
const addTimeEntry = async (req, res) => {
  try {
    const { userId, projectId } = req.body;
    const users = getUsers();
    const projects = getProjects();
    if (!projectId || !userId) {
      return res.status(401).json({
        success: false,
        message: "Required Field Missing",
      });
    }
    let user = users.find((u) => u.id == userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Id not Found",
      });
    }
    let idx = projects.findIndex((u) => u.id == projectId);
    if (idx == -1) {
      return res.status(404).json({
        success: false,
        message: "Project Id not Found",
      });
    }

    if (projects[idx].userId != user.id) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to add time entry for this project",
      });
    }
    const timeEntries = getTimeEntries();
    const alreadyExists = timeEntries.find(
      (te) => te.userId === user.id && te.projectId === projects[idx].id
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Time entry already exists for this project",
      });
    }
    const newTimeEntry = {
      id: Date.now(),
      userId: user.id,
      projectId: projects[idx].id,
      completed: false,
      date: getDate(),
      createdAt: new Date().toISOString(),
    };
    timeEntries.push(newTimeEntry);
    saveTimeEntry(timeEntries);
    return res.status(201).json({
      success: true,
      message: "timeEntry registered successfully",
      timeEntries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateTimeEntry = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId, projectId } = req.body;
    const users = getUsers();
    const projects = getProjects();
    const timeEntries = getTimeEntries();

    if (!projectId || !userId) {
      return res.status(401).json({
        success: false,
        message: "Required Field Missing",
      });
    }
    const idx = timeEntries.findIndex((u) => u.id == id);
    if (idx == -1) {
      return res
        .status(404)
        .json({ success: false, message: "timeEntry not found" });
    }
    let user = users.find((u) => u.id == userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Id not Found",
      });
    }
    let project = projects.find((u) => u.id == projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project Id not Found",
      });
    }

    // if (timeEntries.find((u) => u.email === req.body.email)) {
    //   return res.status(400).json({ message: "Email is  already exists" });
    // }
    if (
      timeEntries[idx].userId != user.id ||
      timeEntries[idx].projectId != project.id
    ) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to update this timeEntry",
      });
    }
    if (timeEntries[idx].completed == true) {
      return res.status(401).json({
        success: false,
        message: "Project Already Completed not allowed to update",
      });
    }
    timeEntries[idx] = { ...timeEntries[idx], ...req.body };
    saveTimeEntry(timeEntries);
    return res.status(201).json({
      Success: true,
      message: "timeEntry Updated Successfully",
      timeEntry: timeEntries[idx],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

const deleteTimeEntry = (req, res) => {
  try {
    const id = req.params.id;

    const { userId, projectId } = req.body;
    const users = getUsers();
    const projects = getProjects();
    if (!projectId || !userId) {
      return res.status(401).json({
        success: false,
        message: "Required Field Missing",
      });
    }
    const timeEntries = getTimeEntries();
    const idx = timeEntries.findIndex((u) => u.id == id);
    if (idx == -1) {
      return res
        .status(404)
        .json({ success: false, message: "timeEntry not found" });
    }
    let user = users.find((u) => u.id == userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Id not Found",
      });
    }
    let project = projects.find((u) => u.id == projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project Id not Found",
      });
    }

    if (
      timeEntries[idx].userId != user.id ||
      timeEntries[idx].projectId != project.id
    ) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to Delete this timeEntry",
      });
    }
    const timeEntry = timeEntries.filter((u) => u.id != id);

    saveTimeEntry(timeEntry);

    return res.status(200).json(timeEntry);

    // console.log(timeEntries);
    // res.json(timeEntries);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

const completeTimeEntry = async (req, res) => {
  try {
    const id = req.params.id;
    const { userId, projectId } = req.body;
    const users = getUsers();
    const projects = getProjects();
    const timeEntries = getTimeEntries();

    if (!projectId || !userId) {
      return res.status(401).json({
        success: false,
        message: "Required Field Missing",
      });
    }
    const idx = timeEntries.findIndex((u) => u.id == id);
    if (idx == -1) {
      return res
        .status(404)
        .json({ success: false, message: "timeEntry not found" });
    }
    let user = users.find((u) => u.id == userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Id not Found",
      });
    }
    let project = projects.find((u) => u.id == projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project Id not Found",
      });
    }

    // if (timeEntries.find((u) => u.email === req.body.email)) {
    //   return res.status(400).json({ message: "Email is  already exists" });
    // }
    if (
      timeEntries[idx].userId != user.id ||
      timeEntries[idx].projectId != project.id
    ) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to update this timeEntry",
      });
    }
    if (timeEntries[idx].completed == true) {
      return res.status(401).json({
        success: false,
        message: "Project Already Completed not allowed to update",
      });
    }
    timeEntries[idx] = {
      ...timeEntries[idx],
      ...req.body,
      completed: true,
      completedAt: new Date().toISOString(),
      TotalWorkingDays: getDateDifference(
        timeEntries[idx].createdAt,
        new Date().toISOString()
      ),
    };
    saveTimeEntry(timeEntries);
    return res.status(201).json({
      Success: true,
      message: "Project timeEntry compelted Successfully",
      timeEntry: timeEntries[idx],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
module.exports = {
  getAllTimeEntries,
  getTimeEntryById,
  addTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  completeTimeEntry,
};
