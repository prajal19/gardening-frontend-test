import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  User,
  Star,
  ChevronRight,
  CreditCard,
  CalendarPlus,
  MessageSquare,
  FileText,
  MessageCircle,
  Settings,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

import { useDashboard } from "@/contexts/DashboardContext";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [imageModalOpen, setImageModalOpen] = useState(false);
const [selectedImages, setSelectedImages] = useState([]);
const [currentImageIndex, setCurrentImageIndex] = useState(0);



  const { userData, isLoading: contextLoading } = useDashboard();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    propertyDetails: {
      size: "",
      features: {
        hasFrontYard: false,
        hasBackYard: false,
        hasTrees: false,
        hasGarden: false,
        hasSprinklerSystem: false,
      },
      accessInstructions: "",
    },
    servicePreferences: {
      preferredDays: [],
      preferredTimeOfDay: "Any",
    },
    notificationPreferences: {
      email: false,
      sms: false,
      reminderDaysBefore: 0,
    },
    notes: "",
  });

  // Define the calculateDuration function
  function calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end - start) / 1000 / 60; // Duration in minutes
    return duration;
  }

  useEffect(() => {
    const fetchAndFilterAppointment = async () => {
      try {
        const response = await axios.get(`${API_URL}/customers/me/history`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        });

        console.log("API Response:", response.data);

        const now = new Date();
        const allAppointments = [];

        // Safely process each appointment
        response.data.data.forEach((appointment) => {
          try {
            // Skip if no time slot or invalid data
            if (!appointment?.timeSlot?.startTime) {
              console.warn(
                "Skipping appointment - missing time slot:",
                appointment
              );
              return;
            }

            const appointmentDate = new Date(appointment.date);

            // Safely parse time
            const timeString = appointment.timeSlot.startTime;
            if (typeof timeString !== "string") {
              console.warn("Invalid time format:", timeString);
              return;
            }

            // Parse time (handle both "HH:MM AM/PM" and "HH:MM:SS AM/PM" formats)
            const timeParts = timeString.match(
              /(\d+):(\d+)(?::\d+)?\s*(AM|PM)?/i
            );
            if (!timeParts) {
              console.warn("Could not parse time:", timeString);
              return;
            }

            let hours = parseInt(timeParts[1], 10);
            const minutes = parseInt(timeParts[2], 10);
            const period = timeParts[3]?.toUpperCase();

            // Convert to 24-hour format if period exists
            if (period) {
              if (period === "PM" && hours < 12) hours += 12;
              if (period === "AM" && hours === 12) hours = 0;
            }

            appointmentDate.setHours(hours, minutes, 0, 0);

            allAppointments.push({
              ...appointment,
              fullDateTime: appointmentDate,
            });
          } catch (error) {
            console.error("Error processing appointment:", appointment, error);
          }
        });

        // Filter and sort appointments
        const upcoming = allAppointments
          .filter((appointment) => appointment.fullDateTime > now)
          .sort((a, b) => a.fullDateTime - b.fullDateTime);

        const past = allAppointments
          .filter((appointment) => appointment.fullDateTime <= now)
          .sort((a, b) => b.fullDateTime - a.fullDateTime);

        console.log("Upcoming appointments:", upcoming);
        console.log("Past appointments:", past);

        if (upcoming.length > 0) {
          const next = upcoming[0];
          setNextAppointment({
            _id: next._id,
            name: next.service?.name || "Unnamed Service",
            category: next.service?.category || "N/A",
            type: next.packageType || "Service",
            date: next.date,
            startTime: next.timeSlot.startTime,
            endTime: next.timeSlot.endTime,
            duration: calculateDuration(
              next.timeSlot.startTime,
              next.timeSlot.endTime
            ),
            status: next.status || "Scheduled",
          });
        } else {
          setNextAppointment(null);
        }

        setPastAppointments(past);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setError("Failed to load appointments. Please try again later.");
      }
    };

    if (userData?.token) {
      fetchAndFilterAppointment();
    }
  }, [userData?.token, API_URL]);

  // Fetch user data when userData or contextLoading changes
  useEffect(() => {
    const fetchUserData = async () => {
  try {
    if (!userData?.token) {
      setLoading(false);
      return;
    }

    // Fetch customer data
    const customerResponse = await axios.get(`${API_URL}/customers/me`, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });
    const customerData = customerResponse.data.data;

    // Fetch properties for this customer
    const propertiesResponse = await axios.get(`${API_URL}/properties`, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });
    const properties = propertiesResponse.data.data;

    // Format address
    let formattedAddress = "";
    if (typeof customerData.address === "object" && customerData.address !== null) {
      const addressParts = [];
      if (customerData.address?.street) addressParts.push(customerData.address.street);
      if (customerData.address?.city) addressParts.push(customerData.address.city);
      if (customerData.address?.state) addressParts.push(customerData.address.state);
      if (customerData.address?.zipCode) addressParts.push(customerData.address.zipCode);
      if (customerData.address?.country) addressParts.push(customerData.address.country);
      formattedAddress = addressParts.join(", ");
    } else if (typeof customerData.address === "string") {
      formattedAddress = customerData.address;
    }

    const transformedUser = {
      name: customerData.user?.name || "",
      email: customerData.user?.email || "",
      phone: customerData.user?.phone || "",
      address: customerData.address || {},
      formattedAddress: formattedAddress,
      memberStatus: customerData.memberStatus || "Standard Member",
      avatar: customerData.avatar || "/avatar.png",
      properties: properties.map(property => ({
        _id: property._id,
        name: property.name || `Property ${property._id}`,
        address: property.address || formattedAddress,
        size: property.size?.value ? `${property.size.value} ${property.size.unit}` : "N/A",
        images: property.images || [],
        features: property.features || {
          hasFrontYard: false,
          hasBackYard: false,
          hasTrees: false,
          hasGarden: false,
          hasSprinklerSystem: false
        },
        accessInstructions: property.accessInstructions || "",
        specialRequirements: property.specialRequirements || ""
      })),
      nextService: customerData.nextAppointment ? {
        type: customerData.nextAppointment.serviceType || "Service",
        date: new Date(customerData.nextAppointment.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        startTime: customerData.nextAppointment.startTime || "9:00 AM",
        endTime: customerData.nextAppointment.endTime || "11:00 AM",
        duration: customerData.nextAppointment.duration || "2 hours",
      } : null
    };

    setUser(transformedUser);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching user data:", err);
    setError(err.response?.data?.message || "Failed to fetch user data");
    setLoading(false);
  }
};
    // Only fetch if context is done loading and we have userData
    if (!contextLoading && userData) {
      fetchUserData();
    }
  }, [userData, contextLoading]); // Add dependencies here

  // Add this function to handle image click
