const {
  getSessions,
  saveSession,
  getTimeEntries,
  getDateDifference,
} = require("../utils/oprations");

const getAllSessions = async (req, res) => {
  try {
    const sessions = await getSessions();
    return res.status(200).json({
      success: true,
      message: "All sessions",
      sessions,
    });
  } catch (error) {
    console.error("JSON parse error:", error);
    return res.status(500).json({ message: "Invalid users data" });
  }
};

const getSessionByTimeEntry = async (req, res) => {
  try {
    const timeEntryId = req.params.timeEntryId;
    const sessions = await getSessions();
    const idx = sessions.findIndex((u) => u.timeEntryId == timeEntryId);
    if (idx == -1) {
      return res.status(404).json({
        success: false,
        message: "TimeEntry Not Found",
      });
    }
    const session = sessions.filter((u) => u.timeEntryId == timeEntryId);
    return res.status(200).json({
      success: true,
      message: "sessions by timeEntryId",
      session,
    });
  } catch (error) {
    console.error("JSON parse error:", error);
    return res.status(500).json({ message: "Invalid Project data" });
  }
};

const checkIn = async (req, res) => {
  try {
    const { timeEntryId } = req.body;
    const sessions = getSessions();
    const timeEntries = getTimeEntries();
    if (!timeEntryId) {
      return res.status(401).json({
        success: false,
        message: "Required Field Missing",
      });
    }
    let timeEntry = timeEntries.find((u) => u.id == timeEntryId);
    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: "timeEntry Id not Found",
      });
    }
    if (timeEntry.completed) {
      return res.status(404).json({
        success: false,
        message: "Cannot Chekin in Completed TimeEntry",
      });
    }
    const newSession = {
      id: Date.now(),
      timeEntryId: timeEntry.id,
      checkIn: new Date().toISOString(),
      checkOut: null,
      isActive: true,
      durationMinutes: null,
      breaks: [],
      createdAt: new Date().toISOString(),
    };
    sessions.push(newSession);
    saveSession(sessions);
    return res.status(200).json({
      success: true,
      message: "Session Checkin successfully",
      session: newSession,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const checkOut = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const { timeEntryId } = req.body;
    const sessions = getSessions();
    const timeEntries = getTimeEntries();

    if (!timeEntryId) {
      return res.status(401).json({
        success: false,
        message: "Required Field Missing",
      });
    }
    const idx = sessions.findIndex((u) => u.id == sessionId);
    if (idx == -1) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }
    const breaks = sessions[idx].breaks;
    const breakTimeMinutes = breaks.reduce((sum, b) => {
      return sum + (b.durationMinutes || 0);
    }, 0);
    const lastBreak = breaks[breaks.length - 1];
    let timeEntry = timeEntries.find((u) => u.id == timeEntryId);
    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: "timeEntry Id not Found",
      });
    }
    if (sessions[idx].timeEntryId != timeEntry.id) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to Add session",
      });
    }
    if (sessions[idx].isActive == false) {
      return res.status(401).json({
        success: false,
        message: "Chekin First",
      });
    }
    if (lastBreak && lastBreak.isActive === true) {
      return res.status(401).json({
        success: false,
        message: "Break Out first",
      });
    }

    // Calculate duration with decimal precision
    const checkInTime = new Date(sessions[idx].checkIn);
    const checkOutTime = new Date();
    const durationMs = checkOutTime - checkInTime;
    const durationMinutesDecimal =
      Math.round((durationMs / 1000 / 60) * 100) / 100;
    const netWorkMinutes = Math.max(
      0,
      durationMinutesDecimal - breakTimeMinutes
    );

    sessions[idx] = {
      ...sessions[idx],
      ...req.body,
      isActive: false,
      checkOut: checkOutTime.toISOString(),
      breakTimeMinutes,
      durationMinutes: Math.round(netWorkMinutes), // Store as whole minutes for compatibility
    };
    saveSession(sessions);
    return res.status(200).json({
      success: true,
      message: "Session CheckOut successfully",
      session: sessions[idx],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const breakOut = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const { timeEntryId } = req.body;
    const sessions = getSessions();
    const timeEntries = getTimeEntries();

    const idx = sessions.findIndex((u) => u.id == sessionId);
    if (idx == -1) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }
    const breaks = sessions[idx].breaks;
    const lastBreak = breaks[breaks.length - 1];
    if (!timeEntryId) {
      return res.status(401).json({
        success: false,
        message: "Required Field Missing",
      });
    }
    let timeEntry = timeEntries.find((u) => u.id == timeEntryId);
    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: "timeEntry Id not Found",
      });
    }
    if (sessions[idx].timeEntryId != timeEntry.id) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to Add session",
      });
    }
    if (sessions[idx].isActive == false) {
      return res.status(401).json({
        success: false,
        message: "Chek-In First",
      });
    }
    if (!lastBreak || lastBreak.isActive === false) {
      return res.status(401).json({
        success: false,
        message: "BreakIn first",
      });
    }

    const breakOutTime = new Date();
    const breakInTime = new Date(lastBreak.breakIn);

    // Calculate break duration with decimal precision
    const breakDurationMs = breakOutTime - breakInTime;
    const breakDurationMinutes = Number(
      (breakDurationMs / 1000 / 60).toFixed(2)
    );

    lastBreak.breakOut = breakOutTime.toISOString();
    lastBreak.isActive = false;
    lastBreak.durationMinutes = breakDurationMinutes; // Store decimal minutes (e.g., 0.13 for 8 seconds)

    saveSession(sessions);
    return res.status(200).json({
      success: true,
      message: "Session BreakOut successfully",
      session: sessions[idx],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const breakIn = async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const { timeEntryId } = req.body;
    const sessions = getSessions();
    const timeEntries = getTimeEntries();

    const idx = sessions.findIndex((u) => u.id == sessionId);
    if (idx == -1) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }
    const breaks = sessions[idx].breaks;
    const lastBreak = breaks[breaks.length - 1];
    if (!timeEntryId) {
      return res.status(401).json({
        success: false,
        message: "Required Field Missing",
      });
    }
    let timeEntry = timeEntries.find((u) => u.id == timeEntryId);
    if (!timeEntry) {
      return res.status(404).json({
        success: false,
        message: "timeEntry Id not Found",
      });
    }
    if (sessions[idx].timeEntryId != timeEntry.id) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to Add session",
      });
    }
    if (sessions[idx].isActive == false) {
      return res.status(401).json({
        success: false,
        message: "Chekin First",
      });
    }
    if (lastBreak && lastBreak.isActive === true) {
      return res.status(401).json({
        success: false,
        message: "Break already active",
      });
    }

    sessions[idx].breaks.push({
      breakIn: new Date().toISOString(),
      breakOut: null,
      isActive: true,
      durationMinutes: null,
    });

    saveSession(sessions);
    return res.status(200).json({
      success: true,
      message: "Session BreakIn successfully",
      session: sessions[idx],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllSessions,
  getSessionByTimeEntry,
  checkIn,
  checkOut,
  breakIn,
  breakOut,
};
