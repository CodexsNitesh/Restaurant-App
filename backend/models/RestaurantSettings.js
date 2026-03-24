const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'My Restaurant' },
  logo: { type: String, default: '' },
  banner: { type: String, default: '' },
  currency: { type: String, default: '₹' },
  gstEnabled: { type: Boolean, default: false },
  gstPercent: { type: Number, default: 5 },
  serviceChargeEnabled: { type: Boolean, default: false },
  serviceChargePercent: { type: Number, default: 10 },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('RestaurantSettings', settingsSchema);