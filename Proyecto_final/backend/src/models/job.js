const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  contractor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  area: { type: String, required: true },
  programming_language: { type: String, required: true },
  salary: { type: Number, required: true },
  status: { type: String, enum: ['open', 'in_process', 'completed'], default: 'open' },
  applicants: [
    {
      talent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['pending', 'rejected', 'in_process', 'completed'], default: 'pending' }
    }
  ]
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
