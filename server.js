const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (HTML, CSS, JS for frontend)
app.use(express.static(path.join(__dirname)));

// Sample database
let jobs = [
  {
    id: 1,
    company: "Google",
    title: "Software Engineer",
    location: "Bangalore",
    salary: "₹25 LPA",
    description: "Develop and maintain web applications"
  },
  {
    id: 2, 
    company: "Microsoft",
    title: "Product Manager", 
    location: "Hyderabad",
    salary: "₹30 LPA",
    description: "Manage product development lifecycle"
  }
];

// API Routes

// GET all jobs
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

// ADD new job
app.post('/api/jobs', (req, res) => {
  const newJob = {
    id: jobs.length + 1,
    ...req.body
  };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

// DELETE job
app.delete('/api/jobs/:id', (req, res) => {
  const jobId = parseInt(req.params.id);
  jobs = jobs.filter(job => job.id !== jobId);
  res.json({ message: 'Job deleted successfully' });
});

// Serve the main page for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Job Placement Server running on port: ${port}`);
});