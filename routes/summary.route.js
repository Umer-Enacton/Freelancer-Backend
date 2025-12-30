const express = require("express");
const router = express.Router();
const {
  getProjectSummary,
  getAllProjectSummaryByUser,
} = require("../controllers/summary.controller");

router.get("/summary/project-time-entry/:timeEntryId", getProjectSummary);
router.get("/summary/user/:userId", getAllProjectSummaryByUser);

module.exports = router;
