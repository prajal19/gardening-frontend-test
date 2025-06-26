// app/booking/page.js
"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import SelectService from "@/components/booking/SelectService";
import DateTime from "@/components/booking/DateTime";
import CustomerDetails from "@/components/booking/CustomerDetails";
import ReviewBooking from "@/components/booking/ReviewBooking";

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const searchParams = useSearchParams();
  const { updateCurrentBooking, currentBooking } = useStore();

  const serviceIdFromUrl = searchParams.get("serviceId");

  useEffect(() => {
    if (serviceIdFromUrl && !currentBooking.serviceId) {
      updateCurrentBooking({ serviceId: serviceIdFromUrl });
      setStep(2); // Skip SelectService if serviceId is pre-selected
    }
  }, [serviceIdFromUrl]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {step === 1 && <SelectService onNext={() => setStep(2)} />}
      {step === 2 && <DateTime onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <CustomerDetails onNext={() => setStep(4)} onBack={() => setStep(2)} />}
      {step === 4 && <ReviewBooking onBack={() => setStep(3)} />}
    </div>
  );
}
