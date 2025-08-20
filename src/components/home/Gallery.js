// 'use client';

// import React, { useState, useEffect } from 'react';
// import Container from '../ui/Container';
// import Link from 'next/link';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { X, Calendar, MapPin, Clock, User, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
// import { useTenant } from '../../contexts/TenantContext';

// const Portfolio = () => {
//   const [portfolios, setPortfolios] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedPortfolio, setSelectedPortfolio] = useState(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [displayCount, setDisplayCount] = useState(6);
//   const [hasMore, setHasMore] = useState(true);
//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const { tenant, isLoading: tenantLoading } = useTenant();

//   useEffect(() => {
//     if (tenantLoading || !tenant) return;
//     const fetchPortfolios = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/portfolio`, {
//           headers: {
//             'X-Tenant-Subdomain': tenant.subdomain,
//           },
//         });
        
//         // Transform portfolio data for display
//         const formattedPortfolios = response.data.data.map(portfolio => ({
//           id: portfolio._id,
//           title: portfolio.title,
//           category: portfolio.category,
//           date: new Date(portfolio.projectDate).toLocaleDateString(),
//           description: portfolio.description,
//           location: portfolio.location,
//           clientName: portfolio.clientName || 'Not specified',
//           projectDuration: portfolio.projectDuration || 'Not specified',
//           tags: portfolio.tags || [],
//           status: portfolio.status || 'draft',
//           // Use the first image as the main display photo
//           mainImage: portfolio.images?.[0]?.url || null,
//           images: portfolio.images || []
//         }));

//         setPortfolios(formattedPortfolios);
//         setHasMore(formattedPortfolios.length > 6);
//       } catch (error) {
//         console.error('Error fetching portfolios:', error);
//         toast.error('Failed to load portfolio projects');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPortfolios();
//   }, [tenant, tenantLoading, API_URL]);

//   const handleLoadMore = () => {
//     setDisplayCount(prev => prev + 6);
//     setHasMore(portfolios.length > displayCount + 6);
//   };

//   const handlePortfolioClick = (portfolio) => {
//     setSelectedPortfolio(portfolio);
//     setCurrentImageIndex(0);
//   };

//   const handleCloseModal = () => {
//     setSelectedPortfolio(null);
//     setCurrentImageIndex(0);
//   };

//   const handleNextImage = () => {
//     if (selectedPortfolio && selectedPortfolio.images.length > 0) {
//       setCurrentImageIndex((prev) => 
//         prev === selectedPortfolio.images.length - 1 ? 0 : prev + 1
//       );
//     }
//   };

//   const handlePrevImage = () => {
//     if (selectedPortfolio && selectedPortfolio.images.length > 0) {
//       setCurrentImageIndex((prev) => 
//         prev === 0 ? selectedPortfolio.images.length - 1 : prev - 1
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <section className="py-12 bg-gray-50">
//         <Container>
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">Loading portfolio...</p>
//           </div>
//         </Container>
//       </section>
//     );
//   }

