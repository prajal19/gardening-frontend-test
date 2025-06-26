'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Container from '../../components/ui/Container';
import CreateEstimateForm from '../../components/admin/CreateEstimateForm';

const EstimateFormWithAppointment = () => {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointment');
  
  return <CreateEstimateForm appointmentId={appointmentId} />;
};

const CreateEstimatePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Reduced bottom margin from mb-12 to mb-8 */}
        <div className="text-center mb-4 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl bg-clip-text bg-gradient-to-r from-green-600 to-green-600 tracking-tight">
            Create New Estimate
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Generate professional estimates with all necessary details in just a few clicks
          </p>
        </div>
        
        {/* Form section remains unchanged */}
        <div className="">
          <div className="p-6 sm:p-8">
            <Suspense fallback={
              <div className="py-16 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading estimate form...</p>
                <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-green-300 to-green-300 h-full animate-progress"></div>
                </div>
              </div>
            }>
              <EstimateFormWithAppointment />
            </Suspense>
          </div>  
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CreateEstimatePage;