import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  talent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'rejected', 'in_process', 'completed'], default: 'pending' },
  work_submission: { type: String }
});

const Application = mongoose.model('Application', applicationSchema);

export default Application;
