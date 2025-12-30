const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

router.get("/project", getAllProjects);
router.get("/project/:id", getProjectById);
router.post("/project", addProject);
router.put("/project/:id", updateProject);
router.delete("/project/:id", deleteProject);

module.exports = router;
