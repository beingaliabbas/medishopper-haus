import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/components/ui/use-toast';
import { ShippingInfo, CheckoutFormData, PaymentMethod } from '@/types';
import { createOrder } from '@/api/orders';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    paymentMethod: 'credit-card',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const subtotal = getCartTotal();
  const shipping = subtotal > 75 ? 0 : 15;
  const tax = subtotal * 0.07; // Assuming 7% tax rate
  const total = subtotal + shipping + tax;
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ShippingInfo
  ) => {
    setFormData({
      ...formData,
      shippingInfo: {
        ...formData.shippingInfo,
        [field]: e.target.value,
      },
    });
  };
  
  const handlePaymentMethodChange = (value: PaymentMethod) => {
    setFormData({
      ...formData,
      paymentMethod: value,
    });
  };
  
  const validateForm = (): boolean => {
    const { shippingInfo } = formData;
    
    // Basic validation
    if (
      !shippingInfo.fullName ||
      !shippingInfo.email ||
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zipCode ||
      !shippingInfo.country
    ) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingInfo.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order data object
      const orderData = {
        orderNumber: Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
        customerInfo: formData.shippingInfo,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor
        })),
        paymentMethod: formData.paymentMethod,
        subtotal,
        shipping,
        tax,
        total
      };
      
      // Save order to MongoDB
      await createOrder(orderData);
      
      clearCart();
      
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your order. We'll process it right away.",
      });
      
      navigate('/order-confirmation', { state: { orderNumber: orderData.orderNumber } });
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-7">
                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.shippingInfo.fullName}
                        onChange={(e) => handleInputChange(e, 'fullName')}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.shippingInfo.email}
                        onChange={(e) => handleInputChange(e, 'email')}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.shippingInfo.phone}
                        onChange={(e) => handleInputChange(e, 'phone')}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.shippingInfo.address}
                        onChange={(e) => handleInputChange(e, 'address')}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.shippingInfo.city}
                        onChange={(e) => handleInputChange(e, 'city')}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="state">State / Province</Label>
                      <Input
                        id="state"
                        value={formData.shippingInfo.state}
                        onChange={(e) => handleInputChange(e, 'state')}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="zipCode">Postal Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.shippingInfo.zipCode}
                        onChange={(e) => handleInputChange(e, 'zipCode')}
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.shippingInfo.country}
                        onChange={(e) => handleInputChange(e, 'country')}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Method</h2>
                  
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handlePaymentMethodChange(value as PaymentMethod)}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex-1">
                        <div className="flex justify-between items-center">
                          <span>Credit Card</span>
                          <div className="flex space-x-2">
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                            <div className="w-8 h-5 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                      <Label htmlFor="cash-on-delivery">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>
                  
                  {formData.paymentMethod === 'credit-card' && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="•••• •••• •••• ••••"
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiration-date">Expiration Date</Label>
                          <Input
                            id="expiration-date"
                            placeholder="MM/YY"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="•••"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-5 mt-8 lg:mt-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-20">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="flow-root max-h-64 overflow-y-auto mb-6">
                    <ul className="-my-4 divide-y divide-gray-200">
                      {cart.map((item) => (
                        <li key={item.id} className="py-4 flex">
                          <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.selectedSize && `Size: ${item.selectedSize}`}
                              {item.selectedSize && item.selectedColor && ' / '}
                              {item.selectedColor && `Color: ${item.selectedColor}`}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="ml-4 text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <dl className="-my-4 divide-y divide-gray-200">
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-gray-600">Subtotal</dt>
                      <dd className="font-medium">${subtotal.toFixed(2)}</dd>
                    </div>
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-gray-600">Shipping</dt>
                      <dd className="font-medium">
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                      </dd>
                    </div>
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-gray-600">Tax</dt>
                      <dd className="font-medium">${tax.toFixed(2)}</dd>
                    </div>
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-base font-medium text-gray-900">Total</dt>
                      <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
                    </div>
                  </dl>
                  
                  <div className="mt-6">
                    <Button 
                      type="submit"
                      className="w-full bg-medical-600 hover:bg-medical-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                  
                  <p className="mt-6 text-center text-sm text-gray-500">
                    By placing your order, you agree to our{' '}
                    <a href="/terms" className="text-medical-600 hover:text-medical-500">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-medical-600 hover:text-medical-500">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