//   return (
//     <section className="py-12 bg-gray-50">
//       <Container>
//         <div className="text-center mb-8">
//           <span className="inline-block mb-2 text-green-600 font-semibold">Our Work</span>
//           <h2 className="text-3xl font-bold text-gray-900 mb-3">Portfolio Showcase</h2>
//           <div className="w-20 h-1 bg-green-600 mx-auto mb-4"></div>
//           <p className="text-base text-gray-600 max-w-2xl mx-auto">
//             Explore our collection of beautifully transformed outdoor spaces that showcase our craftsmanship and attention to detail.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {portfolios.slice(0, displayCount).map((portfolio) => (
//             <div 
//               key={portfolio.id} 
//               className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col cursor-pointer transform hover:-translate-y-1"
//               onClick={() => handlePortfolioClick(portfolio)}
//             >
//               <div className="relative overflow-hidden h-48">
//                 {portfolio.mainImage ? (
//                   <img
//                     src={portfolio.mainImage}
//                     alt={portfolio.title}
//                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                     <svg className="w-10 h-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                     </svg>
//                   </div>
//                 )}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
//                   <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
//                     <span className="text-white/90 text-xs font-medium">{portfolio.category}</span>
//                     <h3 className="text-white font-bold text-lg mt-1">{portfolio.title}</h3>
//                     <p className="text-white/80 text-sm mt-2 line-clamp-2">{portfolio.description}</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="p-4 flex-grow flex flex-col">
//                 <div className="mb-2">
//                   <span className="inline-block px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
//                     {portfolio.category}
//                   </span>
//                 </div>
//                 <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-green-600 transition-colors duration-300">{portfolio.title}</h3>
//                 <p className="text-gray-500 text-xs mb-1 flex items-center">
//                   <MapPin className="w-3 h-3 mr-1" />
//                   {portfolio.location}
//                 </p>
//                 <p className="text-gray-500 text-xs mb-2 flex items-center">
//                   <Calendar className="w-3 h-3 mr-1" />
//                   {portfolio.date}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="mt-8 text-center">
//           {hasMore ? (
//             <button
//               onClick={handleLoadMore}
//               className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
//             >
//               Load More
//               <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                 <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//           ) : (
//             <Link href="/portfolio">
//               <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
//                 View Full Portfolio
//                 <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                   <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </span>
//             </Link>
//           )}
//         </div>

//         {/* Portfolio Modal */}
//         {selectedPortfolio && (
//           <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//             <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
//               <div className="relative">
//                 {/* Close button */}
//                 <button
//                   onClick={handleCloseModal}
//                   className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300 hover:scale-110"
//                 >
//                   <X className="w-6 h-6 text-gray-600" />
//                 </button>

//                 {/* Image carousel */}
//                 <div className="relative h-[40vh] bg-gray-100">
//                   {selectedPortfolio.images.length > 0 ? (
//                     <>
//                       <img
//                         src={selectedPortfolio.images[currentImageIndex].url}
//                         alt={selectedPortfolio.title}
//                         className="w-full h-full object-contain transition-opacity duration-300"
//                       />
//                       {selectedPortfolio.images.length > 1 && (
//                         <>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handlePrevImage();
//                             }}
//                             className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300 hover:scale-110"
//                           >
//                             <ChevronLeft className="w-6 h-6 text-gray-600" />
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleNextImage();
//                             }}
//                             className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300 hover:scale-110"
//                           >
//                             <ChevronRight className="w-6 h-6 text-gray-600" />
//                           </button>
//                         </>
//                       )}
//                     </>
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center">
//                       <svg className="w-16 h-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                       </svg>
//                     </div>
//                   )}
//                 </div>

//                 {/* Portfolio details */}
//                 <div className="p-6 overflow-y-auto max-h-[50vh]">
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     <span className="inline-block px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
//                       {selectedPortfolio.category}
//                     </span>
//                     <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
//                       selectedPortfolio.status === 'published' 
//                         ? 'text-blue-600 bg-blue-100' 
//                         : selectedPortfolio.status === 'draft'
//                         ? 'text-yellow-600 bg-yellow-100'
//                         : 'text-gray-600 bg-gray-100'
//                     }`}>
//                       {selectedPortfolio.status.charAt(0).toUpperCase() + selectedPortfolio.status.slice(1)}
//                     </span>
//                   </div>

//                   <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedPortfolio.title}</h2>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                     <div className="flex items-center text-gray-600">
//                       <MapPin className="w-5 h-5 mr-2 text-green-600" />
//                       <span>{selectedPortfolio.location}</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <Calendar className="w-5 h-5 mr-2 text-green-600" />
//                       <span>{selectedPortfolio.date}</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <User className="w-5 h-5 mr-2 text-green-600" />
//                       <span>{selectedPortfolio.clientName}</span>
//                     </div>
//                     <div className="flex items-center text-gray-600">
//                       <Clock className="w-5 h-5 mr-2 text-green-600" />
//                       <span>{selectedPortfolio.projectDuration}</span>
//                     </div>
//                   </div>

