const {
  getSessions,
  saveSessions,
} = require("../utils/sessionFileHandler");

const breakout = (req, res) => {
  try {
    const { sessionId, timeEntryId } = req.params;

    const sessions = getSessions();
    const session = sessions.find(
      (s) => s.id === parseInt(sessionId) && s.timeEntryId === parseInt(timeEntryId)
    );

    if (!session) {
      return res.status(404).json({ message: "Session Not Found" });
    }

    if (!session.isActive) {
      return res.status(400).json({ message: "Session is not active" });
    }

    const activeBreak = session.breaks.find((b) => b.isActive);
    if (!activeBreak) {
      return res.status(400).json({ message: "No Active Break to End" });
    }

    // Fix: Calculate duration in SECONDS first, then convert to minutes with decimals
    const breakOut = new Date();
    const breakIn = new Date(activeBreak.breakIn);
    const durationSeconds = Math.floor((breakOut - breakIn) / 1000);
    const durationMinutes = Math.round((durationSeconds / 60) * 100) / 100; // Round to 2 decimal places

    activeBreak.breakOut = breakOut.toISOString();
    activeBreak.isActive = false;
    activeBreak.durationMinutes = durationMinutes;

    saveSessions(sessions);
    return res.status(200).json({
      success: true,
      message: "Break Ended Successfully",
      session,
    });
  } catch (error) {
    console.error("Error ending break:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const checkout = (req, res) => {
  try {
    const { sessionId, timeEntryId } = req.params;

    const sessions = getSessions();
    const session = sessions.find(
      (s) => s.id === parseInt(sessionId) && s.timeEntryId === parseInt(timeEntryId)
    );

    if (!session) {
      return res.status(404).json({ message: "Session Not Found" });
    }

    if (!session.isActive) {
      return res.status(400).json({ message: "Session Already Checked Out" });
    }

    const activeBreak = session.breaks.find((b) => b.isActive);
    if (activeBreak) {
      return res.status(400).json({
        message: "Cannot Check Out While on Break. Please End Break First",
      });
    }

    // Fix: Calculate duration in SECONDS first, then convert to minutes
    const checkOut = new Date();
    const checkIn = new Date(session.checkIn);
    const durationSeconds = Math.floor((checkOut - checkIn) / 1000);
    const durationMinutes = Math.round(durationSeconds / 60);

    session.checkOut = checkOut.toISOString();
    session.isActive = false;
    session.durationMinutes = durationMinutes;

    saveSessions(sessions);
    return res.status(200).json({
      success: true,
      message: "Checked Out Successfully",
      session,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const checkin = (req, res) => {
  try {
    const { timeEntryId } = req.body;

    if (!timeEntryId) {
      return res.status(400).json({ message: "Time Entry ID is Required" });
    }

    const sessions = getSessions();
    const activeSession = sessions.find(
      (s) => s.timeEntryId === timeEntryId && s.isActive
    );

    if (activeSession) {
      return res.status(400).json({
        message: "Already Checked In. Please Check Out First",
      });
    }

    const newSession = {
      id: sessions.length > 0 ? Math.max(...sessions.map((s) => s.id)) + 1 : 1,
      timeEntryId,
      checkIn: new Date().toISOString(),
      checkOut: null,
      isActive: true,
      breaks: [],
      durationMinutes: null,
    };

    sessions.push(newSession);
    saveSessions(sessions);

    return res.status(201).json({
      success: true,
      message: "Checked In Successfully",
      session: newSession,
    });
  } catch (error) {
    console.error("Error during checkin:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const breakin = (req, res) => {
  try {
    const { sessionId, timeEntryId } = req.params;

    const sessions = getSessions();
    const session = sessions.find(
      (s) => s.id === parseInt(sessionId) && s.timeEntryId === parseInt(timeEntryId)
    );

    if (!session) {
      return res.status(404).json({ message: "Session Not Found" });
    }

    if (!session.isActive) {
      return res.status(400).json({ message: "Session is not active" });
    }

    const activeBreak = session.breaks.find((b) => b.isActive);
    if (activeBreak) {
      return res.status(400).json({ message: "Already on Break" });
    }

    const newBreak = {
      breakIn: new Date().toISOString(),
      breakOut: null,
      isActive: true,
      durationMinutes: null,
    };

    session.breaks.push(newBreak);
    saveSessions(sessions);

    return res.status(200).json({
      success: true,
      message: "Break Started Successfully",
      session,
    });
  } catch (error) {
    console.error("Error starting break:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getSessionByTimeEntry = (req, res) => {
  try {
    const { timeEntryId } = req.params;
    const sessions = getSessions();
    const session = sessions.filter(
      (s) => s.timeEntryId === parseInt(timeEntryId)
    );

    return res.status(200).json({ success: true, session });
  } catch (error) {
    console.error("Error getting sessions:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  checkin,
  checkout,
  breakin,
  breakout,
  getSessionByTimeEntry,
};
