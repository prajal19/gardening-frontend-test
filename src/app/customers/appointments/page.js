// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import CustomerLayout from "../../../components/customer/CustomerLayout";
// import { useDashboard } from "@/contexts/DashboardContext";
// import { 
//   Calendar, 
//   Clock, 
//   CheckCircle, 
//   AlertCircle, 
//   CreditCard, 
//   Users,
//   HardHat,
//   Package,
//   User,
//   ChevronRight
// } from "lucide-react";

// const Appointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [detailedAppointment, setDetailedAppointment] = useState(null);
//   const [showRescheduleModal, setShowRescheduleModal] = useState(false);
// const [selectedAppointment, setSelectedAppointment] = useState(null);
// const [selectedDate, setSelectedDate] = useState('');
// const [availableSlots, setAvailableSlots] = useState([]);
// const [selectedSlot, setSelectedSlot] = useState(null);
// const [rescheduleLoading, setRescheduleLoading] = useState(false);
// const [rescheduleError, setRescheduleError] = useState(null);
// const [deleteLoading, setDeleteLoading] = useState(false);
// const [deleteError, setDeleteError] = useState(null);

//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const { userData, isLoading } = useDashboard();
//   const router = useRouter();

//  const fetchAppointments = async () => {
//   try {
//     setLoading(true);
//     const token = userData?.token;
//     if (!token) {
//       setError("No authentication token found");
//       return;
//     }

//     const response = await axios.get(`${API_URL}/appointments/my-appointments`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (response.data.success) {
//       setAppointments(response.data.data || []);
//     }
//   } catch (err) {
//     setError(err.response?.data?.message || "Failed to fetch appointments");
//     console.error("Error fetching appointments:", err);
//   } finally {
//     setLoading(false);
//   }
// };

//   useEffect(() => {
//     // Only fetch appointments if userData is available
//     if (userData && !isLoading) {
//       fetchAppointments();
//     }
//   }, [userData, isLoading]); // Add dependencies to re-fetch when userData changes

 


// const canRescheduleAppointment = (appointment) => {
//   const now = new Date();
  
//   // Combine date with time slot to get actual appointment datetime
//   const appointmentDateStr = new Date(appointment.date).toISOString().split('T')[0];
//   const appointmentDateTime = new Date(`${appointmentDateStr}T${appointment.timeSlot.startTime}:00Z`);
  
//   console.log('Current time:', now.toISOString());
//   console.log('Appointment time:', appointmentDateTime.toISOString());
  
//   // Check if appointment is in the past
//   if (appointmentDateTime < now) {
//     return { canReschedule: false, reason: "Past appointments cannot be rescheduled" };
//   }
  
//   // Calculate hours remaining (in UTC)
//   const hoursBeforeAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
//   const MIN_RESCHEDULE_HOURS = 24;
  
//   console.log('Hours before appointment:', hoursBeforeAppointment);
  
//   if (hoursBeforeAppointment <= MIN_RESCHEDULE_HOURS) {
//     return { 
//       canReschedule: false, 
//       reason: `Appointments cannot be rescheduled within ${MIN_RESCHEDULE_HOURS} hours of the scheduled time` 
//     };
//   }
  
//   return { canReschedule: true };
// };



// const handleReschedule = async () => {
//   if (!selectedDate || !selectedSlot) {
//     setRescheduleError("Please select both date and time slot");
//     return;
//   }

//   const { canReschedule, reason } = canRescheduleAppointment(selectedAppointment);
//   if (!canReschedule) {
//     setRescheduleError(reason);
//     return;
//   }

//   // Create date in UTC by appending 'Z' to ISO string
//   const [hours, minutes] = selectedSlot.start.split(':').map(Number);
//   const newAppointmentDateTime = new Date(`${selectedDate}T${selectedSlot.start}:00Z`);

//   // Get current time in UTC
//   const now = new Date();
//   const bufferTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minute buffer

//   // Debug logs
//   console.log("Reschedule attempt:", {
//     selectedDate,
//     selectedSlot,
//     newAppointmentDateTime,
//     now,
//     bufferTime
//   });

//   if (newAppointmentDateTime < bufferTime) {
//     setRescheduleError("Cannot reschedule to a past date/time");
//     return;
//   }

//   setRescheduleLoading(true);
//   setRescheduleError(null);

