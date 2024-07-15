import express from 'express';
import Job from '../models/job.js';
import Application from '../models/application.js';
import User from '../models/user.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Devolver todos los registros jobs
router.get('/', authenticateToken, async (req, res) => {
  try {
    const jobs = await Job.find({status: 'open'});
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Extraer todos los jobs de un contractor
router.get('/contractor', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail });
    const jobs = await Job.find({ contractor_id: user._id });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create job
// Create job
// Create job
router.post('/createJob', authenticateToken, async (req, res) => {
  const { title, description, area, salary, programming_language } = req.body;

  const contractor_id = req.user._id;

  try {
    const newJob = new Job({
      contractor_id,
      title,
      description,
      area,
      salary,
      programming_language, 
    });

    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Aplicar a un trabajo
router.patch('/:id/applicants', authenticateToken, async (req, res) => {
  try {
    const { status, work_submission } = req.body;
    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail });

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Trabajo no encontrado' });

    const validation = await Application.findOne({ job_id: job._id, talent_id: user._id});
    if(validation)
    {
      throw  new Error("ya tiene un proseso de aplicacion a este trabajo.")
      // res.status(500).json({ message: "Ya tiene un proseso de aplicacion a este trabajo."});
    }
    
    job.applicants.push({ talent_id: user._id, status });
    await job.save();

    const application = new Application({ job_id: job._id, talent_id: user._id, status, work_submission });
    await application.save();

    res.json({ message: 'Aplicación exitosa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Extraer todas las aplicaciones de un talento
router.get('/applications', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail });
    const applications = await Application.find({ talent_id: user._id });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
