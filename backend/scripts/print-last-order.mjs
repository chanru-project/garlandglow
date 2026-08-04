import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import mongoose from 'mongoose';
import { Order } from '../models/Order.js';

const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env');
dotenv.config({ path: envPath });

async function main() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
  const dbName = process.env.MONGODB_DB_NAME || 'duvix';
  await mongoose.connect(mongoUri, { dbName, serverSelectionTimeoutMS: 10000 });

  const order = await Order.findOne().sort({ createdAt: -1 }).lean();
  if (!order) {
    console.log('No orders found');
    process.exit(0);
  }

  console.log('Order id:', order._id.toString());
  console.log('Order number:', order.orderNumber);
  console.log('whatsappSent:', order.whatsappSent);
  console.log('whatsappResponse:');
  console.log(JSON.stringify(order.whatsappResponse, null, 2));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