const handleImageClick = (images, index = 0) => {
  setSelectedImages(images);
  setCurrentImageIndex(index);
  setImageModalOpen(true);
};

  // Early returns for loading and auth states
  if (contextLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg max-w-md">
          <strong className="font-bold">Notice: </strong>
          <span className="block sm:inline">
            Please log in to view this page.
          </span>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-green-50 flex justify-center items-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg max-w-md">
          <strong className="font-bold">Notice: </strong>
          <span className="block sm:inline">No user data available.</span>
        </div>
      </div>
    );
  }

  const placeholderImages = {
    avatar: "https://via.placeholder.com/80/22c55e/ffffff?text=MA",
    property:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    garden:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
  };

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      {/* <div className="bg-green-600 text-lg text-white p-6"> */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-green-600 rounded-full w-20 h-20 flex items-center justify-center text-white text-4xl font-bold mr-4">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>

              <div className="flex items-center justify-center md:justify-start text-gray-500">
                <Mail size={16} className="mr-2" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
          <Link
            href="/customers/edit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-all border border-green-700 hover:border-green-800 shadow-sm"
          >
            Edit
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
      {/* </div> */}

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Next Service Card - Full Width */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden mb-6">
          <div className="bg-green-600 text-white p-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Clock className="mr-2" size={18} />
              Next Scheduled Service
            </h2>
          </div>
          <div className="p-4">
            {nextAppointment ? (
              <div className="md:flex items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <Calendar className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {nextAppointment.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {nextAppointment.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(nextAppointment.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Time</p>
                    <p className="text-gray-700">
                      {nextAppointment.startTime} - {nextAppointment.endTime}
                    </p>
                  </div>
                  {/* <div>
          <p className="text-sm text-green-600 font-medium">Duration</p>
          <p className="text-gray-700">{nextAppointment.duration}</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors">
          View Details
        </button> */}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="bg-green-100 p-4 rounded-lg inline-block mb-3">
                  <Calendar className="text-green-600 mx-auto" size={24} />
                </div>
                <h3 className="text-gray-500 mb-2">No upcoming services</h3>
                <div className="mt-4">
  <Link href="/booking" className="text-green-600 hover:text-green-800 font-medium">
    Schedule a Service
  </Link>
</div>


              </div>
            )}
          </div>
        </div>

        {/* Personal Info and Property Cards - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Personal Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
            <div className="bg-green-500 text-white p-4">
              <h2 className="text-lg font-semibold flex items-center">
                <User className="mr-2" size={18} />
                Personal Information
              </h2>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-green-600 font-medium">Full Name</p>
                <p className="text-gray-700">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Email</p>
                <p className="text-gray-700">{user.email}</p>
              </div>
              {/* {user.phone && (
                <div>
                  <p className="text-sm text-green-600 font-medium">Phone</p>
                  <p className="text-gray-700">{user.phone}</p>
                </div>
              )} */}

               <div>
                <p className="text-sm text-green-600 font-medium">Phone</p>
                <p className="text-gray-700">{user.phone}</p>
              </div>
              {/* <div>
            <p className="text-sm text-green-600 font-medium">Address</p>
            <p className="text-gray-700">
              {user.formattedAddress || "No address provided"}
            </p>
          </div>
          <div>
            <p className="text-sm text-green-600 font-medium">Member Status</p>
            <p className="text-gray-700">{user.memberStatus}</p>
          </div> */}
            </div>
          </div>

          {/* Property Overview Card */}
          {/* Property Overview Card */}
<div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
  <div className="bg-green-600 text-white p-4">
    <h2 className="text-lg font-semibold flex items-center">
      <MapPin className="mr-2" size={18} />
      My Properties
    </h2>
  </div>
  <div className="p-4">
    {user?.properties?.length > 0 ? (
      <div className="space-y-6">
        {user.properties.map((property, index) => (
          <div key={property._id} className="border border-gray-100 rounded-lg overflow-hidden">
            {/* Property Images Carousel */}
            <div className="relative h-48 bg-gray-100">
              {property.images.length > 0 ? (
                <>
                  <div className="relative h-full w-full overflow-hidden">
                    <img
                      src={property.images[0].url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => handleImageClick(property.images)}
                    />
                  </div>
                  {property.images.length > 1 && (
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                      {property.images.map((img, imgIndex) => (
                        <button
                          key={imgIndex}
                          className={`h-2 w-2 rounded-full ${imgIndex === 0 ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                          aria-label={`Go to image ${imgIndex + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  <MapPin size={32} />
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{property.name}</h3>
                  {property.address && (
                    <p className="text-sm text-gray-600 mt-1">
                      {typeof property.address === 'string' ? 
                        property.address : 
                        `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zipCode}`
                      }
                    </p>
                  )}
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {property.size}
                </span>
              </div>

              {/* Property Features */}
              {property.features && (
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {property.features.hasFrontYard && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        Front Yard
                      </span>
                    )}
                    {property.features.hasBackYard && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        Back Yard
                      </span>
                    )}
                    {property.features.hasTrees && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        Trees
                      </span>
                    )}
                    {property.features.hasGarden && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        Garden
                      </span>
                    )}
                    {property.features.hasSprinklerSystem && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        Sprinkler System
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Access Instructions */}
              {property.accessInstructions && (
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Access Instructions
                  </h4>
                  <p className="text-sm text-gray-600">{property.accessInstructions}</p>
                </div>
              )}

              {property.images.length > 0 && (
                <button 
                  className="w-full mt-4 text-green-600 hover:text-green-800 font-medium text-sm flex items-center justify-center"
                  onClick={() => handleImageClick(property.images)}
                >
                  <span>View All Images</span>
                  <ChevronRight size={16} className="ml-1" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="bg-green-100 p-4 rounded-full inline-block mb-3">
          <MapPin className="text-green-600" size={24} />
        </div>
        <h3 className="text-gray-500 mb-2">No properties added yet</h3>
        {/* <Link 
          href="/customers/add-property" 
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Add Your First Property
        </Link> */}
      </div>
    )}
  </div>
</div>
        </div>

        {/* Recent Services Card */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden mb-6">
          <div className="bg-green-600 text-white p-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Calendar className="mr-2" size={18} />
              Recent Service History
            </h2>
          </div>
          <div className="p-4">
            {pastAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-green-100">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Date</th>
                      {/* <th className="px-4 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Amount</th> */}
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Payment</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-green-100">
                    {pastAppointments.map((service) => (
                      <tr key={service._id}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {/* <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg overflow-hidden mr-3">
                              <img
                                src={service.image}
                                alt={service.packageType || 'Service'}
                                className="h-full w-full object-cover"
                              />
                            </div> */}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{service.service?.name || 'Service'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(service.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        {/* <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          ${service.price || '0.00'}
                        </td> */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {service.paymentStatus === 'Paid' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedAppointment(service);
                                setIsPaymentModalOpen(true);
                              }}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${service.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                service.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                                  service.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'}`}>
                            {service.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-green-100 p-4 rounded-full inline-block mb-3">
                  <Calendar className="text-green-600" size={24} />
                </div>
                <h3 className="text-gray-500">No recent services found</h3>
              </div>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        {isPaymentModalOpen && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-5 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">Complete Payment</h3>
                  <p className="text-emerald-100 text-sm mt-1">
                    Secure payment processing
                  </p>
                </div>
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="text-emerald-100 hover:text-white transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Service Summary */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-emerald-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                      <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                    </svg>
                    Service Details
                  </h4>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden mr-4 border-2 border-white shadow-sm">
                      <img
                        src={selectedAppointment.image}
                        alt={selectedAppointment.packageType || "Service"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {selectedAppointment.service?.name || "Service"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 inline mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(selectedAppointment.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-gray-600 font-medium">
                          Total Amount:
                        </span>
                        <span className="font-bold text-lg text-emerald-600">
                          ${selectedAppointment.price || "0.00"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-emerald-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path
                        fillRule="evenodd"
                        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Payment Method
                  </h4>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Credit Card */}
                    <button
                      className={`p-3 border rounded-lg flex flex-col items-center transition-all ${
                        paymentMethod === "card"
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 mb-1 ${
                          paymentMethod === "card"
                            ? "text-emerald-600"
                            : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <span
                        className={`text-xs font-medium ${
                          paymentMethod === "card"
                            ? "text-emerald-700"
                            : "text-gray-600"
                        }`}
                      >
                        Card
                      </span>
                    </button>

                    {/* PayPal */}
                    <button
                      className={`p-3 border rounded-lg flex flex-col items-center transition-all ${
                        paymentMethod === "paypal"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => setPaymentMethod("paypal")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 mb-1 ${
                          paymentMethod === "paypal"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9.93 12.99c.1 0 2.42.1 3.8-.24h.01c1.59-.39 3.8-1.51 4.37-5.17.2-1.24.23-2.28.12-3.1-.77 1.1-1.26 2.03-1.5 3.28-.47 2.46-1.85 4.1-4.02 4.1h-.38s-.6.02-.9.05c-.04-.02-.11-.03-.18-.04l-.17-.04h-.02c-.3-.06-.5-.1-.5-.1l-.12.06zm-3.14-1.26c-.17 0-.5.02-.79.05h-.05v-.05c.08-.01.16-.02.24-.02h.05c.45-.03.87-.1 1.25-.2.28-.07.53-.17.75-.29.03.18.06.34.08.48.01.02.01.04.01.06 0 .01-.01.02-.01.03-.03.1-.06.2-.1.29-.02.06-.05.11-.08.17-.01.01-.02.03-.03.04-.01.01-.02.01-.03.02-.01 0-.02.01-.03.01-.01 0-.02-.01-.03-.01-.01 0-.02-.01-.03-.02-.01-.01-.02-.02-.03-.04-.03-.05-.06-.11-.08-.17-.04-.09-.07-.19-.1-.29 0-.01-.01-.02-.01-.03 0-.02.01-.04.01-.06.02-.14.05-.3.08-.48-.22.12-.47.22-.75.29-.38.1-.8.17-1.25.2h-.05c-.08 0-.16.01-.24.02v.05h.05c.29-.03.62-.05.79-.05z" />
                      </svg>
                      <span
                        className={`text-xs font-medium ${
                          paymentMethod === "paypal"
                            ? "text-blue-700"
                            : "text-gray-600"
                        }`}
                      >
                        PayPal
                      </span>
                    </button>

                    {/* Bank Transfer */}
                    <button
                      className={`p-3 border rounded-lg flex flex-col items-center transition-all ${
                        paymentMethod === "bank"
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      onClick={() => setPaymentMethod("bank")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 mb-1 ${
                          paymentMethod === "bank"
                            ? "text-purple-600"
                            : "text-gray-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                        />
                      </svg>
                      <span
                        className={`text-xs font-medium ${
                          paymentMethod === "bank"
                            ? "text-purple-700"
                            : "text-gray-600"
                        }`}
                      >
                        Bank
                      </span>
                    </button>
                  </div>
                </div>

                {/* Card Details (shown only when card is selected) */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-emerald-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path
                          fillRule="evenodd"
                          d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Card Details
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label
                          htmlFor="card-number"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="card-number"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="1234 5678 9012 3456"
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="expiry-date"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiry-date"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cvv"
                            className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                          >
                            CVV
                            <span
                              className="ml-1"
                              data-tooltip="3-digit code on back of card"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </span>
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            placeholder="•••"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="card-name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Name on Card
                        </label>
                        <input
                          type="text"
                          id="card-name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Details (shown only when PayPal is selected) */}
                {paymentMethod === "paypal" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-blue-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9.93 12.99c.1 0 2.42.1 3.8-.24h.01c1.59-.39 3.8-1.51 4.37-5.17.2-1.24.23-2.28.12-3.1-.77 1.1-1.26 2.03-1.5 3.28-.47 2.46-1.85 4.1-4.02 4.1h-.38s-.6.02-.9.05c-.04-.02-.11-.03-.18-.04l-.17-.04h-.02c-.3-.06-.5-.1-.5-.1l-.12.06zm-3.14-1.26c-.17 0-.5.02-.79.05h-.05v-.05c.08-.01.16-.02.24-.02h.05c.45-.03.87-.1 1.25-.2.28-.07.53-.17.75-.29.03.18.06.34.08.48.01.02.01.04.01.06 0 .01-.01.02-.01.03-.03.1-.06.2-.1.29-.02.06-.05.11-.08.17-.01.01-.02.03-.03.04-.01.01-.02.01-.03.02-.01 0-.02.01-.03.01-.01 0-.02-.01-.03-.01-.01 0-.02-.01-.03-.02-.01-.01-.02-.02-.03-.04-.03-.05-.06-.11-.08-.17-.04-.09-.07-.19-.1-.29 0-.01-.01-.02-.01-.03 0-.02.01-.04.01-.06.02-.14.05-.3.08-.48-.22.12-.47.22-.75.29-.38.1-.8.17-1.25.2h-.05c-.08 0-.16.01-.24.02v.05h.05c.29-.03.62-.05.79-.05z" />
                      </svg>
                      PayPal Checkout
                    </h4>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <img
                          src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
                          alt="PayPal"
                          className="h-6 mr-2"
                        />
                        <span className="font-medium text-blue-700">
                          Pay with PayPal
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        You'll be redirected to PayPal to complete your payment
                        securely. No PayPal account required - you can pay with
                        your credit card through PayPal.
                      </p>

                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        Secured by PayPal's Buyer Protection
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Details (shown only when Bank is selected) */}
                {paymentMethod === "bank" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                        />
                      </svg>
                      Bank Transfer Details
                    </h4>

                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                      <div className="mb-4">
                        <h5 className="font-medium text-purple-800 mb-2">
                          Account Information
                        </h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Bank Name:</span>
                            <span className="font-medium">
                              Global Trust Bank
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Account Name:</span>
                            <span className="font-medium">
                              HealthPlus Wellness Center
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Account Number:
                            </span>
                            <span className="font-medium">
                              1234 5678 9012 3456
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">SWIFT/BIC:</span>
                            <span className="font-medium">GTBKUS33</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-md p-3 border border-gray-200">
                        <h5 className="font-medium text-gray-800 mb-2 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-purple-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Important Instructions
                        </h5>
                        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                          <li>Use your appointment ID as payment reference</li>
                          <li>Payment must be completed within 24 hours</li>
                          <li>
                            Appointment will be confirmed after payment clears
                          </li>
                          <li>
                            Send payment receipt to payments@healthplus.com
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      handlePayment(selectedAppointment._id);
                      setIsPaymentModalOpen(false);
                    }}
                    className={`w-full font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center ${
                      paymentMethod === "paypal"
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : paymentMethod === "bank"
                        ? "bg-purple-500 hover:bg-purple-600 text-white"
                        : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
                    }`}
                  >
                    {paymentMethod === "paypal" ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M9.93 12.99c.1 0 2.42.1 3.8-.24h.01c1.59-.39 3.8-1.51 4.37-5.17.2-1.24.23-2.28.12-3.1-.77 1.1-1.26 2.03-1.5 3.28-.47 2.46-1.85 4.1-4.02 4.1h-.38s-.6.02-.9.05c-.04-.02-.11-.03-.18-.04l-.17-.04h-.02c-.3-.06-.5-.1-.5-.1l-.12.06zm-3.14-1.26c-.17 0-.5.02-.79.05h-.05v-.05c.08-.01.16-.02.24-.02h.05c.45-.03.87-.1 1.25-.2.28-.07.53-.17.75-.29.03.18.06.34.08.48.01.02.01.04.01.06 0 .01-.01.02-.01.03-.03.1-.06.2-.1.29-.02.06-.05.11-.08.17-.01.01-.02.03-.03.04-.01.01-.02.01-.03.02-.01 0-.02.01-.03.01-.01 0-.02-.01-.03-.01-.01 0-.02-.01-.03-.02-.01-.01-.02-.02-.03-.04-.03-.05-.06-.11-.08-.17-.04-.09-.07-.19-.1-.29 0-.01-.01-.02-.01-.03 0-.02.01-.04.01-.06.02-.14.05-.3.08-.48-.22.12-.47.22-.75.29-.38.1-.8.17-1.25.2h-.05c-.08 0-.16.01-.24.02v.05h.05c.29-.03.62-.05.79-.05z" />
                        </svg>
                        Pay with PayPal
                      </>
                    ) : paymentMethod === "bank" ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
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
                        Confirm Bank Transfer
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
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
                        Pay ${selectedAppointment.price || "0.00"}
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    {paymentMethod === "paypal"
                      ? "PayPal protects your payment information"
                      : paymentMethod === "bank"
                      ? "Bank transfers are processed within 1-2 business days"
                      : "Payments are secure and encrypted"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Quick Actions Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
          <div className="bg-green-600 text-white p-4">
            <h2 className="text-lg font-semibold flex items-center">
              <CalendarPlus className="mr-2" size={18} />
              Quick Actions
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/booking"
                className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <CalendarPlus className="text-green-600 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-700">
                  Schedule Service
                </span>
              </Link>

              <Link
                href="/contact"
                className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <MessageSquare className="text-green-600 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-700">
                  Contact Support
                </span>
              </Link>

              <Link
                href="/customers/payment"
                className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <CreditCard className="text-green-600 mb-2" size={24} />
                <span className="text-sm font-medium text-gray-700">
                  Make Payment
                </span>
              </Link>

              <Link
                href="/customers/settings"
                className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <button className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Settings className="text-green-600 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-700">
                    Account Settings
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
{imageModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-medium">Property Images</h3>
        <button 
          onClick={() => setImageModalOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4 flex flex-col items-center">
        <div className="relative w-full h-96 mb-4">
          <img
            src={selectedImages[currentImageIndex]?.url}
            alt={`Property image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain"
          />
          {selectedImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex(prev => (prev === 0 ? selectedImages.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentImageIndex(prev => (prev === selectedImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
        {selectedImages.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto py-2">
            {selectedImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 h-16 w-16 rounded-md overflow-hidden border-2 ${currentImageIndex === index ? 'border-green-500' : 'border-transparent'}`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </div>
    
  );
}
