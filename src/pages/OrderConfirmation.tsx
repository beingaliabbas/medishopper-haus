
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Calendar } from 'lucide-react';

const OrderConfirmation = () => {
  const orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </span>
            <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
            <p className="mt-2 text-lg text-gray-600">
              Thank you for your purchase
            </p>
            <p className="mt-2 text-medical-600 font-medium">
              Order #{orderNumber}
            </p>
          </div>
          
          <Card className="mb-8 border-medical-100 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-center text-gray-800">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-medical-100 flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-medical-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Confirmed</h3>
                  <p className="text-sm text-gray-500">Your order is confirmed</p>
                </div>
                
                <div className="hidden md:block w-24 h-0.5 bg-medical-200"></div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900">Processing</h3>
                  <p className="text-sm text-gray-500">We're preparing your order</p>
                </div>
                
                <div className="hidden md:block w-24 h-0.5 bg-gray-200"></div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <Truck className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium text-gray-900">Shipped</h3>
                  <p className="text-sm text-gray-500">Your package is on its way</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8 border-medical-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600">
              <p className="mb-4">
                We've sent a confirmation email with order details to your registered email address.
                You'll receive another notification when your order ships.
              </p>
              <div className="bg-medical-50 p-4 rounded-lg border border-medical-100 mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="h-5 w-5 text-medical-600" />
                  <span className="font-medium text-gray-800">Estimated Delivery</span>
                </div>
                <p className="text-sm text-gray-600 pl-8">
                  Your order should arrive in 3-5 business days
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
              <Button variant="outline" asChild className="border-medical-200 hover:bg-medical-50">
                <Link to="/products">Continue Shopping</Link>
              </Button>
              <Button asChild className="bg-medical-600 hover:bg-medical-700">
                <Link to="/">Return Home</Link>
              </Button>
            </CardFooter>
          </Card>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Having issues with your order? <Link to="/contact" className="text-medical-600 hover:text-medical-700 font-medium">Contact our support team</Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
