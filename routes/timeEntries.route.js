const express = require("express");
const router = express.Router();
const {
  getAllTimeEntries,
  getTimeEntryById,
  addTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  completeTimeEntry,
} = require("../controllers/timeEntry.controller");

router.get("/timeEntry", getAllTimeEntries);
router.get("/timeEntry/:id", getTimeEntryById);
router.post("/timeEntry", addTimeEntry);
router.put("/timeEntry/:id", updateTimeEntry);
router.delete("/timeEntry/:id", deleteTimeEntry);
router.put("/timeEntry/complete/:id", completeTimeEntry);

module.exports = router;
