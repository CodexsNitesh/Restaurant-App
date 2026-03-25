const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
  type: String,
  required: function () {
    return this.orderType === 'dine-in';
  }
},
  capacity: { type: Number, default: 4 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);