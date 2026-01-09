const express = require("express");
const userRoutes = require("./routes/user.route");
const projectRoutes = require("./routes/project.route");
const timeEntryRoutes = require("./routes/timeEntries.route");
const sessionRoutes = require("./routes/session.route");
const summaryRoutes = require("./routes/summary.route");
const auth = require("./middleware/auth");
const authRoutes = require("./routes/auth.route");
const cors = require("cors");

const app = express();
const port = 5000;

// Allowed Origins (Frontend)
const allowedOrigins = [
  "https://freelancer-ten-pied.vercel.app",
  "http://localhost:5173",
];

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Project Information Route
app.get("/", (req, res) => {
  res.json({
    projectName: "Freelancer Time Tracking System",
    description:
      "A full-stack time tracking and productivity management system for freelancers. Tracks sessions, time entries, projects, and generates summaries.",
    backendTech: ["Node.js", "Express.js", "JWT Auth", "MySQL/MongoDB"],
    frontendTech: ["React.js", "Vite", "Tailwind"],
    status: "Backend is up and healthy",
    frontendURL: "https://freelancer-ten-pied.vercel.app",
    backendURL: "https://your-backend-url.com",
    author: "Umer Saiyad",
  });
});

// Routes
app.use("/", authRoutes);
app.use(auth);
app.use("/", userRoutes);
app.use("/", projectRoutes);
app.use("/", timeEntryRoutes);
app.use("/", sessionRoutes);
app.use("/", summaryRoutes);

// Start Server
app.listen(port, () => console.log(`Server Running on Port : ${port}`));
