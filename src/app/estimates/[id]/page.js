'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import EstimateDetail from '../../../components/estimates/EstimateDetail';
import useStore from '../../../lib/store';

const EstimatePage = () => {
  const params = useParams();
  const { estimates } = useStore();
  
  // Find the estimate by ID
  const estimate = estimates.find(est => est.id === parseInt(params.id)) || null;
  
  return <EstimateDetail estimate={estimate} />;
};

export default EstimatePage; 