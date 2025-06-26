import React from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import Card from '../ui/Card';

const AppointmentDetail = ({ appointment }) => {
  if (!appointment) {
    return <div>No appointment data available</div>;
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending-estimate':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Pending Estimate</span>;
      case 'scheduled':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Scheduled</span>;
      case 'completed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Completed</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Appointment #{appointment._id}</h2>
          <p className="text-gray-600 text-sm mt-1">
            {appointment.service?.name} - {new Date(appointment.date).toLocaleDateString()}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          {getStatusBadge(appointment.status)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Customer Information</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Name</h4>
                <p className="mt-1">{appointment.customer?.user?.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="mt-1">{appointment.customer?.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                <p className="mt-1">{appointment.customer?.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Address</h4>
                <p className="mt-1">{appointment.address}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold">Service Details</h3>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Service</h4>
                <p className="mt-1">{appointment.service?.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Date</h4>
                <p className="mt-1">{new Date(appointment.date).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Time</h4>
                <p className="mt-1">
                  {appointment.timeSlot ? 
                    `${appointment.timeSlot.startTime} - ${appointment.timeSlot.endTime}` :
                    `${appointment.startTime} - ${appointment.endTime}`
                  }
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Frequency</h4>
                <p className="mt-1">{appointment.recurringType || 'One-time'}</p>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
      
      {appointment.notes && (
        <Card className="mb-8">
          <Card.Header>
            <h3 className="text-lg font-semibold">Notes</h3>
          </Card.Header>
          <Card.Content>
            <p className="text-gray-700">{appointment.notes}</p>
          </Card.Content>
        </Card>
      )}
      
      {appointment.photos && appointment.photos.length > 0 && (
        <Card className="mb-8">
          <Card.Header>
            <h3 className="text-lg font-semibold">Property Photos</h3>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {appointment.photos.map((photo, index) => (
                <div key={index} className="bg-gray-200 rounded-md aspect-[4/3] flex items-center justify-center">
                  {photo.url ? (
                    <img
                      src={photo.url}
                      alt={`Property photo ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-500">Photo {index + 1}</span>
                  )}
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        
        {appointment.status === 'pending-estimate' && (
          <Link href={`/admin/create-estimate?appointment=${appointment._id}`}>
            <Button>
              Create Estimate
            </Button>
          </Link>
        )}
        
        {appointment.status === 'scheduled' && (
          <Button>
            Mark as Completed
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppointmentDetail; 