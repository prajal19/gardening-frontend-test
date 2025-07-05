"use client"
import React, { useRef, useState } from 'react';
import Container from '../ui/Container';
import { testimonials } from '../../lib/data/mockData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const [expandedTestimonials, setExpandedTestimonials] = useState({});
  const MAX_LENGTH = 150; // Maximum characters to show before 'Read more'

  const toggleReadMore = (id) => {
    setExpandedTestimonials(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400; // Adjust this value based on your needs
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <span className="inline-block mb-4 text-green-600 font-semibold">Testimonials</span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it — hear from our satisfied customers about their experience with our services.
          </p>
        </div>
        
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-8 pb-8 px-4 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col p-1 min-w-[350px] max-w-[350px] snap-center"
              >
                {/* Decorative quote mark */}
                <div className="absolute -top-3 left-6 text-3xl text-green-600 opacity-20 font-serif">
                  "
                </div>
                
                {/* Rating */}
                <div className="flex mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${
                        i < testimonial.rating ? 'text-green-600' : 'text-gray-200'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <div className="mb-1">
                  <span className="inline-block px-1.5 py-px text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                    Verified Client
                  </span>
                </div>
                
                {/* Testimonial text */}
                <blockquote className="text-gray-700 text-sm mb-1 leading-snug italic flex-grow">
                  {
                    testimonial.comment.length > MAX_LENGTH && !expandedTestimonials[testimonial.id] ? (
                      <>
                        "{testimonial.comment.substring(0, MAX_LENGTH)}..."
                        <button 
                          onClick={() => toggleReadMore(testimonial.id)} 
                          className="text-green-600 hover:text-green-700 font-medium text-xs ml-1 py-1 px-2 rounded-md hover:bg-green-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                        >
                          Read more
                        </button>
                      </>
                    ) : (
                      <>
                        "{testimonial.comment}"
                        {testimonial.comment.length > MAX_LENGTH && (
                          <button 
                            onClick={() => toggleReadMore(testimonial.id)} 
                            className="text-green-600 hover:text-green-700 font-medium text-xs ml-1 py-1 px-2 rounded-md hover:bg-green-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                          >
                            Read less
                          </button>
                        )}
                      </>
                    )
                  }
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center mt-auto">
                  <div className="h-8 w-8 rounded-full bg-gray-100 mr-2 flex items-center justify-center overflow-hidden border-2 border-green-600">
                    <span className="text-lg font-medium text-gray-600">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-xs">{testimonial.name}</p>
                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View more testimonials button */}
        {/* <div className="mt-16 text-center">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-300 shadow-sm">
            View More Testimonials
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div> */}
      </Container>
    </section>
  );
};

export default Testimonials;