//   try {
//     const res = await axios.put(
//       `${API_URL}/appointments/${selectedAppointment._id}/reschedule-request`,
//       {
//         requestedDate: selectedDate, // YYYY-MM-DD format
//         requestedTime: `${selectedSlot.start} - ${selectedSlot.end}`,
//         reason: "Customer requested reschedule"
//       },
//       { headers: { Authorization: `Bearer ${userData.token}` } }
//     );

//     if (res.data.success) {
//       setShowRescheduleModal(false);
//       await fetchAppointments();
//       alert("Reschedule request submitted successfully!");
//     }
//   } catch (err) {
//     setRescheduleError(err.response?.data?.error || "Failed to submit reschedule request");
//   } finally {
//     setRescheduleLoading(false);
//   }
// };



// const handleDeleteAppointment = async (appointmentId) => {
//   if (!confirm("Are you sure you want to cancel this appointment?")) {
//     return;
//   }

//   setDeleteLoading(true);
  
//   try {
//     const res = await axios.delete(`${API_URL}/appointments/${appointmentId}`, {
//       headers: { Authorization: `Bearer ${userData.token}` }
//     });

//     if (res.data.success) {
//       await fetchAppointments(); // Refresh the list
//       alert("Appointment canceled successfully");
//     }
//   } catch (err) {
//     const errorMsg = err.response?.data?.message || "Failed to cancel appointment";
//     alert(errorMsg);
//   } finally {
//     setDeleteLoading(false);
//   }
// };



 
 
//   // Rest of your component code remains the same...
//   const getStatusBadge = (status) => {
//     // ... existing status badge code ...
//   };

//   const getPaymentBadge = (status) => {
//     // ... existing payment badge code ...
//   };

//   if (loading) {
//     return (
//       <CustomerLayout>
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//         </div>
//       </CustomerLayout>
//     );
//   }

//   if (error) {
//     return (
//       <CustomerLayout>
//         <div className="max-w-6xl mx-auto px-4 py-6">
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
//             <div className="flex">
//               <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
//               <div>
//                 <p className="font-medium text-red-800">Error loading appointments</p>
//                 <p className="text-sm text-red-600 mt-1">{error}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CustomerLayout>
//     );
//   }

//   return (
//     <CustomerLayout>
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
//           <p className="mt-2 text-gray-600">View and manage your upcoming service appointments</p>
//         </div>

//         <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-md p-6 mb-8 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-semibold">Appointment Summary</h2>
//               <p className="text-green-100 mt-1">
//                 {appointments.length} {appointments.length === 1 ? "appointment" : "appointments"} scheduled
//               </p>
//             </div>
//             <div className="bg-white/20 p-3 rounded-lg">
//               <Calendar className="h-6 w-6" />
//             </div>
//           </div>
//         </div>

