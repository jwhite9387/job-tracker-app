const db = require("./database");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("Job Tracker API is running");
});

// Post route
app.post("/jobs", (req, res) => {
  const { company, position, status, date_applied, notes } = req.body;

  const query = `
    INSERT INTO jobs (company, position, status, date_applied, notes)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [company, position, status, date_applied, notes], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to add job" });
    } else {
      res.json({
        message: "Job added successfully",
        jobId: this.lastID
      });
    }
  });
});

// Get jobs route
app.get("/jobs", (req, res) => {
  const query = "SELECT * FROM jobs";

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to fetch jobs" });
    } else {
      res.json(rows);
    }
  });
});

// Delete jobs route
app.delete("/jobs/:id", (req, res) => {
  const jobId = req.params.id;

  const query = "DELETE FROM jobs WHERE id = ?";

  db.run(query, [jobId], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to delete job" });
    } else {
      if (this.changes === 0) {
        res.status(404).json({ error: "Job not found" });
      } else {
        res.json({ message: "Job deleted successfully" });
      }
    }
  });
});

// Put jobs route
app.put("/jobs/:id", (req, res) => {
  const jobId = req.params.id;
  const { company, position, status, date_applied, notes } = req.body;

  const query = `
    UPDATE jobs
    SET company = ?, position = ?, status = ?, date_applied = ?, notes = ?
    WHERE id = ?
  `;

  db.run(query, [company, position, status, date_applied, notes, jobId], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to update job" });
    } else {
      if (this.changes === 0) {
        res.status(404).json({ error: "Job not found" });
      } else {
        res.json({ message: "Job updated successfully" });
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});