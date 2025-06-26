// "use client";

// import React, { useState, useEffect } from 'react';
// import Button from '../ui/Button';
// import Card from '../ui/Card';
// import useStore from '../../lib/store';
// import TimeSlotPicker from '../ui/TimeSlotPicker';
// import { useSearchParams } from 'next/navigation';

// const DateTimeSelection = ({ onNext, onBack }) => {
//   const { currentBooking, updateCurrentBooking } = useStore();
//   const [selectedDate, setSelectedDate] = useState(currentBooking.appointmentDate || '');
//   const [selectedFrequency, setSelectedFrequency] = useState(currentBooking.frequency || 'one-time');
//   const [errorMessage, setErrorMessage] = useState('');

//   const searchParams = useSearchParams();
//   const frequencies = [
//     { id: 'one-time', label: 'One-Time Service' },
//     { id: 'weekly', label: 'Weekly' },
//     { id: 'bi-weekly', label: 'Bi-Weekly' },
//     { id: 'monthly', label: 'Monthly' }
//   ];

//   useEffect(() => {
//   const urlDate = searchParams.get('appointmentDate');
//   const urlSlot = searchParams.get('timeSlot');
//   const urlServiceId = searchParams.get('serviceId');

//   // Reset if a different service is being selected
//   if (urlServiceId && urlServiceId !== currentBooking.serviceId) {
//     updateCurrentBooking({
//       serviceId: urlServiceId,
//       appointmentDate: '',
//       timeSlot: '',
//       startTime: '',
//       endTime: '',
//       frequency: 'one-time'
//     });
//     setSelectedDate('');
//     setSelectedFrequency('one-time');
//     return; // Exit early to avoid applying old slot/date
//   }

//   // Apply from URL if booking not already filled
//   if (urlDate && !currentBooking.appointmentDate) {
//     setSelectedDate(urlDate);
//     updateCurrentBooking({ appointmentDate: urlDate });
//   }

//   if (urlSlot && !currentBooking.timeSlot) {
//     updateCurrentBooking({ timeSlot: urlSlot });
//   }

//   if (
//     urlDate && urlSlot &&
//     !currentBooking.appointmentDate &&
//     !currentBooking.timeSlot
//   ) {
//     updateCurrentBooking({ appointmentDate: urlDate, timeSlot: urlSlot });
//   }
// }, [searchParams, currentBooking, updateCurrentBooking]);



