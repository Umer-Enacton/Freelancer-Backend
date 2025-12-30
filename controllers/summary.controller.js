const {
  getTimeEntries,
  getSummaryByTimeEntry,
  saveSummaryByTimeEntry,
  getSessions,
  getUsers,
  getProjects,
  convertMinutes,
} = require("../utils/oprations");

const getProjectSummary = (req, res) => {
  const id = req.params.timeEntryId;
  const summaries = getSummaryByTimeEntry();
  const timeEntries = getTimeEntries();
  const idx = timeEntries.findIndex((u) => u.id == id);

  if (idx == -1) {
    return res.status(404).json({
      success: false,
      message: "TimeEntry Not Found",
    });
  }

  if (timeEntries[idx].completed !== true) {
    return res.status(400).json({
      success: false,
      message: "TimeEntry is not completed yet",
    });
  }

  const sessions = getSessions();
  const session = sessions.filter((u) => u.timeEntryId == id);

  if (session.length == 0) {
    return res.status(404).json({
      success: false,
      message: "Sessions Not found For this time Entry",
    });
  }

  // Check if summary already exists
  const existingSummary = summaries.find((u) => u.timeEntryId == id);
  if (existingSummary) {
    // Return the existing summary instead of error
    return res.status(200).json({
      success: true,
      message: "Summary retrieved successfully",
      timeEntryId: existingSummary.timeEntryId,
      TotalSessions: existingSummary.TotalSessions,
      TotalBreaks: existingSummary.TotalBreaks,
      Net_WorkTimeMinutes: existingSummary.Net_WorkTimeMinutes,
      Net_WorkTime: existingSummary.Net_WorkTime,
      TotalBreakTimeMinutes: existingSummary.TotalBreakTimeMinutes,
      GrossTimeMinutes: existingSummary.GrossTimeMinutes,
      GrossTime: existingSummary.GrossTime,
    });
  }

  // Create new summary if it doesn't exist
  const newSummary = {
    id: Date.now(),
    timeEntryId: id,
    TotalSessions: session.length,
    TotalBreaks: session.reduce((a, b) => {
      return a + b.breaks.length;
    }, 0),
    Net_WorkTimeMinutes: session.reduce((a, b) => {
      return a + b.durationMinutes;
    }, 0),
    Net_WorkTime: convertMinutes(
      session.reduce((a, b) => {
        return a + b.durationMinutes;
      }, 0)
    ),
    TotalBreakTimeMinutes: session.reduce((a, b) => {
      return (
        a +
        b.breaks.reduce((sum, b) => {
          return sum + b.durationMinutes;
        }, 0)
      );
    }, 0),
    GrossTimeMinutes:
      session.reduce((a, b) => {
        return a + b.durationMinutes;
      }, 0) +
      session.reduce((a, b) => {
        return (
          a +
          b.breaks.reduce((sum, b) => {
            return sum + b.durationMinutes;
          }, 0)
        );
      }, 0),
    GrossTime: convertMinutes(
      session.reduce((a, b) => {
        return a + b.durationMinutes;
      }, 0) +
        session.reduce((a, b) => {
          return (
            a +
            b.breaks.reduce((sum, b) => {
              return sum + b.durationMinutes;
            }, 0)
          );
        }, 0)
    ),
    createdAt: new Date().toISOString(),
  };

  summaries.push(newSummary);
  saveSummaryByTimeEntry(summaries);

  return res.status(200).json({
    success: true,
    message: "Summary Calculated successfully",
    timeEntryId: id,
    TotalSessions: session.length,
    TotalBreaks: session.reduce((a, b) => {
      return a + b.breaks.length;
    }, 0),
    Net_WorkTimeMinutes: session.reduce((a, b) => {
      return a + b.durationMinutes;
    }, 0),
    Net_WorkTime: convertMinutes(
      session.reduce((a, b) => {
        return a + b.durationMinutes;
      }, 0)
    ),
    TotalBreakTimeMinutes: session.reduce((a, b) => {
      return (
        a +
        b.breaks.reduce((sum, b) => {
          return sum + b.durationMinutes;
        }, 0)
      );
    }, 0),
    GrossTimeMinutes:
      session.reduce((a, b) => {
        return a + b.durationMinutes;
      }, 0) +
      session.reduce((a, b) => {
        return (
          a +
          b.breaks.reduce((sum, b) => {
            return sum + b.durationMinutes;
          }, 0)
        );
      }, 0),
    GrossTime: convertMinutes(
      session.reduce((a, b) => {
        return a + b.durationMinutes;
      }, 0) +
        session.reduce((a, b) => {
          return (
            a +
            b.breaks.reduce((sum, b) => {
              return sum + b.durationMinutes;
            }, 0)
          );
        }, 0)
    ),
  });
};

const getAllProjectSummaryByUser = (req, res) => {
  const id = req.params.userId;
  const users = getUsers();
  const idx = users.findIndex((u) => u.id == id);
  if (idx == -1) {
    return res.status(404).json({
      success: false,
      message: "User Not Found",
    });
  }
  const projects = getProjects();
  const userProjects = projects.filter((u) => u.userId == id);
  if (userProjects.length == 0) {
    return res.status(404).json({
      success: false,
      message: "Projects Not Found of this user",
    });
  }
  const timeEntries = getTimeEntries();
  const userTimeEntries = timeEntries.filter((u) => u.userId == id);
  if (userTimeEntries.length == 0) {
    return res.status(404).json({
      success: false,
      message: "Time Entry Not Found of this user's Projects",
    });
  }
  const sessions = getSessions();
  let summaries = [];
  userTimeEntries.forEach((entry) => {
    const session = sessions.filter((u) => u.timeEntryId == entry.id);
    summaries.push({
      timeEntryId: entry.id,
      TotalSessions: session.length,
      TotalBreaks: session.reduce((a, b) => {
        return a + b.breaks.length;
      }, 0),
      Net_WorkTimeMinutes: session.reduce((a, b) => {
        return a + b.durationMinutes;
      }, 0),
      Net_WorkTime: convertMinutes(
        session.reduce((a, b) => {
          return a + b.durationMinutes;
        }, 0)
      ),
      TotalBreakTimeMinutes: session.reduce((a, b) => {
        return (
          a +
          b.breaks.reduce((sum, b) => {
            return sum + b.durationMinutes;
          }, 0)
        );
      }, 0),
      GrossTimeMinutes:
        session.reduce((a, b) => {
          return a + b.durationMinutes;
        }, 0) +
        session.reduce((a, b) => {
          return (
            a +
            b.breaks.reduce((sum, b) => {
              return sum + b.durationMinutes;
            }, 0)
          );
        }, 0),
      GrossTime: convertMinutes(
        session.reduce((a, b) => {
          return a + b.durationMinutes;
        }, 0) +
          session.reduce((a, b) => {
            return (
              a +
              b.breaks.reduce((sum, b) => {
                return sum + b.durationMinutes;
              }, 0)
            );
          }, 0)
      ),
    });
  });
  // console.log(summaries);
  return res.status(200).json({
    success: true,
    summaries,
  });
};
module.exports = { getProjectSummary, getAllProjectSummaryByUser };
