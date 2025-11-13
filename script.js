// Job Placement Management System - Professional Version
const API_URL = 'http://localhost:3000/api/jobs';

// Load all jobs from server
async function loadJobs() {
  try {
    const response = await fetch(API_URL);
    const jobs = await response.json();
    displayJobs(jobs);
  } catch (error) {
    console.error('Error loading jobs:', error);
    document.getElementById('jobList').innerHTML = 
      '<li>Error loading jobs. Make sure server is running!</li>';
  }
}

// Display jobs
function displayJobs(jobs) {
  const jobList = document.getElementById('jobList');
  jobList.innerHTML = '';

  if (jobs.length === 0) {
    jobList.innerHTML = '<li class="no-jobs">No job openings available</li>';
    return;
  }

  jobs.forEach(job => {
    const li = document.createElement('li');
    li.className = 'job-item';
    li.innerHTML = `
      <div class="job-card">
        <h4>${job.company} - ${job.title}</h4>
        <div class="job-details">
          <p><strong>📍 Location:</strong> ${job.location}</p>
          <p><strong>💰 Salary:</strong> ${job.salary}</p>
          <p><strong>📝 Description:</strong> ${job.description}</p>
        </div>
        <button class="delete-btn" onclick="deleteJob(${job.id})">
          🗑️ Delete
        </button>
      </div>
    `;
    jobList.appendChild(li);
  });
}

// ADD new job
async function addJob() {
  const company = document.getElementById('companyName').value;
  const title = document.getElementById('jobTitle').value;
  const location = document.getElementById('location').value;
  const salary = document.getElementById('salary').value;
  const description = document.getElementById('description').value;

  if (company && title && location && salary && description) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          company: company,
          title: title,
          location: location,
          salary: salary,
          description: description
        })
      });

      if (response.ok) {
        clearForm();
        loadJobs(); // Reload the list
        alert('✅ Job added successfully!');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      alert('❌ Error adding job. Check server connection.');
    }
  } else {
    alert('⚠️ Please fill all fields!');
  }
}

// DELETE job
async function deleteJob(jobId) {
  if (confirm('Are you sure you want to delete this job?')) {
    try {
      const response = await fetch(`${API_URL}/${jobId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadJobs(); // Reload the list
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  }
}

// Clear form
function clearForm() {
  document.getElementById('companyName').value = '';
  document.getElementById('jobTitle').value = '';
  document.getElementById('location').value = '';
  document.getElementById('salary').value = '';
  document.getElementById('description').value = '';
}

// Enter key to submit
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addJob();
  }
});