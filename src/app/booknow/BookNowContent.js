// app/booknow/BookNowContent.js
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useStore  from "@/lib/store";
import DateTime from "@/components/booking/DateTimeSelection";
import CustomerDetails from "@/components/booking/CustomerDetails";
import ReviewBooking from "@/components/booking/BookingReview";

const BookNowContent = () => {
  const [step, setStep] = useState(1);
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const { updateCurrentBooking, currentBooking } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (serviceId && !currentBooking.serviceId) {
      updateCurrentBooking({ serviceId });
    } else if (!serviceId) {
      router.push("/services");
    }
  }, [serviceId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {step === 1 && <DateTime onNext={() => setStep(2)} onBack={() => router.back()} />}
      {step === 2 && <CustomerDetails onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <ReviewBooking onBack={() => setStep(2)} />}
    </div>
  );
};

export default BookNowContent;
