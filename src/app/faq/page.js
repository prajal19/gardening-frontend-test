import React from 'react';
import Container from '../../components/ui/Container';
import PageHeader from '../../components/layout/PageHeader';

export default function FAQPage() {
  const faqCategories = [
    {
      name: 'General Questions',
      questions: [
        {
          question: 'What areas do you service?',
          answer: 'We currently service the entire metropolitan area including all surrounding suburbs within a 30-mile radius of downtown. For larger projects, we may travel further - please contact us to discuss your specific location.'
        },
        {
          question: 'Do you offer free consultations?',
          answer: 'Yes, we offer free initial consultations for most services. During this meeting, we\'ll discuss your needs, evaluate your property, and provide general recommendations. Detailed design proposals may require a design fee which can be credited toward your project if you choose to proceed with our services.'
        },
        {
          question: 'How far in advance should I book your services?',
          answer: 'For maintenance services, we recommend booking 1-2 weeks in advance. For landscape design and installation projects, we suggest contacting us 4-6 weeks before your desired start date, especially during our busy season (spring and fall). Large projects may require booking several months in advance.'
        },
        {
          question: 'Are you licensed and insured?',
          answer: 'Yes, we are fully licensed, bonded, and insured. We carry general liability insurance and workers\' compensation for all our employees. We\'re happy to provide proof of insurance upon request.'
        }
      ]
    },
    {
      name: 'Landscape Design & Installation',
      questions: [
        {
          question: 'What is the typical landscape design process?',
          answer: 'Our design process typically includes an initial consultation, site analysis, concept development, design presentation, revisions based on your feedback, and final design approval. The timeline varies depending on project complexity but usually takes 2-4 weeks from initial meeting to final design.'
        },
        {
          question: 'How much does landscaping cost?',
          answer: 'Landscaping costs vary widely depending on your property size, scope of work, materials selected, and complexity of design. Simple garden beds might start at $1,500-$3,000, while complete yard transformations with hardscaping can range from $15,000 to $50,000+. We provide detailed estimates after understanding your specific needs and budget parameters.'
        },
        {
          question: 'Do you offer financing options for larger projects?',
          answer: 'Yes, we partner with several financing companies to offer payment plans for qualified customers. Options include 12-month interest-free plans and longer-term financing with competitive rates. We can discuss these options during your consultation.'
        },
        {
          question: 'What is the warranty on your plants and installations?',
          answer: 'We offer a one-year warranty on most plants and installations, provided proper care guidelines are followed. Hardscaping elements typically carry a 3-5 year warranty on workmanship. Specific warranties may vary by project type and are detailed in your service agreement.'
        }
      ]
    },
    {
      name: 'Lawn & Garden Maintenance',
      questions: [
        {
          question: 'How often should my lawn be mowed?',
          answer: 'During the growing season, most lawns benefit from weekly mowing. In slower growth periods, every other week is often sufficient. We adjust our schedule based on grass type, weather conditions, and growth rate to maintain optimal lawn health and appearance.'
        },
        {
          question: 'What\'s included in your regular maintenance packages?',
          answer: 'Our standard maintenance packages include mowing, edging, blowing, and basic cleanup. Enhanced packages may include additional services such as fertilization, weed control, shrub pruning, mulch refreshing, and seasonal color changes. We can customize a maintenance plan to fit your specific needs and budget.'
        },
        {
          question: 'Do I need to be home during maintenance visits?',
          answer: 'No, you don\'t need to be present during routine maintenance visits. Once we establish a service schedule, our team will maintain your landscape whether you\'re home or not. We communicate any concerns or recommendations via email or phone.'
        },
        {
          question: 'How do you handle lawn care during vacations or extended absences?',
          answer: 'We maintain your regular service schedule during your absence. For extended periods, we can adjust irrigation, monitor for pests or issues, and ensure your landscape remains healthy and well-maintained while you\'re away. Just let us know about your plans in advance.'
        }
      ]
    },
    {
      name: 'Irrigation & Water Management',
      questions: [
        {
          question: 'How often should I water my lawn and plants?',
          answer: 'Watering frequency depends on plant types, soil conditions, and weather. Generally, lawns need about 1-1.5 inches of water per week during growing season. Established shrubs and trees typically require deep watering every 1-2 weeks. New plantings need more frequent watering until established. Our smart irrigation systems can be programmed to deliver the ideal amount of water for your specific landscape.'
        },
        {
          question: 'What are the benefits of installing a smart irrigation system?',
          answer: 'Smart irrigation systems optimize water usage by adjusting to weather conditions, soil moisture, and seasonal changes. Benefits include water conservation (typically 30-50% savings), healthier plants, reduced runoff and water waste, lower water bills, and convenience through automated scheduling and smartphone controls.'
        },
        {
          question: 'How much maintenance does an irrigation system require?',
          answer: 'Irrigation systems should be inspected and adjusted seasonally. We recommend a spring start-up, mid-season check, and fall winterization (in cold climates). Our maintenance includes checking for leaks, adjusting heads, programming controllers optimally, and ensuring efficient operation.'
        },
        {
          question: 'Can you make my existing irrigation system more efficient?',
          answer: 'Yes, we can upgrade existing systems with water-saving technologies like smart controllers, rain sensors, drip irrigation, and high-efficiency nozzles. We start with an irrigation audit to identify improvement opportunities and can implement changes to significantly reduce water usage while improving landscape health.'
        }
      ]
    },
    {
      name: 'Tree & Shrub Care',
      questions: [
        {
          question: 'When is the best time to prune trees and shrubs?',
          answer: 'The optimal pruning time depends on the plant species. Most deciduous trees are best pruned during winter dormancy. Spring-flowering shrubs should be pruned right after flowering, while summer-flowering shrubs are typically pruned in late winter or early spring. Evergreens usually require minimal pruning in mid-spring or mid-summer. We schedule pruning services appropriate to your specific plant varieties.'
        },
        {
          question: 'How can I tell if my trees or shrubs have a disease or pest problem?',
          answer: 'Common signs include unusual leaf discoloration, spots, or deformities; premature leaf drop; branch dieback; peeling bark; visible insects or webs; and fungal growth. Our certified arborists can diagnose specific issues and recommend targeted treatments to protect your valuable trees and shrubs.'
        },
        {
          question: 'Do you provide tree removal services?',
          answer: 'Yes, we offer complete tree removal services, including stump grinding. We handle trees of all sizes, though very large specimens may require specialized equipment. Our team is trained in safe removal practices, especially for trees near structures or in confined spaces.'
        },
        {
          question: 'What type of fertilization do trees and shrubs need?',
          answer: 'Most trees and shrubs benefit from slow-release fertilizers applied 1-2 times per year. Specific formulations depend on soil conditions, plant species, and any deficiencies identified through observation or soil testing. We offer deep root fertilization services that deliver nutrients directly to the root zone for optimal absorption.'
        }
      ]
    }
  ];

  return (
    <>
      <PageHeader 
        title="Frequently Asked Questions"
        description="Find answers to common questions about our landscaping services"
        backgroundImage="/images/faq-header.jpg"
      />
      
      <Container className="py-16">
        {/* Category navigation */}
        <div className="flex overflow-x-auto pb-4 mb-10 gap-3">
          {faqCategories.map((category, index) => (
            <a 
              key={index} 
              href={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="px-4 py-2 bg-white border border-green-200 text-green-700 rounded-full whitespace-nowrap hover:bg-green-50 transition-colors"
            >
              {category.name}
            </a>
          ))}
        </div>
        
        {/* FAQ Content */}
        <div className="space-y-12">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} id={category.name.toLowerCase().replace(/\s+/g, '-')}>
              <h2 className="text-2xl font-bold text-green-800 mb-6">{category.name}</h2>
              <div className="space-y-6">
                {category.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <details className="group">
                      <summary className="flex justify-between items-center p-6 cursor-pointer">
                        <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                        <svg
                          className="h-5 w-5 text-green-600 group-open:rotate-180 transition-transform"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <div className="px-6 pb-6 pt-2 text-gray-700">{faq.answer}</div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Still Have Questions */}
        <div className="mt-16 bg-green-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Still Have Questions?</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-8">
            If you couldn&apos;t find the answer to your question, don&apos;t hesitate to reach out.
            Our friendly team is here to help with any inquiries about our services.
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
      </Container>
    </>
  );
} 