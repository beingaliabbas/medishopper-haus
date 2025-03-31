
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { ShippingInfo, CheckoutFormData, PaymentMethod } from '@/types';
import { createOrder } from '@/api/orders';
import { IOrderItem } from '@/models/Order';

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
      zipCode: '',
      state: '', // Added missing fields
      country: '' // Added missing fields
    },
    paymentMethod: 'credit-card' // Fixed to match type
  });
  const [submitting, setIsSubmitting] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const shipping = 10;
  const tax = subtotal * 0.08;

  useEffect(() => {
    setSubtotal(getCartTotal());
  }, [cart, getCartTotal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      shippingInfo: {
        ...prev.shippingInfo,
        [name]: value
      }
    }));
  };

  const handlePaymentMethodChange = (value: PaymentMethod) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: value
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.shippingInfo.fullName || 
        !formData.shippingInfo.email ||
        !formData.shippingInfo.phone ||
        !formData.shippingInfo.address ||
        !formData.shippingInfo.city ||
        !formData.shippingInfo.zipCode ||
        !formData.paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before checking out.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create order items
      const orderItems: IOrderItem[] = cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      }));
      
      // Set default values for state and country if not provided
      const customerInfo = {
        ...formData.shippingInfo,
        state: formData.shippingInfo.state || 'N/A',
        country: formData.shippingInfo.country || 'United States'
      };
      
      // Create order data object
      const orderData = {
        orderNumber: Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
        customerInfo,
        items: orderItems,
        paymentMethod: formData.paymentMethod,
        subtotal,
        shipping,
        tax,
        total: subtotal + shipping + tax
      };
      
      // Submit order to API (note: we removed the status field as it's set by default in the model)
      const result = await createOrder(orderData);
      
      if (result && result._id) {
        // Clear cart and navigate to confirmation page
        localStorage.setItem('lastOrder', JSON.stringify(result));
        clearCart();
        navigate('/order-confirmation');
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast({
        title: "Order Failed",
        description: "Failed to process your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Shipping Information</h2>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input type="text" id="fullName" name="fullName" value={formData.shippingInfo.fullName} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" name="email" value={formData.shippingInfo.email} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input type="tel" id="phone" name="phone" value={formData.shippingInfo.phone} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input type="text" id="address" name="address" value={formData.shippingInfo.address} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input type="text" id="city" name="city" value={formData.shippingInfo.city} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input type="text" id="zipCode" name="zipCode" value={formData.shippingInfo.zipCode} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Payment Method</h2>
            <Separator />
            <RadioGroup defaultValue="credit-card" className="flex flex-col space-y-1 mt-2" onValueChange={handlePaymentMethodChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label htmlFor="credit-card">Credit Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal">PayPal</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <Separator />
            <div className="mt-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${(subtotal + shipping + tax).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmitOrder} disabled={submitting}>
            {submitting ? 'Submitting Order...' : 'Submit Order'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CheckoutPage;
