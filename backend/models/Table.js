const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, default: 4 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);