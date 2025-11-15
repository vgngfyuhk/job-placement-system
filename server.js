// UPDATE job
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