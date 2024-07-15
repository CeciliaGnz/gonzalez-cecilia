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
// Extraer todos los jobs de un contractor
router.get('/contractor', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail });
    const jobs = await Job.find({ contractor_id: user._id }).lean();

    // Obtener los datos de los talentos
    const talentIds = jobs.flatMap(job => job.applicants.map(applicant => applicant.talent_id));
    const uniqueTalentIds = [...new Set(talentIds)];
    const talents = await User.find({ _id: { $in: uniqueTalentIds } }).select('_id username');

    // Mapear los talentos a sus IDs
    const talentMap = {};
    talents.forEach(talent => {
      talentMap[talent._id] = talent.username;
    });

    // Añadir el nombre y la fecha del talento a los postulantes
    jobs.forEach(job => {
      job.applicants = job.applicants.map(applicant => ({
        ...applicant,
        name: talentMap[applicant.talent_id] || 'Unknown',
        date: applicant.date // Asegúrate de incluir la fecha
      }));
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



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

    // Obtener las aplicaciones con detalles del trabajo y del contratista
    const applications = await Application.find({ talent_id: user._id })
  .populate({
    path: 'job_id',
    select: 'title contractor_id',
    match: { status: 'open' }, // Solo trabajos abiertos
    populate: {
      path: 'contractor_id',
      select: 'username'
    }
  });


    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Eliminar una aplicación
router.delete('/applications/:id', authenticateToken, async (req, res) => {
  try {
    const applicationId = req.params.id;
    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail });

    // Verificar que la aplicación pertenezca al usuario
    const application = await Application.findOne({ _id: applicationId, talent_id: user._id });
    if (!application) {
      return res.status(404).json({ message: 'Postulación no encontrada' });
    }

    // Eliminar la aplicación
    await Application.findByIdAndDelete(applicationId);
    
    // También puedes eliminarla del trabajo (opcional)
    await Job.updateOne(
      { _id: application.job_id },
      { $pull: { applicants: { talent_id: user._id } } }
    );

    res.json({ message: 'Postulación eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Aceptar un postulante
// Aceptar un postulante
router.patch('/:id/acceptApplicant', authenticateToken, async (req, res) => {
  try {
      const { acceptedApplicantId } = req.body;
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: 'Trabajo no encontrado' });

      // Cambiar el estado del postulante aceptado a "accepted"
      const applicantIndex = job.applicants.findIndex(applicant => applicant.talent_id.toString() === acceptedApplicantId);
      if (applicantIndex !== -1) {
          job.applicants[applicantIndex].status = 'accepted';
      }

      // Cambiar el estado de los demás postulantes a "rejected"
      job.applicants.forEach((applicant, index) => {
          if (index !== applicantIndex) {
              applicant.status = 'rejected';
          }
      });

      // Cambiar el estado del trabajo a "completed"
      job.status = 'completed';

      await job.save();
      res.json({ message: 'Estado de postulantes y trabajo actualizado.' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});



export default router;
