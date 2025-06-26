"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useDashboard } from "@/contexts/DashboardContext";
import {
  Tag,
  AlertCircle,
  Search,
  Eye,
  Shield,
  Check,
  DollarSign,
  Calendar,
  Clock,
  X,
} from "lucide-react";
import CustomerLayout from "../../../components/customer/CustomerLayout";

const UserServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('');

  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const API_URL=process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userData, isLoading } = useDashboard();



  const fetchServices = async () => {
    const token = userData.token;
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/services`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedServices = Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setServices(fetchedServices);
      setLoading(false);
    } catch (error) {
      console.error(
        "Failed to fetch services:",
        error.response?.data || error.message
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setSelectedCategory(null); // Clear category filter when searching
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setSearchTerm(""); // Clear search term when filtering by category
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm("");
  };

  // Get all unique categories from services
  const allCategories = [
    ...new Set(services.map((service) => service.category).filter(Boolean)),
  ];

  const getRecommendedServices = () => {
    let filteredServices = services.filter((service) => service.isActive);

    // Apply category filter if selected
    if (selectedCategory) {
      filteredServices = filteredServices.filter(
        (service) => service.category === selectedCategory
      );
    }

    // Apply search filter
    if (searchTerm) {
      filteredServices = filteredServices.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (service.description &&
            service.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    // Sort by price (ascending)
    return [...filteredServices].sort((a, b) => a.basePrice - b.basePrice);
  };

  const recommendedServices = getRecommendedServices();

  // const formatDate = (dateString) => {
  //   if (!dateString) return "N/A";
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };

  // const getRemainingDays = (endDate) => {
  //   if (!endDate) return null;
  //   const end = new Date(endDate);
  //   const today = new Date();
  //   const diffTime = end - today;
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   return diffDays > 0 ? diffDays : 0;
  // };

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center mb-3">
              <span className="bg-green-600 text-white p-2 rounded-lg mr-3 shadow-lg">
                <Shield size={20} />
              </span>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Recommended Services
              </h1>
            </div>
            <p className="text-gray-500 ml-1">
              Our best value active service recommendations for you
            </p>
          </div>

          {/* Search and View Controls */}
          <div className="mt-6 md:mt-0 w-full md:w-auto flex flex-col md:flex-row gap-4">
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search services..."
                className="pl-10 pr-4 py-3 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-sm transition-all duration-300"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="inline-flex rounded-xl shadow-sm bg-white border border-gray-200 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Section */}
        {allCategories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-500">
                Filter by category:
              </span>
              <button
                onClick={clearFilters}
                className={`px-3 py-1.5 text-sm rounded-full flex items-center transition-all ${
                  !selectedCategory
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Categories
                {selectedCategory && <X size={14} className="ml-1" />}
              </button>
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`px-3 py-1.5 text-sm rounded-full flex items-center transition-all ${
                    selectedCategory === category
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Tag size={14} className="mr-1" />
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filter Indicator */}
        {(selectedCategory || searchTerm) && (
          <div className="mb-6 flex items-center">
            <span className="text-sm text-gray-500 mr-2">Active filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mr-2">
                Category: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="ml-1 text-emerald-600 hover:text-emerald-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="ml-1 text-gray-600 hover:text-gray-900"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              {/* <div className="w-12 h-12 border-4 border-emerald-200 rounded-full"></div> */}
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
            <p className="ml-3 text-gray-600">
              Loading recommended services...
            </p>
          </div>
        ) : recommendedServices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center max-w-lg mx-auto border border-gray-100 transform hover:scale-[1.01] transition-all duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500">
              <AlertCircle size={36} className="text-emerald-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-800">
              No services found
            </h3>
            <p className="text-gray-500 mt-2">
              {selectedCategory
                ? `No active services found in the ${selectedCategory} category.`
                : searchTerm
                ? "No services match your search criteria."
                : "We couldn't find any active services to recommend at this time."}
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg font-medium transform hover:-translate-y-0.5"
            >
              Clear Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedServices.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1 group"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image.url}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0"></div>
                </div>

                <div className="p-5">
                  <h3 className="text-2xl font-bold text-green-600 drop-shadow-md">
                    {service.name}
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <DollarSign size={18} className="text-emerald-500 mr-1" />
                      <span className="text-lg font-bold text-gray-600">
                        {service.basePrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 mb-5">
                    {service.category && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Tag size={16} className="mr-2 text-emerald-500" />
                        <span>{service.category}</span>
                      </div>
                    )}
                  </div>

                 {service.isActive && (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-3">
    <Check size={12} className="mr-1" />
    Active
  </span>
)}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <Link
                      href={`/customers/services/${service._id}`}
                      className="flex items-center text-green-600 hover:text-green-800 text-sm font-medium transition-colors duration-300"
                    >
                      <Eye size={16} className="mr-1" />
                      View Details
                    </Link>
                     <Link
                      href={`/booknow?serviceId=${service._id || service.id}`}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg flex items-center transition-colors duration-300 shadow-sm hover:shadow-md"
                    >
                      <Calendar size={16} className="mr-1" />
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
           <div className="flex justify-center">
          <div className="flex flex-col gap-4 w-full max-w-2xl">
            {recommendedServices.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col flex justify-center md:flex-row">
                  <div className="relative md:w-64 h-40 md:h-auto overflow-hidden">
                    <img
                      src={service.image.url}
                      alt={service.name}
                      className="w-full h-52 object-cover object-center"
                    />
                  </div>

                  <div className="flex-1 p-5">
                    <div className="flex flex-col md:flex-row justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-semibold text-green-600 group-hover:text-emerald-700 transition-colors duration-300">
                          {service.name}
                        </h3>
                        <div className="flex items-center mt-1">
                          <DollarSign
                            size={16}
                            className="text-emerald-500 mr-1"
                          />
                          <span className="text-lg font-bold text-gray-900">
                            {service.basePrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* <p className="text-gray-500 mb-4 text-sm group-hover:text-gray-600 transition-colors duration-300">
                      {service.description || "No description available."}
                    </p> */}

                    <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
                      {service.category && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Tag size={16} className="mr-2 text-emerald-500" />
                          <span>{service.category}</span>
                        </div>
                      )}
                    </div>
                  {service.isActive && (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
    <Check size={12} className="mr-1" />
    Active
  </span>
)}

                    <div className="flex justify-end items-center gap-3 pt-2">
                      <Link
                        href={`/customers/services/${service._id}`}
                        className="flex items-center text-emerald-600 hover:text-emerald-800 text-sm font-medium transition-colors duration-300"
                      >
                        <Eye size={16} className="mr-1" />
                        View Details
                      </Link>
                       <Link
                      href={`/booknow?serviceId=${service._id || service.id}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg flex items-center transition-colors duration-300 shadow-sm hover:shadow-md"
                    >
                      <Calendar size={16} className="mr-1" />
                      Book Now
                    </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        )}

        {!loading && recommendedServices.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-500">
              Showing {recommendedServices.length} recommended services
              {selectedCategory ? ` in ${selectedCategory}` : ""}
            </p>
          </div>
        )}
      
      </div>
    </CustomerLayout>
  );
};

export default UserServices;
