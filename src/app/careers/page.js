import React from 'react';
import Link from 'next/link';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';

export default function CareersPage() {
  const jobListings = [
    {
      id: 'landscape-designer',
      title: 'Landscape Designer',
      department: 'Design',
      location: 'Main Office - Anytown',
      type: 'Full-time',
      description: 'We\'re looking for a creative Landscape Designer who can transform client visions into breathtaking outdoor spaces.',
      responsibilities: [
        'Develop comprehensive landscape design plans',
        'Meet with clients to understand their needs and preferences',
        'Create detailed CAD drawings and 3D visualizations',
        'Prepare plant lists and material specifications',
        'Collaborate with installation teams during project implementation'
      ],
      requirements: [
        'Bachelor\'s degree in Landscape Architecture or related field',
        'Minimum 3 years of experience in landscape design',
        '3D design visualization skills',
        'Proficiency in CAD software and design tools',
        'Knowledge of local plant materials and construction techniques'
      ]
    },
    {
      id: 'maintenance-technician',
      title: 'Landscape Maintenance Technician',
      department: 'Maintenance',
      location: 'Various Client Sites',
      type: 'Full-time',
      description: 'Join our maintenance team to help keep our clients\' properties looking their best year-round.',
      responsibilities: [
        'Perform routine landscape maintenance tasks',
        'Operate lawn care equipment safely and efficiently',
        'Apply fertilizers and treatments according to specifications',
        'Identify and report plant health issues or irrigation problems',
        'Maintain equipment in good working condition'
      ],
      requirements: [
        'High school diploma or equivalent',
        'Previous landscaping experience preferred',
        'Knowledge of plant identification and care',
        'Valid driver\'s license with clean driving record',
        'Ability to work outdoors in various weather conditions'
      ]
    },
    {
      id: 'installation-crew-leader',
      title: 'Installation Crew Leader',
      department: 'Installation',
      location: 'Various Client Sites',
      type: 'Full-time',
      description: 'We need an experienced Crew Leader to oversee landscape installation projects and lead a team of installers.',
      responsibilities: [
        'Lead and supervise a team of 3-5 installation technicians',
        'Interpret landscape plans and ensure accurate implementation',
        'Coordinate daily work schedules and material deliveries',
        'Ensure quality standards are met throughout projects',
        'Communicate with clients and project managers'
      ],
      requirements: [
        '5+ years of landscape installation experience',
        'Previous leadership experience required',
        'Strong knowledge of construction techniques',
        'Equipment operation certification preferred',
        'Excellent problem-solving and communication skills'
      ]
    },
    {
      id: 'irrigation-specialist',
      title: 'Irrigation Specialist',
      department: 'Irrigation',
      location: 'Various Client Sites',
      type: 'Full-time',
      description: 'Looking for an experienced Irrigation Specialist to install and maintain efficient watering systems.',
      responsibilities: [
        'Design and install residential and commercial irrigation systems',
        'Troubleshoot and repair existing irrigation systems',
        'Program and adjust controllers for optimal water usage',
        'Perform seasonal maintenance including spring start-ups and winterizations',
        'Recommend water conservation improvements'
      ],
      requirements: [
        'Minimum 3 years of irrigation installation and repair experience',
        'Irrigation Association certification preferred',
        'Knowledge of smart controllers and water-efficient technologies',
        'Understanding of local water regulations',
        'Valid driver\'s license with clean driving record'
      ]
    },
    {
      id: 'customer-service-representative',
      title: 'Customer Service Representative',
      department: 'Administrative',
      location: 'Main Office - Anytown',
      type: 'Full-time',
      description: 'We\'re seeking a friendly, organized Customer Service Representative to be the first point of contact for our clients.',
      responsibilities: [
        'Answer and direct phone calls professionally',
        'Schedule consultations and service appointments',
        'Respond to customer inquiries via phone and email',
        'Process service agreements and maintain customer records',
        'Coordinate with service teams to resolve customer issues'
      ],
      requirements: [
        'High school diploma or equivalent',
        '2+ years of customer service experience',
        'Proficient in Microsoft Office and CRM software',
        'Excellent verbal and written communication skills',
        'Ability to multi-task in a fast-paced environment'
      ]
    }
  ];

  return (
    <>
      <PageHeader 
        title="Join Our Team"
        description="Explore career opportunities in landscaping and outdoor services"
        backgroundImage="/images/careers-header.jpg"
      />
      
      <Container className="py-16">
        {/* Introduction */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-green-800 mb-6">Grow Your Career With Us</h2>
          <p className="text-lg text-gray-700 mb-8">
            At Your Landscaping Company, we're passionate about creating beautiful outdoor spaces and providing 
            exceptional service to our clients. We're always looking for talented individuals to join our team 
            of landscaping professionals.
          </p>
          <p className="text-lg text-gray-700">
            We offer competitive compensation, opportunities for advancement, and a supportive work 
            environment where your skills and creativity can flourish.
          </p>
        </div>
        
        {/* Benefits */}
        <div className="bg-gray-50 rounded-lg p-10 mb-16">
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">Why Work With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Competitive Compensation</h3>
              <p className="text-gray-600">
                We offer competitive salaries, performance bonuses, and profit-sharing options for eligible positions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Health Benefits</h3>
              <p className="text-gray-600">
                Full-time employees receive comprehensive health, dental, and vision insurance options.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Professional Development</h3>
              <p className="text-gray-600">
                We invest in our team through training, certification assistance, and career advancement opportunities.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Work-Life Balance</h3>
              <p className="text-gray-600">
                We value time off with paid holidays, vacation, and flexible scheduling options when possible.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Team Atmosphere</h3>
              <p className="text-gray-600">
                Join a supportive, collaborative team that celebrates achievements and works together to overcome challenges.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Employee Discounts</h3>
              <p className="text-gray-600">
                Receive special pricing on our services and products from our nursery and supplier partners.
              </p>
            </div>
          </div>
        </div>
        
        {/* Current Openings */}
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-8 text-center">Current Openings</h2>
          
          <div className="space-y-6">
            {jobListings.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-green-800">{job.title}</h3>
                      <div className="mt-2 space-x-4">
                        <span className="inline-flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {job.department}
                        </span>
                        <span className="inline-flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </span>
                        <span className="inline-flex items-center text-sm text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {job.type}
                        </span>
                      </div>
                    </div>
                    <Link href={`/careers/${job.id}`}>
                      <span className="mt-4 md:mt-0 inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors">
                        Apply Now
                      </span>
                    </Link>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  
                  <div className="md:grid md:grid-cols-2 md:gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Key Responsibilities:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {job.responsibilities.map((responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <h4 className="font-semibold text-gray-800 mb-2">Requirements:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {job.requirements.map((requirement, index) => (
                          <li key={index}>{requirement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Application Process */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">Our Application Process</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-start mb-8">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Submit Application</h3>
                <p className="text-gray-700">
                  Complete our online application form for the position you're interested in. Be sure to include 
                  a current resume and any requested information about your qualifications and experience.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start mb-8">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Initial Review</h3>
                <p className="text-gray-700">
                  Our hiring team will review your application and qualifications. If your experience 
                  aligns with our needs, we'll contact you for an initial phone interview.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start mb-8">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Interview Process</h3>
                <p className="text-gray-700">
                  Selected candidates will be invited for in-person interviews. Depending on the position, 
                  this may include a technical assessment or skills demonstration to evaluate your capabilities.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Offer & Onboarding</h3>
                <p className="text-gray-700">
                  Successful candidates will receive a job offer outlining compensation and benefits. 
                  Upon acceptance, you'll participate in our comprehensive onboarding program to set you 
                  up for success in your new role.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* No Current Openings? */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Don't See the Right Position?</h2>
          <p className="text-gray-700 mb-8 max-w-3xl mx-auto">
            We're always interested in meeting talented individuals who are passionate about landscaping 
            and outdoor services. Submit your resume for future consideration, and we'll contact you when 
            a suitable position becomes available.
          </p>
          <Link href="/contact">
            <span className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Submit Your Resume
            </span>
          </Link>
        </div>
      </Container>
    </>
  );
} 