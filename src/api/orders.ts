
import Order, { IOrder } from '../models/Order';
import { connectDB, disconnectDB } from '../utils/db';

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
}): Promise<IOrder> {
  try {
    await connectDB();
    const order = new Order({
      ...orderData,
      status: 'confirmed'
    });
    await order.save();
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function getOrders(): Promise<IOrder[]> {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function getOrderById(id: string): Promise<IOrder | null> {
  try {
    await connectDB();
    const order = await Order.findById(id);
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}

export async function updateOrderStatus(id: string, status: IOrder['status']): Promise<IOrder | null> {
  try {
    await connectDB();
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return order;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
}
