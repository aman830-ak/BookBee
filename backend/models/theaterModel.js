import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema({
  name: { type: String, default: "Main Hall" },
  rowCount: { type: Number, default: 6 },
  seatsPerRow: { type: Number, default: 8 },
  // NEW: Pricing Configuration
  basePrice: { type: Number, default: 200 }, // The standard price
  reclinerRows: { type: [String], default: ['F'] }, // Rows that are recliners
  premiumRows: { type: [String], default: ['D', 'E'] }, // Mid-section rows
  multipliers: {
    budget: { type: Number, default: 0.8 },   // Front rows are 20% cheaper
    standard: { type: Number, default: 1.0 }, // Middle-front
    premium: { type: Number, default: 1.5 },  // Mid-back
    recliner: { type: Number, default: 2.5 }  // Luxury back rows
  }
});

const Theater = mongoose.models.Theater || mongoose.model('Theater', theaterSchema);
export default Theater;