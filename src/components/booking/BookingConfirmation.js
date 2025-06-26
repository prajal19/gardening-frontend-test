import React from 'react';
import Link from 'next/link';
import Container from '../ui/Container';
import Button from '../ui/Button';
import Card from '../ui/Card';

const BookingConfirmation = () => {
  return (
    <Container size="sm">
      <div className="py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-green-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Submitted!</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Thank you for choosing Green Gardens. We've received your booking request.
        </p>
        
        <Card className="mb-8 text-left">
          <Card.Content>
            <h3 className="font-medium text-gray-900 mb-4 text-lg">What happens next?</h3>
            <ul className="space-y-4">
              <li className="flex">
                <div className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm font-medium">1</span>
                </div>
                <p className="text-gray-600">
                  Our team will review your service request within 24-48 hours.
                </p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm font-medium">2</span>
                </div>
                <p className="text-gray-600">
                  We'll contact you to confirm details and provide a detailed estimate.
                </p>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-sm font-medium">3</span>
                </div>
                <p className="text-gray-600">
                  Once you approve the estimate, your appointment will be confirmed.
                </p>
              </li>
            </ul>
          </Card.Content>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">
              Return to Home
            </Button>
          </Link>
          <Link href="/booking">
            <Button>
              Book Another Service
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default BookingConfirmation; 