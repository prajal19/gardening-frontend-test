'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Container from '../../../../components/ui/Container';
import AppointmentDetail from '../../../../components/admin/AppointmentDetail';
import useStore from '../../../../lib/store';

const AppointmentDetailPage = () => {
  const params = useParams();
  const { appointments } = useStore();
  
  // Find the appointment by ID
  const appointment = appointments.find(app => app.id === parseInt(params.id)) || null;
  
  return (
    <div className="py-8">
      <Container>
        <AppointmentDetail appointment={appointment} />
      </Container>
    </div>
  );
};

export default AppointmentDetailPage; 