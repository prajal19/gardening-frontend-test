"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import CustomerLayout from "../../../../components/customer/CustomerLayout";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Package,
  HardHat,
  User,
  ArrowLeft,
} from "lucide-react";
import { useDashboard } from "@/contexts/DashboardContext";

const AppointmentDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userData } = useDashboard();

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!userData?.token) {
        throw new Error("Authentication required");
      }

      const response = await axios.get(`${API_URL}/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || "Appointment not found");
      }

      setAppointment(response.data.data);
    } catch (err) {
      setError(err.message || "Error fetching appointment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.token) {
      fetchDetails();
    }
  }, [userData, id]);

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
        <div className="p-4">
          <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back link */}
        <button
          onClick={() => router.push("/customers/appointments")}
          className="mb-8 inline-flex items-center text-emerald-700 font-semibold hover:text-emerald-900 transition"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Appointments
        </button>

        {appointment && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white p-6 rounded-2xl shadow-md">
              <h2 className="text-3xl font-bold mb-2">Appointment Details</h2>
              <p className="text-green-100 text-lg">
                {appointment.service?.name || "Service"}
              </p>
            </div>

            {/* Detail Card */}
            <div className="mt-6 bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6">
              {/* Category */}
              <div className="flex items-center text-gray-700 text-base font-medium">
                <HardHat className="h-5 w-5 text-green-600 mr-3" />
                {appointment.service?.category || "No category"}
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem 
                  icon={Calendar} 
                  label="Date" 
                  value={
                    appointment?.date 
                      ? new Date(appointment.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not available"
                  } 
                />

                <InfoItem 
                  icon={Clock} 
                  label="Time" 
                  value={
                    appointment?.timeSlot 
                      ? `${appointment.timeSlot.startTime} - ${appointment.timeSlot.endTime}`
                      : "Not available"
                  } 
                />

                <InfoItem 
                  icon={Package} 
                  label="Package" 
                  value={appointment.packageType || "Standard"} 
                />
                
                <InfoItem 
                  icon={CreditCard} 
                  label="Payment Status" 
                  value={appointment.payment?.status || "Pending"} 
                />
                
                <InfoItem 
                  icon={User} 
                  label="Attendee" 
                  value={appointment.attendee?.name || "Not assigned"} 
                />
                
                <InfoItem 
                  icon={CheckCircle} 
                  label="Status" 
                  value={appointment.status || "Unknown"} 
                />
              </div>
            </div>
          </>
        )}
      </div>
    </CustomerLayout>
  );
};

// Reusable info item component
const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center text-gray-700 text-base">
    <Icon className="h-5 w-5 text-green-600 mr-3" />
    <div>
      <p className="font-semibold">{label}</p>
      <p className="text-sm text-gray-600">{value}</p>
    </div>
  </div>
);

export default AppointmentDetails;