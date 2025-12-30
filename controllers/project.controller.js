
const { getProjects, saveProject, getUsers } = require("../utils/oprations");

const getAllProjects= (req, res) => {
  try {
    const projects = getProjects();
    return res.status(200).json({
      success: true,
      message: "All Projects",
      projects,
    });
  } catch (error) {
    console.error("JSON parse error:", error);
    return res.status(500).json({ message: "Invalid projects data" });
  }
};
const getProjectById= (req, res) => {
  try {
    const id = req.params.id;
    const projects = getProjects();
    const project = projects.find((u) => u.id == id);

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "project not found" });
    }
    return res.status(200).json({
      success: true,
      message: "project fetched successfully",
      project,
    });
  } catch (error) {
    console.error("JSON parse error:", error);
    return res.status(500).json({ message: "Invalid projects data" });
  }
};
const addProject= async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    const projects = getProjects();
    const users = getUsers();
    if (!name || !description || !userId) {
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
    const newProject = {
      id: Date.now(),
      name,
      description,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };
    projects.push(newProject);
    saveProject(projects);
    return res.status(201).json({
      success: true,
      message: "project registered successfully",
      projects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProject =  (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;
    const users = getUsers();
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please Provide UserID to Upadte Project",
      });
    }
    const user = users.find((u) => u.id == userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Id not Found",
      });
    }
    const projects = getProjects();
    const idx = projects.findIndex((u) => u.id == id);
    if (idx == -1) {
      return res
        .status(404)
        .json({ success: false, message: "project not found" });
    }
    // if (projects.find((u) => u.email === req.body.email)) {
    //   return res.status(400).json({ message: "Email is  already exists" });
    // }
    if (projects[idx].userId != user.id) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to update this project",
      });
    }
    projects[idx] = { ...projects[idx], ...req.body };
    saveProject(projects);
    return res.status(201).json({
      Success: true,
      message: "project Updated Successfully",
      project: projects[idx],
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
const deleteProject =  (req, res) => {
  try {
    const id = req.params.id;
    const { userId } = req.body;
    const users = getUsers();
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please Provide UserID to Delete Project",
      });
    }
    const user = users.find((u) => u.id == userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Id not Found",
      });
    }
    const projects = getProjects();
    const idx = projects.findIndex((u) => u.id == id);
    if (idx == -1) {
      return res
        .status(404)
        .json({ success: false, message: "project not found" });
    }
    if (projects[idx].userId != user.id) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to Delete this project",
      });
    }
    const project = projects.filter((u) => u.id != id);

    saveProject(project);

    return res.status(200).json(project);

    // console.log(projects);
    // res.json(projects);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

module.exports = {getAllProjects,getProjectById,addProject,updateProject,deleteProject};