//   const handleTimeSelect = (startTime, endTime) => {
//     updateCurrentBooking({ 
//       startTime,
//       endTime,
//       timeSlot: `${startTime} - ${endTime}`
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!selectedDate || !currentBooking.timeSlot) {
//       setErrorMessage("Please select both a date and a time slot.");
//       return;
//     }
//     updateCurrentBooking({
//       appointmentDate: selectedDate,
//       frequency: selectedFrequency
//     });
//     onNext();
//   };

//   return (
//     <div className="py-4 sm:py-6 md:py-8 px-4 sm:px-6">
//       <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Schedule Your Service</h2>

//       {errorMessage && (
//         <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md bg-red-100 text-red-700 border border-red-300 text-sm sm:text-base">
//           {errorMessage}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
//           <div>
//             <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Select a Date</h3>
//             <Card className="p-3 sm:p-4">
//               <div className="mb-3 sm:mb-4">
//                 <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                   Service Date
//                 </label>
//                 <input
//                   type="date"
//                   id="date"
//                   className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   required
//                   min={new Date().toISOString().split('T')[0]}
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                   Service Frequency
//                 </label>
//                 <div className="space-y-1 sm:space-y-2">
//                   {frequencies.map((frequency) => (
//                     <label
//                       key={frequency.id}
//                       className="flex items-center p-2 sm:p-3 border rounded-md cursor-pointer hover:bg-gray-50 text-sm sm:text-base"
//                     >
//                       <input
//                         type="radio"
//                         name="frequency"
//                         value={frequency.id}
//                         checked={selectedFrequency === frequency.id}
//                         onChange={() => setSelectedFrequency(frequency.id)}
//                         className="h-4 w-4 text-green-600 focus:ring-green-500 mr-2 sm:mr-3"
//                       />
//                       <span>{frequency.label}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </Card>
//           </div>

//           <div>
//             <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-4">Select a Time Slot</h3>
//             <Card className="p-3 sm:p-4">
//               <TimeSlotPicker 
//                 selectedDate={selectedDate}
//                 onTimeSelect={handleTimeSelect}
//                 selectedSlot={currentBooking.timeSlot}
//                 serviceId={currentBooking.serviceId}
//               />
//             </Card>
//           </div>
//         </div>

//         <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0">
//           <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">
//             Back to Services
//           </Button>
//           <Button
//             type="submit"
//             className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-2 px-4 sm:px-6 rounded-lg disabled:opacity-50"
//           >
//             Continue to Details
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default DateTimeSelection;





"use client";

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import useStore from '../../lib/store';
import TimeSlotPicker from '../ui/TimeSlotPicker';
import { useSearchParams } from 'next/navigation';

const DateTimeSelection = ({ onNext, onBack }) => {
  const { currentBooking, updateCurrentBooking } = useStore();
  const [selectedDate, setSelectedDate] = useState(currentBooking.appointmentDate || '');
  const [selectedFrequency, setSelectedFrequency] = useState(currentBooking.frequency || 'one-time');
  const [errorMessage, setErrorMessage] = useState('');

  const searchParams = useSearchParams();
  const frequencies = [
    { id: 'one-time', label: 'One-Time Service' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'bi-weekly', label: 'Bi-Weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];

  useEffect(() => {
    const urlDate = searchParams.get('appointmentDate');
    const urlSlot = searchParams.get('timeSlot');
    const urlServiceId = searchParams.get('serviceId');

    // Reset if a different service is being selected
    if (urlServiceId && urlServiceId !== currentBooking.serviceId) {
      updateCurrentBooking({
        serviceId: urlServiceId,
        appointmentDate: '',
        timeSlot: '',
        startTime: '',
        endTime: '',
        frequency: 'one-time'
      });
      setSelectedDate('');
      setSelectedFrequency('one-time');
      return;
    }

    // Apply from URL if booking not already filled
    if (urlDate && !currentBooking.appointmentDate) {
      setSelectedDate(urlDate);
      updateCurrentBooking({ appointmentDate: urlDate });
    }

    if (urlSlot && !currentBooking.timeSlot) {
      updateCurrentBooking({ timeSlot: urlSlot });
    }

    if (urlDate && urlSlot && !currentBooking.appointmentDate && !currentBooking.timeSlot) {
      updateCurrentBooking({ appointmentDate: urlDate, timeSlot: urlSlot });
    }
  }, [searchParams, currentBooking, updateCurrentBooking]);


  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    
    // Clear ALL time-related booking data when date changes
    updateCurrentBooking({
      appointmentDate: newDate,
      timeSlot: '',
      startTime: '',
      endTime: ''
    });
    
    // Also clear any error messages
    setErrorMessage('');
  };

  const handleTimeSelect = (startTime, endTime) => {
    updateCurrentBooking({ 
      startTime,
      endTime,
      timeSlot: `${startTime} - ${endTime}`,
      appointmentDate: selectedDate // Ensure date is always in sync
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate || !currentBooking.timeSlot) {
      setErrorMessage("Please select both a date and a time slot.");
      return;
    }
    updateCurrentBooking({
      appointmentDate: selectedDate,
      frequency: selectedFrequency
    });
    onNext();
  };

  return (
    <div className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-green-800">
        Schedule Your Service
      </h2>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm sm:text-base flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Date Selection Card */}
          <Card className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-green-700 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Select a Date
            </h3>
            
            <div className="mb-5">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Service Date
              </label>
              <div className="relative">
                 <input
    type="date"
    id="date"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-base transition-all"
    value={selectedDate}
    onChange={handleDateChange} // Use the handler instead of inline function
    required
    min={new Date().toISOString().split('T')[0]}
  />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Service Frequency
              </label>
              <div className="space-y-2">
                {frequencies.map((frequency) => (
                  <label
                    key={frequency.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="frequency"
                      value={frequency.id}
                      checked={selectedFrequency === frequency.id}
                      onChange={() => setSelectedFrequency(frequency.id)}
                      className="h-5 w-5 text-green-600 focus:ring-green-500 mr-3"
                    />
                    <span className="text-base">{frequency.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>

          {/* Time Slot Selection Card */}
          <Card className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-green-700 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Select a Time Slot
            </h3>
            
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 flex items-center justify-center space-x-4">
                <span className="flex items-center">
                  <span className="text-2xl mr-1">🌲</span> Available
                </span>
                <span className="flex items-center">
                  <span className="text-2xl mr-1">🪵</span> Booked
                </span>
              </p>
            </div>
            
            <TimeSlotPicker 
              selectedDate={selectedDate}
               
              onTimeSelect={handleTimeSelect}
              selectedSlot={currentBooking.timeSlot}
              serviceId={currentBooking.serviceId}
              theme="tree"
            />
          </Card>
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack} 
            className="w-full sm:w-auto py-3 px-6 text-base flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Services
          </Button>
          
          <Button
            type="submit"
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg text-base font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center"
          >
            Continue to Details
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DateTimeSelection;