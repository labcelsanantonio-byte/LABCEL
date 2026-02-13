// Model.js
import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
  model_id: String,
  brand_id: String,
  name: String,
  is_active: { type: Boolean, default: true }
}, { collection: 'phone_models' }); // 👈 nombre de colección igual que FastAPI

export default mongoose.model('Model', modelSchema);
