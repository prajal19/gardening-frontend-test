'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useDashboard } from '@/contexts/DashboardContext';
import { useTenant } from '@/contexts/TenantContext';
import { ArrowRight, Leaf, Calendar, Star, ChevronDown } from 'lucide-react';
import AnnouncementBanner from '@/components/home/AnnouncementBanner';
import { motion } from 'framer-motion';
import { AnimatePresence } from "framer-motion";

const Hero = () => {
  const { userData, isLoading } = useDashboard();
  const { tenant, getTenantApiClient } = useTenant();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [heroImage, setHeroImage] = useState('/images/landscaping-image.png');
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Budgeted Maintenance",
      description: "Consistent care to keep your yard pristine"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Premium Service",
      description: "Good quality with attention to each detail"
    }
  ];
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  useEffect(() => {
    // Fetch current hero image
    const fetchHeroImage = async () => {
      try {
        // Use tenant-specific API client
        const tenantApiClient = getTenantApiClient();
        const response = await tenantApiClient.get('/hero-image');
        const data = response.data;
        if (data.success && data.data?.url) {
          setHeroImage(data.data.url);
        }
      } catch (error) {
        console.error('Error fetching hero image:', error);
      }
    };

    // Only fetch if we have a tenant context
    if (tenant) {
      fetchHeroImage();
    }
  }, [tenant, getTenantApiClient]);

  const handleCreateEstimateClick = (e) => {
    e.preventDefault();

    const token = userData?.token;
    const role = userData?.role || '';

    if (token && role === 'customer') {
      router.push('/create-estimate');
    } else {
      // Append redirect query
      router.push('/login?redirect=/create-estimate');
    }
  };

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  useEffect(() => {
    const token = userData?.token || null;
    setIsLoggedIn(!!token);
  }, [userData]);

  const goToBookingDetail = () => {
    const token = userData?.token;
    if (!token) {
      router.push("/signup");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === "customer") {
        router.push("/booking");
      } else {
        alert("Access Denied: You are not authorized to access this page.");
      }
    } catch (error) {
      console.error("Invalid token", error);
      router.push("/login");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      
      {/* Removed h-[80vh] to prevent fixed height issues */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <AnnouncementBanner />
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full">
            {/* Animated background image */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center h-full w-full transform scale-110"
              style={{
                backgroundImage: `url(${heroImage})`,
              }}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1.15, x: -5, y: -5 }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
            ></motion.div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
          </div>
        </div>

        {/* Content area - adjusted pt to account for header height */}
        <div className="relative z-10 h-full flex flex-col justify-center pt-24 md:pt-32 pb-16">
          <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-8 items-start">
            {/* Left side - Text content */}
            <motion.div 
              className="text-white space-y-5 max-w-xl mt-10"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.h1 
                className="text-5xl md:text-6xl font-bold leading-tight"
                variants={itemVariants}
              >
                Transform Your <br />
                <motion.span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-500"
                  initial={{ backgroundPosition: "0% 50%" }}
                  animate={{ backgroundPosition: "100% 50%" }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear"
                  }}
                >
                  Outdoor Space
                </motion.span>
              </motion.h1>

              <motion.p 
                className="text-lg md:text-xl text-white/80 leading-relaxed"
                variants={itemVariants}
              >
                Professional landscaping and lawn care services customized to your needs.
                From regular maintenance to complete redesigns, we'll keep your yard
                looking its best all year round.
              </motion.p>

              {/* Dynamic Feature Cards */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeatureIndex}
                  className="bg-white rounded-lg p-4 border-2 border-green-200 inline-block mt-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-green-600 p-2 bg-green-50 rounded-full flex-shrink-0">
                      {features[currentFeatureIndex].icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-green-800">
                        {features[currentFeatureIndex].title}
                      </h3>
                      <p className="text-sm text-green-600">
                        {features[currentFeatureIndex].description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Right side - Visual element */}
            <div className="hidden md:block">
              <motion.div 
                className="relative mt-10"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Animated decorative elements */}
                <motion.div 
                  className="absolute -top-10 -right-10 w-40 h-40 bg-green-500 rounded-full opacity-20 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.3, 0.2]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                <motion.div 
                  className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-300 rounded-full opacity-20 blur-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.2, 0.25, 0.2]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                ></motion.div>

                {/* Card element */}
                <motion.div 
                  className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 shadow-xl relative overflow-hidden"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="absolute -right-10 -bottom-10 w-32 h-32 bg-green-400/20 rounded-full blur-xl"
                    animate={{
                      x: [0, -10, 0],
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  ></motion.div>

                  <div className="space-y-6">
                    <motion.h3 
                      className="text-2xl font-semibold text-green-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      Ready for a beautiful yard?
                    </motion.h3>

                    <div className="space-y-4">
                      <motion.div 
                        className="flex items-start gap-3 bg-white p-3 rounded-lg border border-green-100"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <motion.div 
                          className="bg-green-100 p-2 rounded-full text-green-600"
                          whileHover={{ rotate: 15 }}
                        >
                          <Calendar className="w-5 h-5" />
                        </motion.div>
                        <div>
                          <h4 className="text-green-800 font-medium">Fast Scheduling</h4>
                          <p className="text-sm text-green-600">Book your service in just minutes</p>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="flex items-start gap-3 bg-white p-3 rounded-lg border border-green-100"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <motion.div 
                          className="bg-green-100 p-2 rounded-full text-green-600"
                          whileHover={{ rotate: 15 }}
                        >
                          <Star className="w-5 h-5" />
                        </motion.div>
                        <div>
                          <h4 className="text-green-800 font-medium">Top-Rated Service</h4>
                          <p className="text-sm text-green-600">Trusted by homeowners across the region</p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Two-button layout */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        onClick={goToBookingDetail}
                        className="bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Schedule Consultation
                      </motion.button>
                      <Link href="/create-estimate">
                        <motion.button 
                          className="bg-white text-green-700 border border-green-600 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors duration-300 w-full"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCreateEstimateClick}
                        >
                          Request Estimate
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;