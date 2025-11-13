// Job Placement Management System - Frontend
const API_URL = '/api/jobs'; // Changed to relative path

// Load all jobs from server
async function loadJobs() {
  try {
    const response = await fetch(API_URL);
    const jobs = await response.json();
    displayJobs(jobs);
  } catch (error) {
    console.error('Error loading jobs:', error);
    document.getElementById('jobList').innerHTML = 
      '<li class="no-jobs">Error loading jobs</li>';
  }
}

// ... rest of your script.js remains the same ...
// (keep all your displayJobs, addJob, deleteJob functions)