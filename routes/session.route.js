const express = require("express");
const router = express.Router();
const {
  getAllSessions,
  getSessionByTimeEntry,
  checkIn,
  checkOut,
  breakIn,
  breakOut,
} = require("../controllers/session.controller");

router.get("/session", getAllSessions);
router.get("/session/:timeEntryId", getSessionByTimeEntry);
router.post("/session/checkin", checkIn);
router.put("/session/checkout/:sessionId", checkOut);
router.put("/session/breakout/:sessionId", breakOut);
router.put("/session/breakin/:sessionId", breakIn);

module.exports = router;
