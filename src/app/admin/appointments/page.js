"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import AdminLayout from "../../../components/admin/AdminLayout";
import Button from "../../../components/ui/Button";
import { useDashboard } from "@/contexts/DashboardContext";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-toastify";
import {
  Upload,
  Calendar as CalendarIcon,
  List,
  Grid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import RecurringAppointmentModal from "./components/RecurringAppointmentModal";
import CrewAssignmentModal from "./components/CrewAssignmentModal";
import PaymentStatusModal from "./components/PaymentStatusModal";
import { useRouter } from "next/navigation";
import { useTenant } from "@/contexts/TenantContext";

// Status badge component with appropriate colors
const StatusBadge = ({ status }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";

  // Convert to lowercase for comparison to ensure consistent behavior
  const statusLower = status ? status.toLowerCase() : "";

  switch (statusLower) {
    case "pending":
    case "pending-estimate":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    case "scheduled":
      bgColor = "bg-blue-100";
      textColor = "text-blue-800";
      break;
    case "completed":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "cancelled":
    case "canceled":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    default:
      break;
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Format the status for display
  const formatStatus = (status) => {
    if (!status) return "Unknown";

    // If status contains hyphens, format each word
    if (status.includes("-")) {
      return status
        .split("-")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }

    // Otherwise just capitalize first letter
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {formatStatus(status)}
    </span>
  );
};

// Add the localizer for the calendar
const localizer = momentLocalizer(moment);


const AppointmentDetailsModal = ({ appointment, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAppointment, setEditedAppointment] = useState({
    ...appointment,
    date: appointment.date || "",
    timeSlot: appointment.timeSlot || {
      startTime: appointment.startTime || "",
      endTime: appointment.endTime || "",
    },
  });
  const [selectedPhotos, setSelectedPhotos] = useState({
    beforeService: [],
    afterService: [],
  });
  const [previewUrls, setPreviewUrls] = useState({
    beforeService: [],
    afterService: [],
  });
  const [activePhotoTab, setActivePhotoTab] = useState("beforeService");
  const [showFullImage, setShowFullImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploadErrors, setUploadErrors] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [dateChanged, setDateChanged] = useState(false);

  const errors = [];

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userData, isLoading } = useDashboard();

  const [completionDetails, setCompletionDetails] = useState({
    completedAt: appointment.completionDetails?.completedAt || "",
    duration: appointment.completionDetails?.duration || "",
    additionalWorkPerformed:
      appointment.completionDetails?.additionalWorkPerformed || "",
    customerSignature: appointment.completionDetails?.customerSignature || "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !userData?.token) {
      router.push("/login");
    }
  }, [isLoading, userData, router]);

  // Reset date changed flag when editing is toggled
  useEffect(() => {
    if (!isEditing) {
      setDateChanged(false);
    }
  }, [isEditing]);

  // Fetch available time slots when date changes in edit mode
  useEffect(() => {
    if (
      isEditing &&
      dateChanged &&
      editedAppointment.date &&
      editedAppointment.serviceId
    ) {
      fetchAvailableTimeSlots(
        editedAppointment.date,
        editedAppointment.serviceId
      );
    }
  }, [editedAppointment.date, isEditing, dateChanged]);

  const fetchAvailableTimeSlots = async (date, serviceId) => {
  setLoadingSlots(true);
  try {
    const headers = getAuthHeaders();
    const response = await axios.get(
      `${API_URL}/appointments/availability?date=${date}&serviceId=${serviceId}`,
      { headers }
    );

    if (response.data.success) {
      // Transform the backend response to match frontend expectations
      const transformedSlots = response.data.data.map(slot => ({
        start: slot.startTime,
        end: slot.endTime,
        available: slot.available
      }));
      setAvailableTimeSlots(transformedSlots);
    }
  } catch (error) {
    console.error("Error fetching time slots:", error);
    toast.error("Failed to load available time slots");
    setAvailableTimeSlots([]);
  } finally {
    setLoadingSlots(false);
  }
};

  // Get auth headers function
  const getAuthHeaders = (contentType = "application/json") => {
    const token = userData?.token;
    // || localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (!token) {
      console.error("No auth token available in modal");
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType,
    };
  };

  const handleUpdate = async () => {
  setLoading(true);
  try {
    const headers = getAuthHeaders();

    if (!headers.Authorization) {
      throw new Error("No authorization token available");
    }

    // Validate required fields
    if (
      !editedAppointment.date ||
      !editedAppointment.timeSlot?.startTime ||
      !editedAppointment.timeSlot?.endTime
    ) {
      throw new Error("Please select a date and time slot");
    }

    // Prepare the update data with proper time slot format
    const updateData = {
      date: editedAppointment.date,
      timeSlot: {
        startTime: editedAppointment.timeSlot.startTime,
        endTime: editedAppointment.timeSlot.endTime,
      },
      status: editedAppointment.status,
      notes: editedAppointment.notes,
    };

    const response = await axios.put(
      `${API_URL}/appointments/${appointment.id}`,
      updateData,
      { headers }
    );

    if (response.data.success) {
      const updatedAppointment = {
        ...appointment,
        ...editedAppointment,
        timeSlot: {
          startTime: editedAppointment.timeSlot.startTime,
          endTime: editedAppointment.timeSlot.endTime,
        },
        startTime: editedAppointment.timeSlot.startTime,
        endTime: editedAppointment.timeSlot.endTime,
      };
      
      // Call onUpdate with the updated appointment
      onUpdate(updatedAppointment);
      
      // Reset the editing state and update the local state
      setIsEditing(false);
      setEditedAppointment(updatedAppointment);
      
      toast.success("Appointment updated successfully");
    } else {
      throw new Error(
        response.data.message || "Failed to update appointment"
      );
    }
  } catch (error) {
    console.error("Update error:", error);
    toast.error(
      error.response?.data?.message ||
        error.message ||
        "Failed to update appointment"
    );
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();

      if (!headers.Authorization) {
        throw new Error("No authorization token available");
      }

      const response = await axios.delete(
        `${API_URL}/appointments/${appointment.id}`,
        { headers }
      );

      if (response.data.success) {
        toast.success("Appointment deleted successfully");
        onClose();
      } else {
        throw new Error(
          response.data.message || "Failed to delete appointment"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete appointment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e, type) => {
    const files = Array.from(e.target.files);
    setUploadErrors([]); // Clear previous errors

    if (files.length === 0) {
      setUploadErrors(["No files selected"]);
      toast.error("Please select at least one file");
      return;
    }

    const validFiles = [];
    const newPreviewUrls = [];
    const errors = [];

    files.forEach((file) => {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name}: Not an image file (${file.type})`);
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        errors.push(
          `${file.name}: File too large (${(file.size / (1024 * 1024)).toFixed(
            2
          )}MB)`
        );
        return;
      }

      // Check file extensions
      const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      const extension = file.name.split(".").pop().toLowerCase();
      if (!validExtensions.includes(extension)) {
        errors.push(`${file.name}: Invalid file type (.${extension})`);
        return;
      }

      // Check dimensions if needed (example)
      // Note: This would require creating an image element and checking dimensions
      // which is async and might complicate things, so I'm omitting it here

      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });

    // Set errors in state so UI can show them
    if (errors.length > 0) {
      setUploadErrors(errors);

      // Show a toast notification with all errors
      toast.error(
        <div>
          <p>Some files were invalid:</p>
          <ul className="list-disc pl-5">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>,
        { autoClose: 10000 } // Show for 10 seconds
      );
    }
    // Only update preview and selected photos if there are valid files
    if (validFiles.length > 0) {
      setSelectedPhotos((prev) => ({
        ...prev,
        [type]: [...prev[type], ...validFiles],
      }));

      setPreviewUrls((prev) => ({
        ...prev,
        [type]: [...prev[type], ...newPreviewUrls],
      }));
    }
  };

  const handlePhotoUpload = async (type) => {
    if (selectedPhotos[type].length === 0) {
      toast.info("Please select photos first");
      return;
    }

    setUploadingPhotos(true);

    try {
      const headers = getAuthHeaders("application/json");

      if (!headers.Authorization) {
        throw new Error("No authorization token available");
      }

      // Convert files to base64
      const photoData = await Promise.all(
        selectedPhotos[type].map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                data: reader.result.split(",")[1], // Remove the data:image/... prefix
                contentType: file.type,
                name: file.name,
              });
            reader.readAsDataURL(file);
          });
        })
      );

      const response = await axios.post(
        `${API_URL}/appointments/${appointment.id}/photos`,
        {
          photos: photoData,
          photoType: type,
        },
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Upload failed");
      }

      toast.success(
        `Successfully uploaded ${selectedPhotos[type].length} photo${
          selectedPhotos[type].length > 1 ? "s" : ""
        }`
      );

      const updatedAppointment = {
        ...appointment,
        photos: {
          ...appointment.photos,
          [type]: [
            ...(appointment.photos?.[type] || []),
            ...response.data.data,
          ],
        },
      };
      onUpdate(updatedAppointment);

      // Clear previews and selected photos
      setSelectedPhotos((prev) => ({ ...prev, [type]: [] }));
      setPreviewUrls((prev) => ({ ...prev, [type]: [] }));
    } catch (error) {
      console.error("Photo upload error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload photos"
      );
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePhoto = (type, index) => {
    setSelectedPhotos((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));

    URL.revokeObjectURL(previewUrls[type][index]);
    setPreviewUrls((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((urls) => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      });
    };
  }, [previewUrls]);

  const renderPhotoSection = () => {
    if (appointment.status !== "Completed") {
      return (
        <div className="bg-yellow-50 p-4 rounded-md mb-4">
          <p className="text-yellow-700">
            Photos can only be uploaded once the appointment is marked as
            completed.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md ${
              activePhotoTab === "beforeService"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActivePhotoTab("beforeService")}
          >
            Before Service
            {appointment.photos?.beforeService?.length > 0 && (
              <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs">
                {appointment.photos.beforeService.length}
              </span>
            )}
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activePhotoTab === "afterService"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActivePhotoTab("afterService")}
          >
            After Service
            {appointment.photos?.afterService?.length > 0 && (
              <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs">
                {appointment.photos.afterService.length}
              </span>
            )}
          </button>
        </div>

        {appointment.photos &&
          appointment.photos[activePhotoTab]?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Existing Photos</h4>
              <div className="grid grid-cols-3 gap-4">
                {appointment.photos[activePhotoTab].map((photo, index) => (
                  <div
                    key={index}
                    className="relative group cursor-pointer"
                    onClick={() => setShowFullImage(photo)}
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={photo.url}
                        alt={photo.caption || `Photo ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg transition-transform duration-200 hover:scale-105"
                      />
                    </div>
                    {photo.caption && (
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {photo.caption}
                      </p>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e, activePhotoTab)}
            className="hidden"
            id={`photo-upload-${activePhotoTab}`}
          />
          <label
            htmlFor={`photo-upload-${activePhotoTab}`}
            className="cursor-pointer flex flex-col items-center justify-center space-y-2"
          >
            <Upload className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500">
              Click to upload photos
            </span>
          </label>
        </div>

        {previewUrls[activePhotoTab].length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {previewUrls[activePhotoTab].map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <button
                  onClick={() => removePhoto(activePhotoTab, index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedPhotos[activePhotoTab].length > 0 && (
          <div className="mt-4">
            <Button
              onClick={() => handlePhotoUpload(activePhotoTab)}
              disabled={uploadingPhotos}
              className="w-full"
            >
              {uploadingPhotos ? "Uploading..." : "Upload Selected Photos"}
            </Button>
          </div>
        )}
      </div>
    );
  };

  if (isLoading || !userData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Appointment Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={editedAppointment.status}
                    onChange={(e) =>
                      setEditedAppointment((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      value={
                        editedAppointment.date
                          ? new Date(editedAppointment.date)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const newDate = e.target.value;
                        setEditedAppointment((prev) => ({
                          ...prev,
                          date: newDate,
                        }));
                        setDateChanged(true);
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time Slot
                    </label>
                    {loadingSlots && dateChanged ? (
                      <div className="mt-2 text-sm text-gray-500">
                        Loading available time slots...
                      </div>
                    ) : dateChanged && availableTimeSlots.length > 0 ? (
                     <select
  value={editedAppointment.timeSlot?.startTime || ""}
  onChange={(e) => {
    const selectedSlot = availableTimeSlots.find(
      (slot) => slot.start === e.target.value
    );
    if (selectedSlot) {
      setEditedAppointment((prev) => ({
        ...prev,
        timeSlot: {
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
        },
      }));
    }
  }}
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
>
  <option value="">Select a time slot</option>
  {availableTimeSlots.map((slot, index) => (
    <option
      key={index}
      value={slot.start}
      disabled={!slot.available}
      className={
        !slot.available
          ? "bg-gray-100 text-gray-400"
          : "bg-white text-gray-900"
      }
    >
      {`${slot.start} - ${slot.end}`}
      {!slot.available && " (Booked)"}
    </option>
  ))}
</select>
                    ) : (
                      <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 bg-gray-50">
                        {appointment.timeSlot
                          ? `${appointment.timeSlot.startTime} - ${appointment.timeSlot.endTime}`
                          : `${appointment.startTime} - ${appointment.endTime}`}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={editedAppointment.notes?.internal || ""}
                    onChange={(e) =>
                      setEditedAppointment((prev) => ({
                        ...prev,
                        notes: { ...prev.notes, internal: e.target.value },
                      }))
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    placeholder="Add internal notes..."
                  />
                </div>
              </div>
            ) : (
              <>
                <StatusBadge status={appointment.status} />
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">
                      {new Date(appointment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Time</p>
                    <p className="font-medium">
                      {appointment.timeSlot
                        ? `${appointment.timeSlot.startTime} - ${appointment.timeSlot.endTime}`
                        : `${appointment.startTime} - ${appointment.endTime}`}
                    </p>
                  </div>
                </div>
                {appointment.notes?.internal && (
                  <div className="mt-4">
                    <p className="text-gray-600">Internal Notes</p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">
                      {appointment.notes.internal}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="mb-6">
            {uploadErrors.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <h4 className="text-red-800 font-medium">Upload Errors:</h4>
                <ul className="mt-2 list-disc pl-5 text-sm text-red-700">
                  {uploadErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <h3 className="text-xl font-semibold mb-4">Service Photos</h3>
            {renderPhotoSection()}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button onClick={onClose} variant="secondary">
              Close
            </Button>
            {isEditing ? (
              // <Button onClick={handleUpdate}>Save Changes</Button>
              <Button onClick={handleUpdate} disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
        </div>
      </div>

      {showFullImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowFullImage(null)}
        >
          <div className="relative max-w-6xl w-full max-h-[90vh]">
            <img
              src={showFullImage.url}
              alt={showFullImage.caption || "Full size image"}
              className="w-full h-full object-contain"
            />
            {showFullImage.caption && (
              <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 text-center">
                {showFullImage.caption}
              </p>
            )}
            <button
              onClick={() => setShowFullImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Add CustomToolbar component
// const CustomToolbar = ({ onNavigate, onView, view, date, handleCalendarView }) => {
//   const goToToday = () => {
//     const today = new Date();
//     onNavigate('DATE', today);
//     // Force refresh the view
//     handleCalendarView(today, view);
//   };

//   const goToPrevious = () => {
//     let newDate;
//     if (view === 'month') {
//       newDate = moment(date).subtract(1, 'month').toDate();
//     } else if (view === 'week') {
//       newDate = moment(date).subtract(1, 'week').toDate();
//     } else {
//       newDate = moment(date).subtract(1, 'day').toDate();
//     }
//     onNavigate('DATE', newDate);
//     handleCalendarView(newDate, view);
//   };

//   const goToNext = () => {
//     let newDate;
//     if (view === 'month') {
//       newDate = moment(date).add(1, 'month').toDate();
//     } else if (view === 'week') {
//       newDate = moment(date).add(1, 'week').toDate();
//     } else {
//       newDate = moment(date).add(1, 'day').toDate();
//     }
//     onNavigate('DATE', newDate);
//     handleCalendarView(newDate, view);
//   };

//   const goToView = (newView) => {
//     onView(newView);
//     handleCalendarView(date, newView);
//   };

//   // Format the label based on the current view
//   const getLabel = () => {
//     const currentDate = moment(date);
//     switch (view) {
//       case 'month':
//         return currentDate.format('MMMM YYYY');
//       case 'week':
//         return `${currentDate.startOf('week').format('MMM D')} - ${currentDate.endOf('week').format('MMM D, YYYY')}`;
//       case 'day':
//         return currentDate.format('dddd, MMMM D, YYYY');
//       case 'agenda':
//         return `${currentDate.startOf('month').format('MMM D')} - ${currentDate.endOf('month').format('MMM D, YYYY')}`;
//       default:
//         return currentDate.format('MMMM YYYY');
//     }
//   };

//   return (
//     <div className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm mb-6 border border-gray-100">
//       <div className="flex items-center space-x-6">
//         <button
//           onClick={goToToday}
//           className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
//         >
//           Today
//         </button>
//         <div className="flex items-center space-x-2">
//           <button
//             onClick={goToPrevious}
//             className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
//           >
//             <ChevronLeft className="w-5 h-5" />
//           </button>
//           <button
//             onClick={goToNext}
//             className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
//           >
//             <ChevronRight className="w-5 h-5" />
//           </button>
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900">
//           {getLabel()}
//         </h2>
//       </div>
//       <div className="flex items-center space-x-2">
//         <div className="flex items-center space-x-1 bg-gray-50 rounded-xl p-2 shadow-sm border border-gray-100">
//           <button
//             onClick={() => goToView('month')}
//             className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${view === 'month'
//                 ? 'bg-white shadow-sm text-green-600 font-medium'
//                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//               }`}
//           >
//             Month
//           </button>
//           <button
//             onClick={() => goToView('week')}
//             className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${view === 'week'
//                 ? 'bg-white shadow-sm text-green-600 font-medium'
//                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//               }`}
//           >
//             Week
//           </button>
//           <button
//             onClick={() => goToView('day')}
//             className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${view === 'day'
//                 ? 'bg-white shadow-sm text-green-600 font-medium'
//                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//               }`}
//           >
//             Day
//           </button>
//           <button
//             onClick={() => goToView('agenda')}
//             className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${view === 'agenda'
//                 ? 'bg-white shadow-sm text-green-600 font-medium'
//                 : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//               }`}
//           >
//             Agenda
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
const CustomToolbar = ({
  onNavigate,
  onView,
  view,
  date,
  handleCalendarView,
}) => {
  const goToToday = () => {
    const today = new Date();
    onNavigate("DATE", today);
    handleCalendarView(today, view);
  };

  const goToPrevious = () => {
    let newDate;
    if (view === "month") {
      newDate = moment(date).subtract(1, "month").toDate();
    } else if (view === "week") {
      newDate = moment(date).subtract(1, "week").toDate();
    } else {
      newDate = moment(date).subtract(1, "day").toDate();
    }
    onNavigate("DATE", newDate);
    handleCalendarView(newDate, view);
  };

  const goToNext = () => {
    let newDate;
    if (view === "month") {
      newDate = moment(date).add(1, "month").toDate();
    } else if (view === "week") {
      newDate = moment(date).add(1, "week").toDate();
    } else {
      newDate = moment(date).add(1, "day").toDate();
    }
    onNavigate("DATE", newDate);
    handleCalendarView(newDate, view);
  };

  const goToView = (newView) => {
    onView(newView);
    handleCalendarView(date, newView);
  };

  const getLabel = () => {
    const currentDate = moment(date);
    switch (view) {
      case "month":
        return currentDate.format("MMMM YYYY");
      case "week":
        return `${currentDate.startOf("week").format("MMM D")} - ${currentDate
          .endOf("week")
          .format("MMM D, YYYY")}`;
      case "day":
        return currentDate.format("dddd, MMMM D, YYYY");
      case "agenda":
        return `${currentDate.startOf("month").format("MMM D")} - ${currentDate
          .endOf("month")
          .format("MMM D, YYYY")}`;
      default:
        return currentDate.format("MMMM YYYY");
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-white rounded-t-xl border-b border-gray-200">
      {/* Left side controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <button
          onClick={goToToday}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
        >
          Today
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevious}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">
          {getLabel()}
        </h2>
      </div>

      {/* View type selector */}
      <div className="flex flex-wrap gap-2 sm:gap-1">
        <button
          onClick={() => goToView("month")}
          className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all duration-200 ${
            view === "month"
              ? "bg-green-600 text-white font-medium shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Month
        </button>
        <button
          onClick={() => goToView("week")}
          className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all duration-200 ${
            view === "week"
              ? "bg-green-600 text-white font-medium shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Week
        </button>
        <button
          onClick={() => goToView("day")}
          className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all duration-200 ${
            view === "day"
              ? "bg-green-600 text-white font-medium shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Day
        </button>
        <button
          onClick={() => goToView("agenda")}
          className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all duration-200 ${
            view === "agenda"
              ? "bg-green-600 text-white font-medium shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

const CustomEvent = ({ event }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-gradient-to-r from-green-400 to-green-500";
      case "cancelled":
      case "canceled":
        return "bg-gradient-to-r from-red-400 to-red-500";
      case "scheduled":
        return "bg-gradient-to-r from-blue-400 to-blue-500";
      default:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500";
    }
  };

  return (
    <div className="p-2 h-full">
      <div className="flex items-start space-x-2 h-full">
        <div
          className={`w-1.5 rounded-full ${getStatusColor(event.status)} mt-1`}
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate text-white">
            {event.title}
          </div>
          <div className="text-xs text-white/90 mt-1">
            {moment(event.start).format("h:mm A")} -{" "}
            {moment(event.end).format("h:mm A")}
          </div>
          {event.customer?.address && (
            <div className="text-xs text-white/80 truncate mt-1">
              {`${event.customer.address?.street || ""}, ${
                event.customer.address?.city || ""
              }, ${event.customer.address?.state || ""}, ${
                event.customer.address?.zipCode || ""
              }`.trim()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DateAppointmentsModal = ({
  date,
  appointments,
  onClose,
  onEdit,
  setSelectedAppointment,
  setActiveModal,
}) => {
  const selectedDateStr = moment(date).format("YYYY-MM-DD");

  // Filter appointments for the selected date
  // In DateAppointmentsModal component, update the filtering logic:
  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = moment(apt.date).startOf("day");
    const selectedDateMoment = moment(date).startOf("day");
    return aptDate.isSame(selectedDateMoment);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Appointments for {moment(date).format("dddd, MMMM D, YYYY")}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No appointments scheduled for this date.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200 relative"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {appointment.customerName}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {appointment.serviceName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {appointment.timeSlot
                          ? `${appointment.timeSlot.startTime} - ${appointment.timeSlot.endTime}`
                          : `${appointment.startTime} - ${appointment.endTime}`}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 truncate max-w-md">
                        {appointment.address}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={appointment.status} />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => {
                          onEdit(appointment);
                          onClose();
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setActiveModal("crew");
                        }}
                        className={`${
                          appointment.crew?.leadProfessional ||
                          appointment.crew?.assignedTo?.length > 0
                            ? "text-blue-600 hover:text-blue-800"
                            : "text-green-600 hover:text-green-800"
                        }`}
                      >
                        {appointment.crew?.leadProfessional ||
                        appointment.crew?.assignedTo?.length > 0
                          ? "View Crew"
                          : "Assign Crew"}
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setActiveModal("payment");
                        }}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Payment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AppointmentsPage = () => {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userData, isLoading: isUserLoading } = useDashboard();
  const { tenant, isLoading: isTenantLoading } = useTenant();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("calendar");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    hasMore: true,
  });
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const getAuthHeaders = useCallback(() => {
    if (!userData?.token) {
      console.error("No auth token available in context");
      return {};
    }

    const headers = {
      Authorization: `Bearer ${userData.token}`,
      "Content-Type": "application/json",
    };

    // Add tenant subdomain header if available
    if (tenant?.subdomain) {
      headers["X-Tenant-Subdomain"] = tenant.subdomain;
    }

    return headers;
  }, [userData, tenant]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();

      if (!headers.Authorization) {
        throw new Error("No authorization token available");
      }

      // Add tenantId parameter if user is a tenant admin
      const url = `${API_URL}/appointments?limit=1000${
        userData?.role === "tenantAdmin" && tenant?.id
          ? `&tenantId=${tenant.id}`
          : ""
      }`;

      const appointmentsRes = await axios.get(url, { headers });

      if (!appointmentsRes.data.success) {
        throw new Error(
          appointmentsRes.data.message || "Failed to fetch appointments"
        );
      }

      const newAppointments = appointmentsRes.data?.data || [];

      const transformedAppointments = newAppointments.map((app) => ({
        id: app._id,
        customerName:
          app.customer?.user?.name ||
          `Customer ${app.customer?._id?.substring(0, 6)}` ||
          "N/A",
        customerPhone: app.customer?.phone || "N/A",
        address: app.customer?.address
          ? `${app.customer.address?.street || ""}, ${
              app.customer.address?.city || ""
            }, ${app.customer.address?.state || ""}, ${
              app.customer.address?.zipCode || ""
            }`.trim()
          : "N/A",
        serviceName: app.service?.name || "N/A",
        serviceId: app.service?._id || "",
        date: moment(app.date).toISOString(),
        start: moment(app.date).toISOString(),
        end: moment(app.date).toISOString(),
        timeSlot: {
          startTime: app.timeSlot?.startTime || "N/A",
          endTime: app.timeSlot?.endTime || "N/A",
        },
        startTime: app.timeSlot?.startTime || "N/A",
        endTime: app.timeSlot?.endTime || "N/A",
        status: app.status || "Pending",
        frequency: app.recurringType,
        payment: app.payment || {
          status: "Pending",
          amount: 0,
          paymentMethod: "Cash",
        },
        crew: app.crew || {
          leadProfessional: null,
          assignedTo: [],
        },
        notes: app.notes || {
          customer: "",
          professional: "",
          internal: "",
        },
        photos: app.photos || {
          beforeService: [],
          afterService: [],
        },
        tenantId: app.tenantId?._id || app.tenantId || null, // Add tenantId to appointment
      }));

      setAppointments(transformedAppointments);
      setError(null);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.response?.data?.message || err.message);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  }, [API_URL, getAuthHeaders, userData, tenant]);

  const handleCalendarView = useCallback(
  async (date, view) => {
    console.log("Loading calendar view for:", view, "date:", date);

    try {
      setLoading(true);
      const headers = getAuthHeaders();

      let start, end;
      const currentView = view || viewType;

      if (currentView === "month") {
        start = moment(date).startOf("month").format("YYYY-MM-DD");
        end = moment(date).endOf("month").format("YYYY-MM-DD");
      } else if (currentView === "week") {
        start = moment(date).startOf("week").format("YYYY-MM-DD");
        end = moment(date).endOf("week").format("YYYY-MM-DD");
      } else {
        // day view
        start = moment(date).format("YYYY-MM-DD");
        end = start;
      }

      // Include tenantId in the API request for tenant admins
      const url = `${API_URL}/appointments/calendar?start=${start}&end=${end}${
        userData?.role === "tenantAdmin" && tenant?.id
          ? `&tenantId=${tenant.id}`
          : ""
      }`;

      const response = await axios.get(url, { headers });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to load calendar events");
      }

      // Filter appointments by tenant (client-side fallback)
      let filteredEvents = response.data.data;
      if (userData?.role === "tenantAdmin" && tenant?.id) {
        filteredEvents = filteredEvents.filter(
          (event) => event.tenantId === tenant.id
        );
      }

      // Transform events for the calendar
      const transformedEvents = filteredEvents.map((event) => {
        const startDate = moment(event.start).utc().toDate();
        const endDate = moment(event.end).utc().toDate();

        return {
          ...event,
          id: event._id,
          title: `${event.serviceName || "Appointment"} - ${
            event.customerName || "Customer"
          }`,
          start: startDate,
          end: endDate,
          status: event.status,
          tenantId: event.tenantId, // Include tenantId for reference
        };
      });

      setCalendarEvents(transformedEvents);
      setCurrentDate(date);
      setError(null);
    } catch (error) {
      console.error("Calendar view error:", error);
      toast.error(error.response?.data?.message || "Failed to load calendar");
    } finally {
      setLoading(false);
    }
  },
  [API_URL, getAuthHeaders, userData, tenant, viewType]
);

  const fetchServices = useCallback(async () => {
    try {
      const headers = getAuthHeaders();

      if (!headers.Authorization) {
        throw new Error("No authorization token available");
      }

      // Add tenantId parameter if user is a tenant admin
      const url = `${API_URL}/services${
        userData?.role === "tenantAdmin" && tenant?.id
          ? `?tenantId=${tenant.id}`
          : ""
      }`;

      const servicesRes = await axios.get(url, { headers });

      if (!servicesRes.data.success) {
        throw new Error(servicesRes.data.message || "Failed to fetch services");
      }

      const transformedServices = (servicesRes.data?.data || []).map(
        (service) => ({
          _id: service._id,
          name: service.name,
          category: service.category,
          price: service.price,
        })
      );

      setServices(transformedServices);
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to load services"
      );
    }
  }, [API_URL, getAuthHeaders, userData, tenant]);

  useEffect(() => {
    if (!isUserLoading && !isTenantLoading && userData?.token) {
      fetchAppointments();
      fetchServices();
      const today = new Date();
      handleCalendarView(today, "month");
    }
  }, [isUserLoading, isTenantLoading, userData, fetchAppointments, fetchServices, handleCalendarView]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

   const filteredAppointments = [...appointments]
    .filter((appointment) => {
      // Add tenant filter for tenant admins
      if (userData?.role === "tenantAdmin" && tenant?.id) {
        if (appointment.tenantId !== tenant.id) {
          return false;
        }
      }

      const searchMatches =
        (appointment.customerName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (appointment.address?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (appointment.serviceName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        );

      const statusMatches =
        statusFilter === "all" || appointment.status === statusFilter;
      const serviceMatches =
        serviceFilter === "all" || appointment.serviceId === serviceFilter;

      return searchMatches && statusMatches && serviceMatches;
    })
    .sort((a, b) => {
      const aValue =
        sortField === "date" ? new Date(a[sortField]) : a[sortField];
      const bValue =
        sortField === "date" ? new Date(b[sortField]) : b[sortField];

      if (sortField === "date") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      } else if (typeof aValue === "string") {
        return sortDirection === "asc"
          ? (aValue || "").localeCompare(bValue || "")
          : (bValue || "").localeCompare(aValue || "");
      } else {
        return sortDirection === "asc"
          ? (aValue || 0) - (bValue || 0)
          : (bValue || 0) - (aValue || 0);
      }
    });

  const statuses = ["all", ...new Set(appointments.map((a) => a.status))];

  const handleUpdateAppointment = async (updatedAppointment) => {
  try {
    // Update the appointments list
    setAppointments((prevAppointments) =>
      prevAppointments.map((apt) =>
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      )
    );

    // Update calendar events
    setCalendarEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedAppointment.id
          ? {
              ...event,
              ...updatedAppointment,
              title: `${updatedAppointment.serviceName || "Appointment"} - ${
                updatedAppointment.customerName || "Customer"
              }`,
              status: updatedAppointment.status,
            }
          : event
      )
    );

    // Update the selected appointment if it's the one being edited
    if (selectedAppointment && selectedAppointment.id === updatedAppointment.id) {
      setSelectedAppointment(updatedAppointment);
    }

    toast.success("Appointment updated successfully");
    return updatedAppointment;
  } catch (error) {
    console.error("Update error:", error);
    toast.error(error.message || "Failed to update appointment");
    throw error;
  }
};
  const renderCalendar = () => (
    <div className="h-[800px] bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor={(event) => new Date(event.start)}
        endAccessor={(event) => new Date(event.end)}
        defaultDate={currentDate}
        onNavigate={(newDate, view) => {
          setCurrentDate(newDate);
          handleCalendarView(newDate, view);
        }}
        onView={(view) => {
          setViewType(view);
          handleCalendarView(currentDate, view);
        }}
        style={{ height: "100%" }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: "transparent",
            borderRadius: "4px",
            opacity: event.status === "Completed" ? 0.7 : 1,
            border: "none",
            color: "#fff",
            padding: "2px 4px",
            display: "block",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            background: `linear-gradient(135deg, 
            ${
              event.status === "Completed"
                ? "#34D399"
                : event.status === "Cancelled"
                ? "#F87171"
                : event.status === "Scheduled"
                ? "#60A5FA"
                : "#FBBF24"
            } 0%, 
            ${
              event.status === "Completed"
                ? "#10B981"
                : event.status === "Cancelled"
                ? "#EF4444"
                : event.status === "Scheduled"
                ? "#3B82F6"
                : "#F59E0B"
            } 100%)`,
          },
        })}
        onSelectEvent={(event) => {
          const appointment = appointments.find((apt) => apt.id === event.id);
          if (appointment) {
            setSelectedAppointment(appointment);
            setActiveModal("details");
          }
        }}
        onSelectSlot={(slotInfo) => {
          const selectedDate = moment(slotInfo.start).toDate();
          setSelectedDate(selectedDate);
        }}
        selectable={true}
        components={{
          toolbar: (props) => (
            <CustomToolbar {...props} handleCalendarView={handleCalendarView} />
          ),
          event: CustomEvent,
        }}
        views={["month", "week", "day", "agenda"]}
        defaultView="month"
        popup
        step={30}
        timeslots={2}
        min={new Date(0, 0, 0, 8, 0, 0)}
        max={new Date(0, 0, 0, 18, 0, 0)}
        dayLayoutAlgorithm="no-overlap"
      />
    </div>
  );

  const closeModal = () => {
    setSelectedAppointment(null);
    setActiveModal(null);
  };

  if (isUserLoading || isTenantLoading || loading) {
    return (
      <AdminLayout>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <p className="font-medium">Error loading appointments:</p>
          <p>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Appointments</h1>
          <div className="space-x-2">
            {/* <button
              onClick={() => router.push('/admin/appointments/new')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              New Appointment
            </button> */}
            <button
              onClick={() => setViewType("calendar")}
              className={`px-4 py-2 rounded-md ${
                viewType === "calendar"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewType("list")}
              className={`px-4 py-2 rounded-md ${
                viewType === "list"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              List View
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <label
                  htmlFor="status-filter"
                  className="block text-sm font-medium text-gray-700 sr-only"
                >
                  Status
                </label>
                <select
                  id="status-filter"
                  name="status-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "all"
                        ? "All Statuses"
                        : status
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="service-filter"
                  className="block text-sm font-medium text-gray-700 sr-only"
                >
                  Service
                </label>
                <select
                  id="service-filter"
                  name="service-filter"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                >
                  <option value="all">All Services</option>
                  {services &&
                    services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {viewType === "list" ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table headers */}
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sr.No.
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Service
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date & Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Payment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Crew
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment, index) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{index + 1}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.customerName}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-[200px]">
                          {appointment.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.serviceName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.frequency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.payment.status}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${appointment.payment.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setActiveModal("details");
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            View
                          </button>
                          {(appointment.status === "Scheduled" ||
                            appointment.status === "Rescheduled") && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setActiveModal("crew");
                                }}
                                className={`${
                                  appointment.crew?.leadProfessional ||
                                  appointment.crew?.assignedTo?.length > 0
                                    ? "text-blue-600 hover:text-blue-800"
                                    : "text-green-600 hover:text-green-800"
                                }`}
                              >
                                {appointment.crew?.leadProfessional ||
                                appointment.crew?.assignedTo?.length > 0
                                  ? "View Crew"
                                  : "Assign Crew"}
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedAppointment(appointment);
                                  setActiveModal("payment");
                                }}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                Payment
                              </button>
                              {appointment.recurringType === "One-time" && (
                                <button
                                  onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setActiveModal("recurring");
                                  }}
                                  className="text-orange-600 hover:text-orange-900"
                                >
                                  Recurring
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* <div className="text-sm text-gray-900">
    {appointment.crew?.leadProfessional?.name || 'No lead'}
  </div> */}
                        <div className="text-sm text-gray-500">
                          {appointment.crew?.assignedTo?.length || 0} team
                          members
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-4">
            {loading ? (
              <div className="flex items-center justify-center h-[800px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-[800px]">
                <div className="text-red-600">{error}</div>
              </div>
            ) : (
              renderCalendar()
            )}
          </div>
        )}

        {selectedDate && (
          <DateAppointmentsModal
            date={selectedDate}
            appointments={appointments}
            onClose={() => setSelectedDate(null)}
            onEdit={(appointment, modalType = "details") => {
              setSelectedAppointment(appointment);
              setActiveModal(modalType);
            }}
            setSelectedAppointment={setSelectedAppointment}
            setActiveModal={setActiveModal}
          />
        )}

        {selectedAppointment && activeModal === "details" && (
          <AppointmentDetailsModal
            appointment={selectedAppointment}
            onClose={closeModal}
            onUpdate={handleUpdateAppointment}
          />
        )}

        {selectedAppointment && activeModal === "recurring" && (
          <RecurringAppointmentModal
            appointment={selectedAppointment}
            onClose={closeModal}
            onUpdate={handleUpdateAppointment}
          />
        )}

        {selectedAppointment && activeModal === "crew" && (
          <CrewAssignmentModal
            appointment={selectedAppointment}
            onClose={closeModal}
            onUpdate={handleUpdateAppointment}
          />
        )}

        {selectedAppointment && activeModal === "payment" && (
          <PaymentStatusModal
            appointment={selectedAppointment}
            onClose={closeModal}
            onUpdate={handleUpdateAppointment}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AppointmentsPage;
