
import { connectDB, disconnectDB } from '../utils/db';

// Define the Order interface without mongoose specific properties
// This fixes the TypeScript error by creating a browser-compatible version
export interface OrderData {
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
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selectedSize?: string;
    selectedColor?: string;
  }>;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for orders in browser environment
let orders: OrderData[] = [];
let nextOrderId = 1;

export async function createOrder(orderData: {
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
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    selectedSize?: string;
    selectedColor?: string;
  }>;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}): Promise<OrderData> {
  try {
    await connectDB();
    
    // Create an order object with all the required fields
    const order: OrderData = {
      _id: String(nextOrderId++),
      orderNumber: orderData.orderNumber,
      customerInfo: orderData.customerInfo,
      items: orderData.items,
      paymentMethod: orderData.paymentMethod,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to our in-memory storage
    orders.push(order);
    
    console.log('Order created successfully:', order);
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function getOrders(): Promise<OrderData[]> {
  try {
    await connectDB();
    return [...orders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function getOrderById(id: string): Promise<OrderData | null> {
  try {
    await connectDB();
    const order = orders.find(o => o._id === id);
    return order || null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function updateOrderStatus(id: string, status: OrderData['status']): Promise<OrderData | null> {
  try {
    await connectDB();
    const orderIndex = orders.findIndex(o => o._id === id);
    
    if (orderIndex === -1) {
      return null;
    }
    
    const updatedOrder = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date()
    };
    
    orders[orderIndex] = updatedOrder;
    
    return updatedOrder;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}
