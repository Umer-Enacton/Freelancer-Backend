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
app.use(
  cors({
    origin: "https://freelancer-ten-pied.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/", authRoutes);
app.use(auth);
app.use("/", userRoutes);
app.use("/", projectRoutes);
app.use("/", timeEntryRoutes);
app.use("/", sessionRoutes);
app.use("/", summaryRoutes);

// app.get("/home/:id", (req, res) => {
//   res.send(`There is No Home! ${req.params.id}`);
// });

app.listen(port, () => console.log(`Server Running on Port : ${port}`));
