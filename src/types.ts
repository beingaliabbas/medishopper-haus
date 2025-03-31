
export interface Product {
  id: string;
  name: string;
  category: 'scrubs' | 'aprons' | 'ot-dresses' | 'stethoscopes';
  price: number;
  image: string;
  images?: string[];
  shortDescription: string;
  description: string;
  features?: string[];
  sizes?: string[];
  colors?: string[];
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export type PaymentMethod = 'credit-card' | 'paypal' | 'cash-on-delivery';

export interface CheckoutFormData {
  shippingInfo: ShippingInfo;
  paymentMethod: PaymentMethod;
}
