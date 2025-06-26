'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchActiveAnnouncement = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const apiUrl = `${baseUrl.substring(0, baseUrl.lastIndexOf('/api/v1'))}/api/v1/announcements/active`;
        
        const response = await axios.get(apiUrl);
        
        if (response.data) {
          setAnnouncement(response.data);
          setTimeout(() => {
            setIsVisible(true);
          }, 300);
          
          if (response.data.displayDuration) {
            setTimeout(() => {
              handleDismiss();
            }, response.data.displayDuration * 1000);
          }
        }
      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
    };

    fetchActiveAnnouncement();
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 10000);
    setIsVisible(false);
  };

  if (!announcement || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 overflow-hidden mt-16">
      <motion.div 
        className="bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-4 shadow-lg"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        exit={{ y: -50 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="container mx-auto relative overflow-hidden">
          {/* Marquee content - now scrolling left to right */}
          <motion.div
            className="flex items-center whitespace-nowrap"
            animate={{
              x: ['100%', '0%'],
              transition: {
                x: {
                  repeat: true,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                  
                }
              }
            }}
            style={{ animationPlayState: isHovered ? 'paused' : 'running' }}
          >
            <div className="flex items-center space-x-8 mr-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{announcement.title}</span>
              </div>
              <div className="text-sm font-light">{announcement.message}</div>
            </div>
            
            {/* Duplicate for seamless looping */}
            {/* <div className="flex items-center space-x-8 mr-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{announcement.title}</span>
              </div>
              <div className="text-sm font-light">{announcement.message}</div>
            </div> */}
          </motion.div>

          {/* Close button */}
          <motion.button
            onClick={handleDismiss}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 rounded-full p-1 hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Progress indicator */}
        {announcement.displayDuration && (
          <motion.div 
            className="absolute bottom-0 left-0 h-0.5 bg-white/30"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: announcement.displayDuration, ease: "linear" }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default AnnouncementBanner;