//         {appointments.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
//             <Calendar className="mx-auto h-12 w-12 text-gray-400" />
//             <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments yet</h3>
//             <p className="mt-2 text-gray-500">
//               You don't have any scheduled appointments. Book a service to get started.
//             </p>
//             <button
//               onClick={() => router.push("/customers/services")}
//               className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
//             >
//               Browse Services
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {appointments.map((appointment) => (
//               <div key={appointment._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
//                 <div className="p-5">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <div className="flex items-center">
//                         <HardHat className="h-5 w-5 text-green-600 mr-2" />
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           {appointment.service?.name || "Service"}
//                         </h3>
//                       </div>
//                       <p className="text-sm text-gray-500 mt-1">
//                         {appointment.service?.category || "No category"}
//                       </p>
//                     </div>
//                     {getStatusBadge(appointment.status)}
//                   </div>

//                   <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <div className="flex items-center text-sm text-gray-600">
//                         <Calendar className="h-4 w-4 text-green-500 mr-2" />
//                         <span>
//                           {new Date(appointment.date).toLocaleDateString("en-US", {
//                             weekday: "short",
//                             month: "short",
//                             day: "numeric",
//                             year: "numeric",
//                           })}
//                         </span>
//                       </div>
//                       <div className="flex items-center text-sm text-gray-600">
//                         <Clock className="h-4 w-4 text-green-500 mr-2" />
//                         <span>
//                           {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <div className="flex items-center text-sm text-gray-600">
//                         <Package className="h-4 w-4 text-green-500 mr-2" />
//                         <span>Package:</span>
//                         <span className="font-medium ml-1">
//                           {appointment.packageType || "Standard"}
//                         </span>
//                       </div>
//                       <div className="flex items-center text-sm text-gray-600">
//                         <CreditCard className="h-4 w-4 text-green-500 mr-2" />
//                         <span>Status:</span>
//                         {getPaymentBadge(appointment.payment?.status)}
//                         {/* <StatusBadge status={appointment.status} /> */}
//                       </div>
//                     </div>
//                   </div>

//                  <div className="mt-4 flex items-center justify-between border-t pt-4">
//   <div className="flex items-center text-sm text-gray-500">
//     <User className="h-4 w-4 mr-2" />
//     <span>
//       {appointment.crew?.assignedTo?.length > 0 ? (
//         <span className="text-green-600">Crew assigned</span>
//       ) : (
//         "No attendee specified"
//       )}
//     </span>
//   </div>
  
//   <div className="flex space-x-4">
//     <button
//       onClick={() => {
//         const { canReschedule, reason } = canRescheduleAppointment(appointment);
//         if (!canReschedule) {
//           alert(reason);
//           return;
//         }
//         setSelectedAppointment(appointment);
//         setShowRescheduleModal(true);
//         setSelectedDate("");
//         setAvailableSlots([]);
//         setSelectedSlot(null);
//       }}
//       className={`flex items-center text-sm focus:outline-none ${
//         canRescheduleAppointment(appointment).canReschedule 
//           ? 'text-blue-600 hover:underline' 
//           : 'text-gray-400 cursor-not-allowed'
//       }`}
//       disabled={!canRescheduleAppointment(appointment).canReschedule}
//     >
//       <span>Reschedule</span>
//     </button>

//     <button
//       onClick={() => handleDeleteAppointment(appointment._id)}
//       className={`flex items-center text-sm focus:outline-none ${
//         canRescheduleAppointment(appointment).canReschedule 
//           ? 'text-red-600 hover:underline' 
//           : 'text-gray-400 cursor-not-allowed'
//       }`}
//       disabled={!canRescheduleAppointment(appointment).canReschedule || deleteLoading}
//     >
//       {deleteLoading ? (
//         <>
//           <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           Canceling...
//         </>
//       ) : (
//         "Cancel"
//       )}
//     </button>
//   </div>
// </div>
//                 </div>
//               </div>
//             ))}

//             {showRescheduleModal && (
//   <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//     <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//       <h3 className="text-lg font-bold mb-4">Request Reschedule</h3>
      
//       {rescheduleError && (
//         <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">
//           {rescheduleError}
//         </div>
//       )}


//       {deleteError && (
//   <div className="fixed top-4 right-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg z-50">
//     <div className="flex">
//       <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
//       <div>
//         <p className="font-medium text-red-800">Error canceling appointment</p>
//         <p className="text-sm text-red-600 mt-1">{deleteError}</p>
//       </div>
//     </div>
//   </div>
// )}

//       <label className="block text-sm mb-2">Select New Date:</label>
//       <input
//         type="date"
//         className="w-full mb-4 border rounded px-3 py-2"
//         value={selectedDate}
//         min={new Date().toISOString().split("T")[0]}
//        onChange={async (e) => {
//   const newDate = e.target.value;
//   setSelectedDate(newDate);
//   setSelectedSlot(null);
//   setRescheduleError(null);

//   try {
//     const res = await axios.get(`${API_URL}/appointments/availability`, {
//       params: {
//         date: newDate,
//         serviceId: selectedAppointment.service._id,
//       },
//     });
//     if (res.data.success) {
//       // Transform the backend response to match frontend expectations
//       const transformedSlots = res.data.data.map(slot => ({
//         start: slot.startTime,
//         end: slot.endTime,
//         available: slot.available
//       }));
//       setAvailableSlots(transformedSlots);
//     }
//   } catch (error) {
//     console.error("Failed to fetch slots:", error);
//     setAvailableSlots([]);
//   }
// }}
//       />

//     {availableSlots.length > 0 && (
//   <>
//     <p className="mb-2 text-sm font-medium">Available Time Slots:</p>
//     <div className="flex items-center text-xs text-gray-500 mb-1">
//       <span className="inline-block w-3 h-3 bg-green-200 mr-1 rounded-sm"></span> Available
//       <span className="inline-block w-3 h-3 bg-gray-100 ml-2 mr-1 rounded-sm"></span> Booked
//     </div>
//     <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto mb-4">
//       {availableSlots.map((slot, index) => (
//         <button
//           key={index}
//           onClick={() => slot.available && setSelectedSlot(slot)}
//           className={`border rounded p-2 text-sm h-16 flex flex-col items-center justify-center ${
//             !slot.available
//               ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
//               : selectedSlot === slot
//                 ? 'bg-green-100 border-green-500 hover:bg-green-50'
//                 : 'hover:bg-green-50'
//           }`}
//           disabled={!slot.available}
//         >
//           <span className="font-medium">
//             {slot.start} - {slot.end}
//           </span>
//           {!slot.available && (
//             <span className="text-xs mt-1 text-gray-500">Booked</span>
//           )}
//         </button>
//       ))}
//     </div>
//   </>
// )}

//       <div className="flex justify-between items-center">
//         <button
//           onClick={() => {
//             setShowRescheduleModal(false);
//             setRescheduleError(null);
//           }}
//           className="text-red-600 text-sm"
//           disabled={rescheduleLoading}
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleReschedule}
//           className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center"
//           disabled={!selectedDate || !selectedSlot || rescheduleLoading}
//         >
//           {rescheduleLoading ? (
//             <>
//               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Processing...
//             </>
//           ) : (
//             "Request Reschedule"
//           )}
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//           </div>
//         )}
//       </div>
//     </CustomerLayout>
//   );
// };

// export default Appointments;



//  {/* <button
//   onClick={() => router.push(`/customers/appointments/${appointment._id}`)}
//   className="flex items-center text-sm text-green-600 hover:underline focus:outline-none"
// >
//   <span>View details</span>
//   <ChevronRight className="h-4 w-4 ml-1" />
// </button> */}




"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import CustomerLayout from "../../../components/customer/CustomerLayout";
import { useDashboard } from "@/contexts/DashboardContext";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  CreditCard, 
  Users,
  HardHat,
  Package,
  User,
  ChevronRight,
  X,
  Check
} from "lucide-react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailedAppointment, setDetailedAppointment] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showCancelSuccessPopup, setShowCancelSuccessPopup] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userData, isLoading } = useDashboard();
  const router = useRouter();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = userData?.token;
      if (!token) {
        setError("No authentication token found");
        return;
      }

      const response = await axios.get(`${API_URL}/appointments/my-appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAppointments(response.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch appointments");
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData && !isLoading) {
      fetchAppointments();
    }
  }, [userData, isLoading]);

  const canRescheduleAppointment = (appointment) => {
    const now = new Date();
    const appointmentDateStr = new Date(appointment.date).toISOString().split('T')[0];
    const appointmentDateTime = new Date(`${appointmentDateStr}T${appointment.timeSlot.startTime}:00Z`);
    
    if (appointmentDateTime < now) {
      return { canReschedule: false, reason: "Past appointments cannot be rescheduled" };
    }
    
    const hoursBeforeAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
    const MIN_RESCHEDULE_HOURS = 24;
    
    if (hoursBeforeAppointment <= MIN_RESCHEDULE_HOURS) {
      return { 
        canReschedule: false, 
        reason: `Appointments cannot be rescheduled within ${MIN_RESCHEDULE_HOURS} hours of the scheduled time` 
      };
    }
    
    return { canReschedule: true };
  };

  const handleReschedule = async () => {
    if (!selectedDate || !selectedSlot) {
      setRescheduleError("Please select both date and time slot");
      return;
    }

    const { canReschedule, reason } = canRescheduleAppointment(selectedAppointment);
    if (!canReschedule) {
      setRescheduleError(reason);
      return;
    }

    const [hours, minutes] = selectedSlot.start.split(':').map(Number);
    const newAppointmentDateTime = new Date(`${selectedDate}T${selectedSlot.start}:00Z`);
    const now = new Date();
    const bufferTime = new Date(now.getTime() + 5 * 60 * 1000);

    if (newAppointmentDateTime < bufferTime) {
      setRescheduleError("Cannot reschedule to a past date/time");
      return;
    }

    setRescheduleLoading(true);
    setRescheduleError(null);

    try {
      const res = await axios.put(
        `${API_URL}/appointments/${selectedAppointment._id}/reschedule-request`,
        {
          requestedDate: selectedDate,
          requestedTime: `${selectedSlot.start} - ${selectedSlot.end}`,
          reason: "Customer requested reschedule"
        },
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );

      if (res.data.success) {
        setShowRescheduleModal(false);
        await fetchAppointments();
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 3000);
      }
    } catch (err) {
      setRescheduleError(err.response?.data?.error || "Failed to submit reschedule request");
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    setDeleteLoading(true);
    setDeleteError(null);
    
    try {
      const res = await axios.delete(`${API_URL}/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${userData.token}` }
      });

      if (res.data.success) {
        await fetchAppointments();
        setShowCancelSuccessPopup(true);
        setTimeout(() => setShowCancelSuccessPopup(false), 3000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to cancel appointment";
      setDeleteError(errorMsg);
    } finally {
      setDeleteLoading(false);
      setShowCancelConfirmation(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Check className="mr-1 h-3 w-3" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="mr-1 h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        );
      case 'refunded':
        return (
          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            Refunded
          </span>
        );
      default:
        return (
          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            {status || 'Not paid'}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <p className="font-medium text-red-800">Error loading appointments</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      {/* Reschedule Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 transition-transform duration-300 ease-out animate-scale-fade-in">
          <div className="bg-white border border-green-200 rounded-lg shadow-xl p-4 w-64 relative overflow-hidden">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
            
            {/* Bottom subtle bar */}
            <div className="absolute bottom-0 left-0 h-2 w-full bg-green-50"></div>

            <div className="flex items-start">
              {/* Icon */}
              <div className="flex-shrink-0 relative">
                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center border-2 border-green-200 animate-bounce">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 text-2xl">🌿</div>
              </div>

              {/* Text Content */}
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900">Request Submitted!</h3>
                <div className="mt-1 text-sm text-gray-600">
                  Your reschedule request was received
                </div>
              </div>
            </div>

            {/* Auto-dismiss progress bar */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-green-100">
              <div 
                className="h-full bg-green-400 animate-[shrink_3s_linear_forwards]"
                onAnimationEnd={() => setShowSuccessPopup(false)}
              ></div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-150"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Cancel Success Popup */}
      {showCancelSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 transition-transform duration-300 ease-out animate-scale-fade-in">
          <div className="bg-white border border-red-200 rounded-lg shadow-xl p-4 w-64 relative overflow-hidden">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-rose-500 animate-pulse"></div>
            
            {/* Bottom subtle bar */}
            <div className="absolute bottom-0 left-0 h-2 w-full bg-red-50"></div>

            <div className="flex items-start">
              {/* Icon */}
              <div className="flex-shrink-0 relative">
                <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center border-2 border-red-200 animate-bounce">
                  <Check className="h-5 w-5 text-red-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 text-2xl">🍂</div>
              </div>

              {/* Text Content */}
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900">Cancellation Complete</h3>
                <div className="mt-1 text-sm text-gray-600">
                  Your appointment was canceled
                </div>
              </div>
            </div>

            {/* Auto-dismiss progress bar */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-red-100">
              <div 
                className="h-full bg-red-400 animate-[shrink_3s_linear_forwards]"
                onAnimationEnd={() => setShowCancelSuccessPopup(false)}
              ></div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowCancelSuccessPopup(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-150"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Popup for Cancel */}
      {deleteError && (
        <div className="fixed top-4 right-4 z-50 transition-transform duration-300 ease-out animate-scale-fade-in">
          <div className="bg-white border border-red-200 rounded-lg shadow-xl p-4 w-64 relative overflow-hidden">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-rose-500 animate-pulse"></div>
            
            <div className="flex items-start">
              {/* Icon */}
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>

              {/* Text Content */}
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900">Cancellation Failed</h3>
                <div className="mt-1 text-sm text-gray-600">
                  {deleteError}
                </div>
              </div>
            </div>

            {/* Auto-dismiss progress bar */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-red-100">
              <div 
                className="h-full bg-red-400 animate-[shrink_5s_linear_forwards]"
                onAnimationEnd={() => setDeleteError(null)}
              ></div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setDeleteError(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-150"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Popup */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Confirm Cancellation</h3>
                <button 
                  onClick={() => setShowCancelConfirmation(false)}
                  className="text-white hover:text-red-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Are you sure?</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>This will cancel your appointment scheduled for:</p>
                    <p className="font-medium mt-1">
                      {new Date(appointmentToCancel?.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {' '}at {appointmentToCancel?.timeSlot?.startTime}
                    </p>
                    <p className="mt-2 text-red-600">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCancelConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteAppointment(appointmentToCancel._id)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Canceling...
                    </>
                  ) : (
                    "Yes, Cancel Appointment"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="mt-2 text-gray-600">View and manage your upcoming service appointments</p>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-md p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Appointment Summary</h2>
              <p className="text-green-100 mt-1">
                {appointments.length} {appointments.length === 1 ? "appointment" : "appointments"} scheduled
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments yet</h3>
            <p className="mt-2 text-gray-500">
              You don't have any scheduled appointments. Book a service to get started.
            </p>
            <button
              onClick={() => router.push("/customers/services")}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center">
                        <HardHat className="h-5 w-5 text-green-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.service?.name || "Service"}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {appointment.service?.category || "No category"}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-green-500 mr-2" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-green-500 mr-2" />
                        <span>
                          {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Package className="h-4 w-4 text-green-500 mr-2" />
                        <span>Package:</span>
                        <span className="font-medium ml-1">
                          {appointment.packageType || "Standard"}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <CreditCard className="h-4 w-4 text-green-500 mr-2" />
                        <span>Status:</span>
                        {getPaymentBadge(appointment.payment?.status)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      <span>
                        {appointment.crew?.assignedTo?.length > 0 ? (
                          <span className="text-green-600">Crew assigned</span>
                        ) : (
                          "No attendee specified"
                        )}
                      </span>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={() => {
                          const { canReschedule, reason } = canRescheduleAppointment(appointment);
                          if (!canReschedule) {
                            setDeleteError(reason);
                            return;
                          }
                          setSelectedAppointment(appointment);
                          setShowRescheduleModal(true);
                          setSelectedDate("");
                          setAvailableSlots([]);
                          setSelectedSlot(null);
                        }}
                        className={`flex items-center text-sm focus:outline-none ${
                          canRescheduleAppointment(appointment).canReschedule 
                            ? 'text-blue-600 hover:underline' 
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!canRescheduleAppointment(appointment).canReschedule}
                      >
                        <span>Reschedule</span>
                      </button>

                      <button
                        onClick={() => {
                          const { canReschedule, reason } = canRescheduleAppointment(appointment);
                          if (!canReschedule) {
                            setDeleteError(reason);
                            return;
                          }
                          setAppointmentToCancel(appointment);
                          setShowCancelConfirmation(true);
                        }}
                        className={`flex items-center text-sm focus:outline-none ${
                          canRescheduleAppointment(appointment).canReschedule 
                            ? 'text-red-600 hover:underline' 
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!canRescheduleAppointment(appointment).canReschedule || deleteLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {showRescheduleModal && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold mb-4">Request Reschedule</h3>
                  
                  {rescheduleError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded">
                      {rescheduleError}
                    </div>
                  )}

                  <label className="block text-sm mb-2">Select New Date:</label>
                  <input
                    type="date"
                    className="w-full mb-4 border rounded px-3 py-2"
                    value={selectedDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={async (e) => {
                      const newDate = e.target.value;
                      setSelectedDate(newDate);
                      setSelectedSlot(null);
                      setRescheduleError(null);

                      try {
                        const res = await axios.get(`${API_URL}/appointments/availability`, {
                          params: {
                            date: newDate,
                            serviceId: selectedAppointment.service._id,
                          },
                        });
                        if (res.data.success) {
                          const transformedSlots = res.data.data.map(slot => ({
                            start: slot.startTime,
                            end: slot.endTime,
                            available: slot.available
                          }));
                          setAvailableSlots(transformedSlots);
                        }
                      } catch (error) {
                        console.error("Failed to fetch slots:", error);
                        setAvailableSlots([]);
                      }
                    }}
                  />

                  {availableSlots.length > 0 && (
                    <>
                      <p className="mb-2 text-sm font-medium">Available Time Slots:</p>
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <span className="inline-block w-3 h-3 bg-green-200 mr-1 rounded-sm"></span> Available
                        <span className="inline-block w-3 h-3 bg-gray-100 ml-2 mr-1 rounded-sm"></span> Booked
                      </div>
                      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto mb-4">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => slot.available && setSelectedSlot(slot)}
                            className={`border rounded p-2 text-sm h-16 flex flex-col items-center justify-center ${
                              !slot.available
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                : selectedSlot === slot
                                  ? 'bg-green-100 border-green-500 hover:bg-green-50'
                                  : 'hover:bg-green-50'
                            }`}
                            disabled={!slot.available}
                          >
                            <span className="font-medium">
                              {slot.start} - {slot.end}
                            </span>
                            {!slot.available && (
                              <span className="text-xs mt-1 text-gray-500">Booked</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => {
                        setShowRescheduleModal(false);
                        setRescheduleError(null);
                      }}
                      className="text-red-600 text-sm"
                      disabled={rescheduleLoading}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleReschedule}
                      className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700 flex items-center justify-center"
                      disabled={!selectedDate || !selectedSlot || rescheduleLoading}
                    >
                      {rescheduleLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Request Reschedule"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default Appointments;