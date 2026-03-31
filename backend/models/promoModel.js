import mongoose from 'mongoose';

const promoSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discountPercent: { type: Number, required: true }, // e.g., 20 for 20% off
  isActive: { type: Boolean, default: true }
});

const Promo = mongoose.models.Promo || mongoose.model('Promo', promoSchema);
export default Promo;