//                   <div className="mb-6">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
//                     <p className="text-gray-600">{selectedPortfolio.description}</p>
//                   </div>

//                   {selectedPortfolio.tags.length > 0 && (
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
//                       <div className="flex flex-wrap gap-2">
//                         {selectedPortfolio.tags.map((tag, index) => (
//                           <span 
//                             key={index}
//                             className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full"
//                           >
//                             <Tag className="w-4 h-4 mr-1" />
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </Container>
//     </section>
//   );
// };

// export default Portfolio;


'use client';

import React, { useState, useEffect } from 'react';
import Container from '../ui/Container';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X, Calendar, MapPin, Clock, User, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTenant } from '../../contexts/TenantContext';

const Portfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [displayCount, setDisplayCount] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { tenant, isLoading: tenantLoading, isClient } = useTenant();

  useEffect(() => {
    // Wait for tenant to load and client-side rendering
    if (tenantLoading || !isClient) return;
    
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        
        // Prepare headers - only send tenant subdomain if we're on a tenant site
        const headers = {};
        if (tenant?.subdomain) {
          headers['X-Tenant-Subdomain'] = tenant.subdomain;
        }
        
        // Use a different endpoint for all portfolios when no tenant
        const endpoint = tenant?.subdomain ? '/portfolio' : '/portfolio/all';
        
        const response = await axios.get(`${API_URL}${endpoint}`, { headers });
        
        // Transform portfolio data for display
        const formattedPortfolios = response.data.data.map(portfolio => ({
          id: portfolio._id,
          title: portfolio.title,
          category: portfolio.category || portfolio.serviceType || 'Project',
          date: new Date(portfolio.projectDate).toLocaleDateString(),
          description: portfolio.description,
          location: portfolio.location,
          clientName: portfolio.clientName || 'Not specified',
          projectDuration: portfolio.projectDuration || 'Not specified',
          tags: portfolio.tags || [],
          status: portfolio.status || 'draft',
          // Use the first image as the main display photo
          mainImage: portfolio.images?.[0]?.url || null,
          images: portfolio.images || [],
          // Include tenant info if available (for main domain view)
          tenant: portfolio.tenant
        }));

        setPortfolios(formattedPortfolios);
        setHasMore(formattedPortfolios.length > 6);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
        
        // Handle 404 error for /all endpoint gracefully
        if (error.response?.status === 404 && !tenant?.subdomain) {
          // Fallback to empty array if /all endpoint doesn't exist
          setPortfolios([]);
        } else {
          toast.error('Failed to load portfolio projects');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [tenant, tenantLoading, isClient, API_URL]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 6);
    setHasMore(portfolios.length > displayCount + 6);
  };

  const handlePortfolioClick = (portfolio) => {
    setSelectedPortfolio(portfolio);
    setCurrentImageIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedPortfolio(null);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (selectedPortfolio && selectedPortfolio.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedPortfolio.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedPortfolio && selectedPortfolio.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedPortfolio.images.length - 1 : prev - 1
      );
    }
  };

  if (loading || tenantLoading || !isClient) {
    return (
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading portfolio...</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <Container>
        <div className="text-center mb-8">
          <span className="inline-block mb-2 text-green-600 font-semibold">Our Work</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {tenant ? `${tenant.name}'s Portfolio` : 'Portfolio Showcase'}
          </h2>
          <div className="w-20 h-1 bg-green-600 mx-auto mb-4"></div>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {tenant 
              ? 'Explore our collection of beautifully transformed outdoor spaces that showcase our craftsmanship and attention to detail.'
              : 'Discover amazing landscaping projects from all our talented tenants.'}
          </p>
        </div>

        {portfolios.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tenant ? 'No Portfolio Items Yet' : 'No Portfolios Available'}
              </h3>
              <p className="text-gray-500">
                {tenant 
                  ? `${tenant.name} hasn't added any portfolio items yet.` 
                  : 'Visit individual tenant sites to view their portfolios.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.slice(0, displayCount).map((portfolio) => (
                <div 
                  key={portfolio.id} 
                  className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col cursor-pointer transform hover:-translate-y-1"
                  onClick={() => handlePortfolioClick(portfolio)}
                >
                  <div className="relative overflow-hidden h-48">
                    {portfolio.mainImage ? (
                      <img
                        src={portfolio.mainImage}
                        alt={portfolio.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-white/90 text-xs font-medium">{portfolio.category}</span>
                        <h3 className="text-white font-bold text-lg mt-1">{portfolio.title}</h3>
                        {/* Show tenant name if viewing all portfolios */}
                        {!tenant && portfolio.tenant && (
                          <p className="text-white/80 text-xs mt-1">By: {portfolio.tenant.name}</p>
                        )}
                        <p className="text-white/80 text-sm mt-2 line-clamp-2">{portfolio.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                        {portfolio.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-green-600 transition-colors duration-300">{portfolio.title}</h3>
                    {/* Show tenant name if viewing all portfolios */}
                    {!tenant && portfolio.tenant && (
                      <p className="text-gray-500 text-xs mb-1 flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {portfolio.tenant.name}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mb-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {portfolio.location}
                    </p>
                    <p className="text-gray-500 text-xs mb-2 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {portfolio.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Load More
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <Link href="/portfolio">
                  <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    View Full Portfolio
                    <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </Link>
              )}
            </div>
          </>
        )}

        {/* Portfolio Modal */}
        {selectedPortfolio && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100">
              <div className="relative">
                {/* Close button */}
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>

                {/* Show tenant info if viewing all portfolios */}
                {!tenant && selectedPortfolio.tenant && (
                  <div className="absolute top-4 left-4 z-10 bg-white/90 px-3 py-1 rounded-full">
                    <p className="text-sm font-medium text-gray-700">By: {selectedPortfolio.tenant.name}</p>
                  </div>
                )}

                {/* Image carousel */}
                <div className="relative h-[40vh] bg-gray-100">
                  {selectedPortfolio.images.length > 0 ? (
                    <>
                      <img
                        src={selectedPortfolio.images[currentImageIndex].url}
                        alt={selectedPortfolio.title}
                        className="w-full h-full object-contain transition-opacity duration-300"
                      />
                      {selectedPortfolio.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrevImage();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                          >
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextImage();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-300 hover:scale-110"
                          >
                            <ChevronRight className="w-6 h-6 text-gray-600" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Portfolio details */}
                <div className="p-6 overflow-y-auto max-h-[50vh]">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
                      {selectedPortfolio.category}
                    </span>
                    <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedPortfolio.status === 'published' 
                        ? 'text-blue-600 bg-blue-100' 
                        : selectedPortfolio.status === 'draft'
                        ? 'text-yellow-600 bg-yellow-100'
                        : 'text-gray-600 bg-gray-100'
                    }`}>
                      {selectedPortfolio.status.charAt(0).toUpperCase() + selectedPortfolio.status.slice(1)}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedPortfolio.title}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2 text-green-600" />
                      <span>{selectedPortfolio.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2 text-green-600" />
                      <span>{selectedPortfolio.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <User className="w-5 h-5 mr-2 text-green-600" />
                      <span>{selectedPortfolio.clientName}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-2 text-green-600" />
                      <span>{selectedPortfolio.projectDuration}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedPortfolio.description}</p>
                  </div>

                  {selectedPortfolio.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPortfolio.tags.map((tag, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full"
                          >
                            <Tag className="w-4 h-4 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default Portfolio;