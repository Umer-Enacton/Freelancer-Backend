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

// Project Information Route - Styled HTML
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Freelancer Time Tracking - Backend Info</title>
      
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          background: #f4f6f9;
          padding: 40px;
          color: #333;
        }
        .container {
          max-width: 800px;
          margin: auto;
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        h1 {
          text-align: center;
          margin-bottom: 10px;
          color: #1a73e8;
        }
        p.description {
          text-align: center;
          font-size: 1.1rem;
          color: #555;
        }
        .section {
          margin-top: 25px;
        }
        .section h2 {
          margin-bottom: 10px;
          color: #444;
        }
        .badge {
          display: inline-block;
          padding: 6px 12px;
          background: #e8f0fe;
          color: #1a73e8;
          border-radius: 6px;
          font-size: 14px;
          margin: 4px;
        }
        .info-box {
          background: #fafafa;
          padding: 15px;
          border-left: 5px solid #1a73e8;
          margin-top: 10px;
        }
        a {
          color: #1a73e8;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
        footer {
          text-align: center;
          margin-top: 30px;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Freelancer Time Tracking System</h1>
        <p class="description">
          A full-stack platform to track time, productivity, projects, and work summaries.
        </p>

        <div class="section">
          <h2>Backend Tech</h2>
          <div>
            <span class="badge">Node.js</span>
            <span class="badge">Express.js</span>
            <span class="badge">JWT Auth</span>
            <span class="badge">File Storage</span>
          </div>
        </div>

        <div class="section">
          <h2>Frontend Tech</h2>
          <div>
            <span class="badge">React.js</span>
            <span class="badge">Vite</span>
            <span class="badge">TailwindCSS</span>
          </div>
        </div>

        <div class="section">
          <h2>Links</h2>
          <div class="info-box">
            <p><strong>Visit Frontend:</strong> <a href="https://freelancer-ten-pied.vercel.app" target="_blank">Open App</a></p>
          </div>
        </div>

        <div class="section">
          <h2>Status</h2>
          <div class="info-box">
            Backend is <strong>up and healthy</strong> ✔️
          </div>
        </div>

        <footer>
          Developed by <strong>Umer Saiyad</strong>
        </footer>

      </div>
    </body>
    </html>
  `);
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
