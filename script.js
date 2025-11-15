// Job Placement Management System - Complete CRUD Version
const API_URL = '/api/jobs';

let jobs = [];

// Load all jobs from server
async function loadJobs() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Server error');
    
    const jobsData = await response.json();
    jobs = jobsData;
    displayJobs(jobs);
  } catch (error) {
    console.error('Error loading jobs:', error);
    // Show sample data if server fails
    jobs = [
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
    displayJobs(jobs);
    document.getElementById('jobList').innerHTML += 
      '<li class="no-jobs">⚠️ Using sample data</li>';
  }
}

// Display jobs with CRUD buttons
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
        <div class="job-header">
          <div>
            <div class="job-title">${job.title}</div>
            <div class="job-company">🏢 ${job.company}</div>
          </div>
        </div>
        <div class="job-details">
          <div class="detail-item">📍 ${job.location}</div>
          <div class="detail-item">💰 ${job.salary}</div>
          <div class="detail-item">📝 ${job.description}</div>
        </div>
        <div class="job-actions">
          <button class="btn edit-btn" onclick="editJob(${job.id})">
            ✏️ Edit
          </button>
          <button class="btn btn-danger delete-btn" onclick="deleteJob(${job.id})">
            🗑️ Delete
          </button>
        </div>
      </div>
    `;
    jobList.appendChild(li);
  });
}

// CREATE - Add new job
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
        loadJobs();
        alert('✅ Job added successfully!');
      }
    } catch (error) {
      console.error('Error adding job:', error);
      alert('❌ Error adding job');
    }
  } else {
    alert('⚠️ Please fill all fields!');
  }
}

// DELETE - Remove job
async function deleteJob(jobId) {
  if (confirm('Are you sure you want to delete this job?')) {
    try {
      const response = await fetch(`${API_URL}/${jobId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        loadJobs();
        alert('✅ Job deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('❌ Error deleting job');
    }
  }
}

// UPDATE - Edit job (Open edit form)
function editJob(jobId) {
  const job = jobs.find(j => j.id === jobId);
  
  if (job) {
    // Fill form with existing data
    document.getElementById('companyName').value = job.company;
    document.getElementById('jobTitle').value = job.title;
    document.getElementById('location').value = job.location;
    document.getElementById('salary').value = job.salary;
    document.getElementById('description').value = job.description;
    
    // Change button to Update
    const addButton = document.querySelector('.btn-primary');
    addButton.innerHTML = '🔄 Update Job';
    addButton.onclick = function() { updateJob(jobId); };
    
    // Scroll to form
    document.querySelector('.add-job-section').scrollIntoView({ behavior: 'smooth' });
  }
}

// UPDATE - Save edited job
async function updateJob(jobId) {
  const company = document.getElementById('companyName').value;
  const title = document.getElementById('jobTitle').value;
  const location = document.getElementById('location').value;
  const salary = document.getElementById('salary').value;
  const description = document.getElementById('description').value;

  if (company && title && location && salary && description) {
    try {
      const response = await fetch(`${API_URL}/${jobId}`, {
        method: 'PUT',
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
        resetForm();
        loadJobs();
        alert('✅ Job updated successfully!');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      alert('❌ Error updating job');
    }
  } else {
    alert('⚠️ Please fill all fields!');
  }
}

// Reset form after update
function resetForm() {
  clearForm();
  const addButton = document.querySelector('.btn-primary');
  addButton.innerHTML = '🚀 Add Job Opening';
  addButton.onclick = addJob;
}

// Clear form
function clearForm() {
  document.getElementById('companyName').value = '';
  document.getElementById('jobTitle').value = '';
  document.getElementById('location').value = '';
  document.getElementById('salary').value = '';
  document.getElementById('description').value = '';
}

// Add UPDATE route to server.js (Add this to your server.js)
// PUT - Update job
app.put('/api/jobs/:id', (req, res) => {
  const jobId = parseInt(req.params.id);
  const jobIndex = jobs.findIndex(job => job.id === jobId);
  
  if (jobIndex !== -1) {
    jobs[jobIndex] = {
      id: jobId,
      ...req.body
    };
    res.json(jobs[jobIndex]);
  } else {
    res.status(404).json({ message: 'Job not found' });
  }
});

// Enter key support
document.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    const addButton = document.querySelector('.btn-primary');
    if (addButton.innerHTML.includes('Add')) {
      addJob();
    }
  }
});

// Load jobs when page loads
window.onload = loadJobs;