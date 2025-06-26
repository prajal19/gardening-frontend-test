"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Card from '../ui/Card';

const EstimateDetail = ({ estimate }) => {
  const [isAccepting, setIsAccepting] = useState(false);
  
  // Mock data if no estimate provided
  const mockEstimate = {
    id: 1,
    appointmentId: 3,
    customerName: "Robert Davis",
    services: [
      { id: 2, name: "Tree Pruning", quantity: 3, unitPrice: 120, total: 360 }
    ],
    additionalFees: [
      { name: "Debris Removal", amount: 50 }
    ],
    subtotal: 360,
    tax: 36,
    total: 446,
    status: "pending",
    createdAt: "2023-05-18",
    expiresAt: "2023-06-01"
  };
  
  const estimateData = estimate || mockEstimate;
  
  const handleAcceptEstimate = () => {
    setIsAccepting(true);
    
    // In a real app, this would call an API to accept the estimate
    setTimeout(() => {
      alert('Estimate accepted! In a real app, this would process a deposit payment.');
      setIsAccepting(false);
    }, 1500);
  };
  
  return (
    <Container size="sm">
      <div className="py-10">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Estimate #{estimateData.id}</h1>
            <p className="text-gray-600">Created on {estimateData.createdAt}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              estimateData.status === 'pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {estimateData.status === 'pending' ? 'Pending Approval' : 'Approved'}
            </span>
          </div>
        </div>
        
        <Card className="mb-8">
          <Card.Header>
            <h3 className="text-lg font-semibold">Estimate Details</h3>
          </Card.Header>
          
          <Card.Content>
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
              <p className="text-gray-600">{estimateData.customerName}</p>
            </div>
            
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Services</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {estimateData.services.map((service) => (
                      <tr key={service.id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{service.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{service.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">${service.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">${service.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {estimateData.additionalFees.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Additional Fees</h4>
                <div className="space-y-2">
                  {estimateData.additionalFees.map((fee, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{fee.name}</span>
                      <span className="text-gray-900">${fee.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-600">Subtotal</span>
                <span className="text-gray-900">${estimateData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-medium text-gray-600">Tax</span>
                <span className="text-gray-900">${estimateData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-bold">
                <span>Total</span>
                <span>${estimateData.total.toFixed(2)}</span>
              </div>
            </div>
          </Card.Content>
          
          <Card.Footer>
            <div className="text-gray-600 text-sm">
              This estimate is valid until <span className="font-medium">{estimateData.expiresAt}</span>
            </div>
          </Card.Footer>
        </Card>
        
        {estimateData.status === 'pending' && (
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={handleAcceptEstimate}
              disabled={isAccepting}
              className="md:flex-1"
            >
              {isAccepting ? 'Processing...' : 'Approve and Pay Deposit'}
            </Button>
            <Link href="/" className="md:flex-1">
              <Button variant="outline" className="w-full">
                Request Changes
              </Button>
            </Link>
          </div>
        )}
        
        {estimateData.status !== 'pending' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              <span className="font-medium">Estimate Approved!</span> Your appointment has been confirmed. Our team will be in touch with you prior to your scheduled service date.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default EstimateDetail; 