import React, { useEffect, useState } from "react";

function App() {
  const [jobs, setJobs] = useState([]);

  // filter state
  const [filter, setFilter] = useState("all");

  // form state
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");
  const [dateApplied, setDateApplied] = useState("");
  const [notes, setNotes] = useState("");

  // fetch jobs
  const fetchJobs = () => {
    fetch("http://localhost:5000/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // submit new job
  const handleSubmit = (e) => {
    e.preventDefault();

    const newJob = {
      company,
      position,
      status,
      date_applied: dateApplied,
      notes,
    };

    fetch("http://localhost:5000/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newJob),
    })
      .then((res) => res.json())
      .then(() => {
        // clear form
        setCompany("");
        setPosition("");
        setStatus("applied");
        setDateApplied("");
        setNotes("");

        // refresh list
        fetchJobs();
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/jobs/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        // refresh list after deletion
        setJobs(jobs.filter((job) => job.id !== id));
      })
      .catch((err) => console.error(err));
  };

  const handleStatusChange = (id, newStatus) => {
    const job = jobs.find((j) => j.id === id);
    
    const updatedJob = {
      company: job.company,
      position: job.position,
      status: newStatus,
      date_applied: job.date_applied,
      notes: job.notes,
    };

    fetch(`http://localhost:5000/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedJob),
    })
      .then((res) => res.json())
      .then(() => {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === id ? { ...j, status: newStatus } : j
          )
        );
      })
      .catch((err) => console.error(err));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "#6c757d"; //gray
      case "interviewing":
        return "#0d6efd"; //blue
      case "offer":
        return "#198754"; //green
      case "rejected":
        return "#dc3545"; //red
      default:
        return "#000"; 
    }
  };

  const stats = {
    total: jobs.length,
    applied: jobs.filter((job) => job.status === "applied").length,
    interviewing: jobs.filter((job) => job.status === "interviewing").length,
    offer: jobs.filter((job) => job.status === "offer").length,
    rejected: jobs.filter((job) => job.status === "rejected").length,
  };

  const filteredJobs =
    filter === "all"
      ? jobs
      : jobs.filter((job) => job.status === filter);

  
  return (
    <div style={{ padding: "20px" }}>
      <h1>Job Tracker</h1>

      {/* ADD JOB FORM */}
      <h2>Add Job</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <br />

        <input
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <br />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="applied">Applied</option>
          <option value="interviewing">Interviewing</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <br />

        <input
          type="date"
          value={dateApplied}
          onChange={(e) => setDateApplied(e.target.value)}
        />
        <br />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <br />

        <button type="submit">Add Job</button>
      </form>

      {/* DASHBOARD */}
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "6px" }}>
          <strong>Total</strong>
          <p>{stats.total}</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "6px" }}>
          <strong>Applied</strong>
          <p>{stats.applied}</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "6px" }}>
          <strong>Interviewing</strong>
          <p>{stats.interviewing}</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "6px" }}>
          <strong>Offer</strong>
          <p>{stats.offer}</p>
        </div>

        <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "6px" }}>
          <strong>Rejected</strong>
          <p>{stats.rejected}</p>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <h2>Filter</h2>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("applied")}>Applied</button>
        <button onClick={() => setFilter("interviewing")}>Interviewing</button>
        <button onClick={() => setFilter("offer")}>Offer</button>
        <button onClick={() => setFilter("rejected")}>Rejected</button>
      </div>

      {/* JOB LIST */}
      <h2>Applications</h2>

      <ul>
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{job.company}</h3>
            <p>{job.position}</p>

            {/* DATE APPLIED */}
            <p>
              <strong>Applied:</strong> {job.date_applied
                                          ? new Date(job.date_applied).toLocaleDateString()
                                          : "N/A"}
            </p>

            {/* NOTES */}
            {job.notes && (
              <p>
                <strong>Notes:</strong> {job.notes}
              </p>
            )}

            {/* STATUS BADGE */}
            <p>
              <strong>Status:</strong> {" "}
              <span
                style={{
                  backgroundColor: getStatusColor(job.status),
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  fontSize: "0.9",
                }}
              >
                {job.status}
              </span>
            </p>

            {/* STATUS UPDATE */}
            <select
              value={job.status}
              onChange={(e) => handleStatusChange(job.id, e.target.value)}
              style={{ marginLeft: "10px" }}
            >
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* DELETE */}
            <button
              onClick={() => handleDelete(job.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;