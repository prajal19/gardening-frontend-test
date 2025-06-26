"use client";
import { useEffect, useState, useContext  } from "react";
import { useParams } from "next/navigation";

import axios from "axios";

import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Check,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
// import { DashboardContext } from "../../../../context/DashboardContext";
import { useDashboard } from '@/contexts/DashboardContext';
import CustomerLayout from "@/components/customer/CustomerLayout"; 
export default function ServiceDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const { userData } = useDashboard();
 const API_URL=process.env.NEXT_PUBLIC_API_BASE_URL;

 
  useEffect(() => {
    const fetchService = async () => {
      try {
       if (!userData?.token) {
          throw new Error("Authentication token not available");
        }
        const response = await axios.get(
          `${API_URL}/services/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userData.token}`,
            },
          }
        );
        setService(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch service");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id,userData?.token]);

  // Format date function
  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";
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
        <div className="text-center py-10">
          <div className="text-red-500 mb-4">{error}</div>
          <Link
            href="/customer/services"
            className="text-green-600 hover:underline"
          >
            <ArrowLeft className="inline mr-1" size={16} />
            Back to services
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  if (!service) {
    return (
      <CustomerLayout>
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold mb-4">Service not found</h2>
          <Link
            href="/customer/services"
            className="text-green-600 hover:underline"
          >
            <ArrowLeft className="inline mr-1" size={16} />
            Back to services
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/customers/services"
          className="inline-flex items-center text-green-600 hover:text-green-800 mb-6"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Services
        </Link>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
          <div className="md:flex">
            {/* LEFT SIDE (image) */}

            <div className="md:w-1/2 bg-slate-50">
              <div className="flex justify-center items-center h-full p-4">
                <img
                  src={service.image.url}
                  alt={service.name}
                  className="h-72 max-w-full object-contain rounded"
                />
              </div>
            </div>

            <div className="p-6 md:w-2/3">
              <h1 className="text-2xl font-bold text-green-600 mb-2">
                {service.name}
              </h1>

              <div className="mb-8">
                <h3 className="font-medium text-slate-700 mb-2">
                  Description:{" "}
                </h3>
                <p className="text-slate-600">
                  {service.description || "No description available."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
                  <Tag size={14} className="mr-1" />
                  {service.category || "Uncategorized"}
                </span>

                {service.isActive && (
  <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center">
    <Check size={14} className="mr-1" />
    Active
  </span>
)}

              </div>

              <div className="flex gap-6 mb-10">
                {/* Pricing Section */}
                <div className="w-1/2">
                  <h3 className="font-medium text-slate-700 mb-3 flex items-center">
                    <DollarSign size={16} className="mr-2 text-green-600" />
                    Pricing
                  </h3>
                  <p className="text-2xl font-bold">
                    ${service.basePrice?.toFixed(2) || "0.00"}
                  </p>
                </div>

                {/* Duration Section */}
                <div className="w-1/2">
                  <h3 className="font-medium text-slate-700 mb-3 flex items-center">
                    <Clock size={16} className="mr-2 text-green-600" />
                    Duration
                  </h3>
                  <p className="text-2xl font-bold">
                    {service.duration} minutes
                  </p>
                </div>
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               

                <div className="bg-slate-50 w-[400px] p-4 rounded-lg">
  <h3 className="font-medium text-slate-700 mb-3 flex items-center">
    <Tag size={16} className="mr-2 text-green-600" />
    Packages
  </h3>
  <div className="space-y-4">
    {service.packages?.map((pkg) => (
      <div key={pkg._id} className="border-b pb-2">
        <p className="font-semibold text-slate-800">{pkg.name}</p>
        <p className="text-sm text-slate-600">{pkg.description}</p>
        <ul className="list-disc list-inside text-sm text-slate-500 mt-1">
          {pkg.additionalFeatures.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <p className="text-sm text-green-700 mt-1">
          Price Multiplier: x{pkg.priceMultiplier}
        </p>
      </div>
    ))}
  </div>
</div>

              </div> */}

              <div className="flex flex-wrap gap-3">
                {/* <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Manage Service
                </button> */}
               <Link href="/contact">
  <button className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-green-500 transition-colors">
    Contact Support
  </button>
</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
