const express = require('express');
const Job = require('../models/job');
const Application = require('../models/application');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Devolver todos los registros jobs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const jobs = await Job.find().select('-applicants');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Extraer todos los jobs de un contractor
router.get('/contractor/:contractor_id', authenticateToken, async (req, res) => {
  try {
    const jobs = await Job.find({ contractor_id: req.params.contractor_id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Aplicar a una trabajo.
router.patch('/:id/applicants', authenticateToken, async (req, res) => {
  try {
    const { talent_id, status, work_submission } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Trabajo no encontrado' });

    job.applicants.push({ talent_id, status });
    await job.save();

    const application = new Application({ job_id: job._id, talent_id, status, work_submission });
    await application.save();

    res.json({ message: 'Aplicación exitosa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Extraer todos las aplicacciones de un talento.
router.get('/applications/:talent_id', authenticateToken, async (req, res) => {
  try {
    const applications = await Application.find({ talent_id: req.params.talent_id });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
