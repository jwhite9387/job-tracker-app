const sqlite3 = require("sqlite3").verbose();

// Create/connect to database file
const db = new sqlite3.Database("./jobs.db", (err) => {
  if (err) {
    console.error("Error connecting to database", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create jobs table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT,
      position TEXT,
      status TEXT,
      date_applied TEXT,
      notes TEXT
    )
  `);
});

module.exports = db;