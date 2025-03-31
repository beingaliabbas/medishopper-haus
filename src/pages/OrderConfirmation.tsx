
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';

const OrderConfirmation = () => {
  const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="flex justify-center">
              <CheckCircle className="h-20 w-20 text-green-500" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">Order Confirmed!</h1>
            <p className="mt-2 text-lg text-gray-600">
              Thank you for your purchase
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Order #{orderNumber}
            </p>
          </div>
          
          <div>
            <p className="text-gray-600">
              We've sent a confirmation email with order details and tracking information to your email address.
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-base font-medium text-gray-900 mb-2">What's Next?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Your order is being processed and will be shipped soon. You'll receive updates on your order status via email.
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
              <Button asChild className="bg-medical-600 hover:bg-medical-700">
                <Link to="/">Return Home</Link>
              </Button>
            </div>
          </div>
          
          <div className="mt-10">
            <p className="text-xs text-gray-500">
              Having issues with your order? <a href="/contact" className="text-medical-600 hover:text-medical-500">Contact our support team</a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
