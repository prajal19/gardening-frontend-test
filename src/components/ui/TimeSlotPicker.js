// // TimeSlotPicker.jsx
// 'use client';

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const TimeSlotPicker = ({ selectedDate, onTimeSelect, selectedSlot, serviceId }) => {
//     const [availableSlots, setAvailableSlots] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
//     useEffect(() => {
//       const fetchAvailableSlots = async () => {
//         if (!selectedDate || !serviceId) return;
        
//         try {
//           setLoading(true);
//           const response = await axios.get(
//             `${API_URL}/appointments/availability?date=${selectedDate}&serviceId=${serviceId}`
//           );
//           setAvailableSlots(response.data.data);
//         } catch (error) {
//           console.error('Error fetching time slots:', error);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchAvailableSlots();
//     }, [selectedDate, serviceId]);
  
//   return (
//     <div className="grid grid-cols-2 gap-3">
//       {loading ? (
//         <div className="col-span-2 text-center py-4">Loading available slots...</div>
//       ) : availableSlots.length > 0 ? (
//         availableSlots.map((slot) => (
//           <button
//             key={slot.start}
//             type="button"
//             onClick={() => onTimeSelect(slot.start, slot.end)}
//             className={`p-3 text-center rounded-md border ${
//               selectedSlot === `${slot.start} - ${slot.end}`
//                 ? 'bg-green-500 text-white border-green-600'
//                 : 'bg-white hover:bg-gray-50 border-gray-300'
//             }`}
//           >
//             {new Date(`2000-01-01T${slot.start}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
//             {new Date(`2000-01-01T${slot.end}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//           </button>
//         ))
//       ) : (
//         <div className="col-span-2 text-center py-4 text-gray-500">
//           No available time slots for this date
//         </div>
//       )}
//     </div>
//   );
// };

// export default TimeSlotPicker;


// "use client";

// import React, { useState, useEffect } from 'react';
// import Button from '../ui/Button';

// const TimeSlotPicker = ({ selectedDate, onTimeSelect, selectedSlot, serviceId, theme }) => {
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

//   useEffect(() => {
//     if (selectedDate && serviceId) {
//       fetchTimeSlots();
//     } else {
//       setTimeSlots([]);
//     }
//   }, [selectedDate, serviceId]);

//   const fetchTimeSlots = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(
//         `${API_URL}/appointments/availability?date=${selectedDate}&serviceId=${serviceId}`
//       );
      
//       if (!response.ok) throw new Error('Failed to fetch time slots');
      
//       const data = await response.json();
      
//       if (data.success) {
//         // Process slots with consistent naming
//         let processedSlots = data.data.map(slot => ({
//           start: slot.startTime,
//           end: slot.endTime,
//           available: slot.available
//         })).sort((a, b) => a.start.localeCompare(b.start));

//         // Additional client-side validation for today's date
//         const today = new Date().toISOString().split('T')[0];
//         const isToday = selectedDate === today;
        
//         if (isToday) {
//           const currentTime = new Date();
//           const currentHours = currentTime.getHours();
//           const currentMinutes = currentTime.getMinutes();
          
//           processedSlots = processedSlots.filter(slot => {
//             const [hours, minutes] = slot.start.split(':').map(Number);
//             // Only keep slots that start after current time
//             return hours > currentHours || 
//                   (hours === currentHours && minutes > currentMinutes);
//           });
//         }
        
//         setTimeSlots(processedSlots);
//       } else {
//         throw new Error(data.message || 'No time slots available');
//       }
//     } catch (err) {
//       console.error('Error fetching time slots:', err);
//       setError(err.message);
//       setTimeSlots([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Rest of your component remains the same...
//   const getSlotEmoji = (available) => {
//     if (theme === 'tree') {
//       return available ? '🌲' : '🪵';
//     }
//     return available ? '✅' : '❌';
//   };

//   const getSlotVariant = (slot) => {
//     const currentSlot = `${slot.start} - ${slot.end}`;
//     if (selectedSlot === currentSlot && selectedDate) {
//       return 'primary';
//     }
//     return slot.available ? 'outline' : 'disabled';
//   };
  
//   return (
//     <div className="space-y-4">
//       {loading && (
//         <div className="flex flex-col items-center justify-center py-6">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-3"></div>
//           <p className="text-gray-600">Loading available time slots...</p>
//         </div>
//       )}
      
//       {error && (
//         <div className="p-3 bg-red-50 rounded-lg text-red-600 flex items-center">
//           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           {error}
//         </div>
//       )}
      
//       <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//         {timeSlots.map((slot) => (
//           <Button
//             key={`${slot.start}-${slot.end}`}
//             type="button"
//             variant={getSlotVariant(slot)}
//             onClick={() => slot.available && onTimeSelect(slot.start, slot.end)}
//             disabled={!slot.available}
//             className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all h-16 w-full ${
//               slot.available ? 'hover:shadow-md hover:-translate-y-0.5' : ''
//             }`}
//           >
//             <span className="text-3xl mb-1">{getSlotEmoji(slot.available)}</span>
//             <span className="text-sm font-medium">
//               {slot.start} - {slot.end}
//             </span>
//             {!slot.available && (
//               <span className="text-xs mt-1 text-gray-500">Booked</span>
//             )}
//           </Button>
//         ))}
//       </div>
      
//       {!loading && timeSlots.length === 0 && !error && (
//         <div className="text-center py-6 bg-gray-50 rounded-lg">
//           <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <p className="text-gray-600">Please select a date to see available time slots</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TimeSlotPicker;






"use client";

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

const TimeSlotPicker = ({ selectedDate, onTimeSelect, selectedSlot, serviceId, theme }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (selectedDate && serviceId) {
      fetchTimeSlots();
    } else {
      setTimeSlots([]);
    }
  }, [selectedDate, serviceId]);

  const fetchTimeSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/appointments/availability?date=${selectedDate}&serviceId=${serviceId}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch time slots');
      
      const data = await response.json();
      
      if (data.success) {
        let processedSlots = data.data.map(slot => ({
          start: slot.startTime,
          end: slot.endTime,
          available: slot.available
        })).sort((a, b) => a.start.localeCompare(b.start));

        const today = new Date().toISOString().split('T')[0];
        const isToday = selectedDate === today;
        
        if (isToday) {
          const currentTime = new Date();
          const currentHours = currentTime.getHours();
          const currentMinutes = currentTime.getMinutes();
          
          processedSlots = processedSlots.filter(slot => {
            const [hours, minutes] = slot.start.split(':').map(Number);
            return hours > currentHours || 
                  (hours === currentHours && minutes > currentMinutes);
          });
        }
        
        setTimeSlots(processedSlots);
      } else {
        throw new Error(data.message || 'No time slots available');
      }
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setError(err.message);
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const getSlotEmoji = (available) => {
    if (theme === 'tree') {
      return available ? '🌲' : '🪵';
    }
    return available ? '✅' : '❌';
  };

  const getSlotVariant = (slot) => {
    const currentSlot = `${slot.start} - ${slot.end}`;
    if (selectedSlot === currentSlot && selectedDate) {
      return 'primary';
    }
    return slot.available ? 'outline' : 'disabled';
  };
  
  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-3"></div>
          <p className="text-gray-600">Loading available time slots...</p>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-50 rounded-lg text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {timeSlots.map((slot) => (
          <Button
            key={`${slot.start}-${slot.end}`}
            type="button"
            variant={getSlotVariant(slot)}
            onClick={() => slot.available && onTimeSelect(slot.start, slot.end)}
            disabled={!slot.available}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all h-16 w-full ${
              slot.available ? 'hover:shadow-md hover:-translate-y-0.5' : ''
            }`}
          >
            <span className="text-xl mb-0.5">{getSlotEmoji(slot.available)}</span>
            <span className="text-xs font-medium">
              {slot.start} - {slot.end}
            </span>
            {!slot.available && (
              <span className="text-[10px] mt-0.5 text-gray-500">Booked</span>
            )}
          </Button>
        ))}
      </div>
      
      {!loading && timeSlots.length === 0 && !error && (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">Please select a date to see available time slots</p>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;