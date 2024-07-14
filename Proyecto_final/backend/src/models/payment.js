const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  contractor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  talent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
