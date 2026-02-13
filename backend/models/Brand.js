// Brand.js
import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  brand_id: String,
  name: String,
  is_active: { type: Boolean, default: true }
}, { collection: 'phone_brands' }); // 👈 nombre de colección igual que FastAPI

export default mongoose.model('Brand', brandSchema);