const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.static("public"));

const LOGS_DIR = path.join(process.cwd(), "..", "logs");

// Utility to read all markdown files
function getAllLogs() {
  const files = fs.readdirSync(LOGS_DIR).filter(f => f.endsWith(".md"));

  return files.map(file => {
    const date = file.replace(".md", "");
    const content = fs.readFileSync(path.join(LOGS_DIR, file), "utf8");

    return { date, content };
  });
}

// 🟢 Health check
app.get("/test", (req, res) => {
  res.send("🐍 naaDaridramVinu API running");
});

// 🗓 List all available dates
app.get("/api/dates", (req, res) => {
  const logs = getAllLogs();
  const dates = logs.map(l => l.date);
  res.json(dates);
});

// 🎲 Random or 📅 Date-specific story
app.get("/api/story", (req, res) => {
  const { date } = req.query;
  const logs = getAllLogs();

  if (logs.length === 0) {
    return res.status(404).json({ error: "No cursed stories found" });
  }

  // If date provided
  if (date) {
    const story = logs.find(l => l.date === date);
    if (!story) {
      return res.status(404).json({ error: "No suffering recorded on this date" });
    }

    return res.json({
      date: story.date,
      content: story.content
    });
  }

  // Else return random cursed story
  const random = logs[Math.floor(Math.random() * logs.length)];

  res.json({
    date: random.date,
    content: random.content
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🐍 naaDaridramVinu listening on port ${PORT}`);
});
