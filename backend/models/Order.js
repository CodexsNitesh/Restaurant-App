const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: String,       // snapshot at time of order
  price: Number,      // snapshot at time of order
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  tableNumber: { type: String, required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Served', 'Paid', 'Cancelled'],
    default: 'Pending',
  },
  notes: { type: String, default: '' },
}, { timestamps: true });

// Auto-generate order number before saving
// orderSchema.pre('save', async function (next) {
//   if (!this.orderNumber) {
//     const count = await mongoose.model('Order').countDocuments();
//     this.orderNumber = `ORD-${String(count + 1).padStart(4, '0')}`;
//   }
//   next();
// });

orderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    const unique = Date.now().toString().slice(-6);
    this.orderNumber = `ORD-${unique}`;
  }
  next();
});


module.exports = mongoose.model('Order', orderSchema);