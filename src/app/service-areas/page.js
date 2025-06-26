import React from 'react';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';

export default function ServiceAreasPage() {
  const serviceRegions = [
    {
      name: 'North Region',
      cities: [
        'Northtown',
        'Hilltop Heights',
        'Riverdale',
        'Pinecrest',
        'Summit View',
        'Lakeside',
        'Cedar Hills',
        'Maple Valley'
      ]
    },
    {
      name: 'South Region',
      cities: [
        'Southfield',
        'Bay Harbor',
        'Ocean View',
        'Palm Springs',
        'Meadowbrook',
        'Sunny Shores',
        'Greenwood',
        'Willow Creek'
      ]
    },
    {
      name: 'East Region',
      cities: [
        'Eastland',
        'Highland Park',
        'Orchard Hills',
        'Cherry Grove',
        'Forest Glen',
        'Brookside',
        'Fairview',
        'Oakwood'
      ]
    },
    {
      name: 'West Region',
      cities: [
        'Westpoint',
        'Coastal Cove',
        'Sunset Beach',
        'Pacific Ridge',
        'Harbor Heights',
        'Lighthouse Bay',
        'Cliffside',
        'Redwood Junction'
      ]
    }
  ];

  const serviceTiers = [
    {
      name: 'Primary Service Area',
      description: 'Areas where we provide full service options with no travel charges. Our core service region.',
      response: 'Same or next-day response for urgent service needs.',
      color: 'bg-green-600'
    },
    {
      name: 'Secondary Service Area',
      description: 'We proudly serve these areas with minimal travel fees for most services.',
      response: '1-2 business days response time for service calls.',
      color: 'bg-green-500'
    },
    {
      name: 'Extended Service Area',
      description: 'Available for larger projects with nominal travel fees.',
      response: '2-3 business days response time, scheduled services only.',
      color: 'bg-green-400'
    }
  ];

  return (
    <>
      <PageHeader 
        title="Service Areas"
        description="Where we provide our professional landscaping services"
        backgroundImage="/images/service-areas-header.jpg"
      />
      
      <Container className="py-16">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-green-800 mb-6">Where We Work</h2>
          <p className="text-lg text-gray-700">
            Your Landscaping Company provides professional landscaping services throughout the metropolitan area 
            and surrounding communities. Our service area spans across multiple counties, allowing us to bring 
            our expertise to a wide range of commercial and residential properties.
          </p>
        </div>
        
        {/* Service Map */}
        <div className="bg-gray-100 rounded-lg overflow-hidden mb-16">
          <div className="h-96 relative">
            {/* This would be replaced with an actual map component or embed */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xl">
              Interactive Service Area Map
            </div>
          </div>
        </div>
        
        {/* Service Area Tiers */}
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Our Coverage Zones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {serviceTiers.map((tier, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className={`${tier.color} h-2`}></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{tier.name}</h3>
                <p className="text-gray-700 mb-4">{tier.description}</p>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-600">{tier.response}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Cities We Serve */}
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">Cities and Communities We Serve</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceRegions.map((region, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-700 mb-4">{region.name}</h3>
                  <ul className="space-y-2">
                    {region.cities.map((city, cityIndex) => (
                      <li key={cityIndex} className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{city}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Not Sure If We Serve Your Area? */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Not Sure If We Serve Your Area?</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-8">
            Don't see your location listed? We may still be able to help! Our service areas are continually 
            expanding, and we often make exceptions for larger projects. Contact us today to discuss your 
            specific location and service needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/contact" 
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Contact Us
            </a>
            <a 
              href="tel:5551234567" 
              className="inline-block bg-white hover:bg-gray-100 text-green-700 border border-green-600 font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Call (555) 123-4567
            </a>
          </div>
        </div>
        
        {/* Commercial Service Areas */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Commercial Service Areas</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <p className="text-gray-700 mb-6">
                For commercial landscape maintenance and installation projects, our service area may extend 
                beyond our standard residential coverage zones. We currently provide commercial landscaping 
                services to businesses, HOAs, and property management companies throughout the following counties:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-800 mb-2">North County</h3>
                  <p className="text-sm text-gray-600">
                    Including all major business districts and industrial parks
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-800 mb-2">Central County</h3>
                  <p className="text-sm text-gray-600">
                    Downtown, midtown, and all surrounding areas
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-800 mb-2">South County</h3>
                  <p className="text-sm text-gray-600">
                    All commercial zones and business parks
                  </p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Our commercial division specializes in serving:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center bg-gray-50 p-3 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-gray-700">Office Complexes</span>
                </div>
                <div className="flex items-center bg-gray-50 p-3 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                  <span className="text-gray-700">HOA Communities</span>
                </div>
                <div className="flex items-center bg-gray-50 p-3 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-gray-700">Retail Centers</span>
                </div>
                <div className="flex items-center bg-gray-50 p-3 rounded">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-gray-700">Industrial Parks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
} 