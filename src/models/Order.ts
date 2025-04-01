
import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
}

// For browser compatibility, we need to separate the Document interface
export interface IOrder {
  _id: string;
  orderNumber: string;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: IOrderItem[];
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
}

// These Schema definitions would be used in a Node.js environment
// They are kept here for reference and for potential server-side code
const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  selectedSize: { type: String },
  selectedColor: { type: String }
});

const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerInfo: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  items: [OrderItemSchema],
  paymentMethod: { type: String, required: true },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['confirmed', 'processing', 'shipped', 'delivered'],
    default: 'confirmed'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// This would only work in a Node.js environment
// For browser, we're using our in-memory implementation
const Order = mongoose.models.Order || mongoose.model<IOrder & Document>('Order', OrderSchema);

export default Order;
