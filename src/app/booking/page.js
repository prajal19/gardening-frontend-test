// 'use client';

// import React, { useState } from 'react';
// import Container from '../../components/ui/Container';
// import ServiceSelection from '../../components/booking/ServiceSelection';
// import DateTimeSelection from '../../components/booking/DateTimeSelection';
// import CustomerDetails from '../../components/booking/CustomerDetails';
// import BookingReview from '../../components/booking/BookingReview';

// const BookingPage = () => {
//   const [step, setStep] = useState(1);
  
//   // Progress steps
//   const steps = [
//     { id: 1, label: 'Service' },
//     { id: 2, label: 'Schedule' },
//     { id: 3, label: 'Details' },
//     { id: 4, label: 'Review' }
//   ];
  
//   const nextStep = () => setStep(current => Math.min(current + 1, steps.length));
//   const prevStep = () => setStep(current => Math.max(current - 1, 1));
  
//   return (
//     <div className="bg-gray-50 py-10">
//       <Container>
//         <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
//           {/* Progress indicator */}
//           <div className="mb-10">
//             <div className="flex items-center justify-between">
//               {steps.map((s) => (
//                 <React.Fragment key={s.id}>
//                   {/* Step circle */}
//                   <div className="relative">
//                     <div
//                       className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
//                         step >= s.id
//                           ? 'bg-green-600 border-green-600 text-white'
//                           : 'border-gray-300 text-gray-500'
//                       }`}
//                     >
//                       {step > s.id ? (
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-5 w-5"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       ) : (
//                         s.id
//                       )}
//                     </div>
//                     <span
//                       className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap ${
//                         step >= s.id ? 'text-green-600 font-medium' : 'text-gray-500'
//                       }`}
//                     >
//                       {s.label}
//                     </span>
//                   </div>
                  
//                   {/* Connector line */}
//                   {s.id < steps.length && (
//                     <div
//                       className={`flex-1 h-0.5 mx-3 ${
//                         step > s.id ? 'bg-green-600' : 'bg-gray-300'
//                       }`}
//                     ></div>
//                   )}
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>
          
//           {/* Step content */}
//           <div className="mt-12">
//             {step === 1 && <ServiceSelection onNext={nextStep} />}
//             {step === 2 && <DateTimeSelection onNext={nextStep} onBack={prevStep} />}
//             {step === 3 && <CustomerDetails onNext={nextStep} onBack={prevStep} />}
//             {step === 4 && <BookingReview onBack={prevStep} />}
//           </div>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default BookingPage; 
'use client';
export const dynamic = 'force-dynamic'; // Prevents static pre-rendering issues

import React, { useState, Suspense } from 'react';
import Container from '../../components/ui/Container';
import ServiceSelection from '../../components/booking/ServiceSelection';
import DateTimeSelection from '../../components/booking/DateTimeSelection';
import CustomerDetails from '../../components/booking/CustomerDetails';
import BookingReview from '../../components/booking/BookingReview';

const BookingPage = () => {
  const [step, setStep] = useState(1);
 

  const steps = [
    { id: 1, label: 'Service' },
    { id: 2, label: 'Schedule' },
    { id: 3, label: 'Details' },
    { id: 4, label: 'Review' }
  ];

  const nextStep = () => setStep(current => Math.min(current + 1, steps.length));
  const prevStep = () => setStep(current => Math.max(current - 1, 1));

  return (
    <div className="bg-gray-50 py-10">
      <Container>
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">

          {/* Progress indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {steps.map((s) => (
                <React.Fragment key={s.id}>
                  {/* Step circle */}
                  <div className="relative">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${
                        step >= s.id
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'border-gray-300 text-gray-500'
                      }`}
                    >
                      {step > s.id ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        s.id
                      )}
                    </div>
                    <span
                      className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap ${
                        step >= s.id ? 'text-green-600 font-medium' : 'text-gray-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {/* Connector line */}
                  {s.id < steps.length && (
                    <div
                      className={`flex-1 h-0.5 mx-3 ${
                        step > s.id ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="mt-12">
            {step === 1 && (
              <Suspense fallback={<div>Loading...</div>}>
                <ServiceSelection onNext={nextStep} />
              </Suspense>
            )}
            {step === 2 && (
              <Suspense fallback={<div>Loading...</div>}>
                <DateTimeSelection onNext={nextStep} onBack={prevStep} />
              </Suspense>
            )}
            {step === 3 && (
              <Suspense fallback={<div>Loading...</div>}>
                <CustomerDetails onNext={nextStep} onBack={prevStep} />
              </Suspense>
            )}
            {step === 4 && (
              <Suspense fallback={<div>Loading...</div>}>
                <BookingReview onBack={prevStep} />
              </Suspense>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BookingPage;
