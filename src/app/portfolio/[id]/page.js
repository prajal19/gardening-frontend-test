import React from 'react';
import Link from 'next/link';
import Container from '../../../components/ui/Container';
import PageHeader from '../../../components/layout/PageHeader';

// This would typically come from a database or API
const getProjectData = (id) => {
  const projects = {
    'modern-backyard-retreat': {
      title: 'Modern Backyard Retreat',
      category: 'Residential',
      client: 'The Johnson Family',
      location: 'Westlake Hills',
      completionDate: 'Spring 2023',
      duration: '4 months',
      description: 'A complete backyard transformation featuring a modern pool, outdoor kitchen, and fire pit area.',
      fullDescription: 'This project involved a complete renovation of an outdated backyard into a modern outdoor living space. The clients wanted a design that would accommodate both family activities and adult entertaining. We implemented a sleek pool design with a raised spa, a fully-equipped outdoor kitchen with bar seating, and a conversation area featuring a contemporary fire pit with comfortable seating.',
      services: ['Landscape Design', 'Hardscaping', 'Pool Installation', 'Outdoor Kitchen', 'Lighting Design', 'Planting'],
      challenges: 'The sloped terrain required significant grading and a custom retaining wall solution to create usable flat spaces. Additionally, we had to work around several mature trees that the homeowners wanted to preserve.',
      solutions: 'We incorporated a multi-level design that worked with the natural slope rather than against it. Custom concrete retaining walls were disguised as design features, and the layout was carefully planned to preserve and showcase the existing mature oak trees.',
      mainImage: 'https://img.freepik.com/free-photo/deckchair-swimming-pool_1150-10748.jpg?t=st=1746722549~exp=1746726149~hmac=b5531b6c3d4148560b4ce627fcc5923af5a4ba6749ecf2e79098dfcacd9af298&w=1380',
      gallery: [
        'https://img.freepik.com/free-photo/deckchair-swimming-pool_1150-10748.jpg?t=st=1746722549~exp=1746726149~hmac=b5531b6c3d4148560b4ce627fcc5923af5a4ba6749ecf2e79098dfcacd9af298&w=1380',
        'https://img.freepik.com/free-photo/3d-rendering-wooden-house_23-2151264382.jpg?t=st=1746722699~exp=1746726299~hmac=7a1fe4c4db0a51edee47041c5e8ffb02208726d65af9ec71e6030fe7930d80df&w=1380',
        'https://img.freepik.com/free-photo/homemade-fire-fenced-with-stones-two-benches-nearby_169016-15142.jpg?t=st=1746722738~exp=1746726338~hmac=27fe655d5ab04104e38bddb1a398f2d017a2ce1d6e03fa6afe1e458deecc7b1b&w=1380',
        'https://img.freepik.com/free-photo/tree-with-lamp-lighting_1339-7213.jpg?t=st=1746722767~exp=1746726367~hmac=694208e75eb5f352f17b4d93e547d080bd5a216380856bb758b260274cdabf8d&w=1380',
        
      ],
      testimonial: {
        quote: "Our backyard has become our favorite place to be. The design exceeded our expectations, and we're constantly receiving compliments from friends and family. The outdoor kitchen and fire pit area get used almost daily!",
        client: "Michael Johnson",
        position: "Homeowner"
      },
      relatedProjects: ['luxury-pool-landscape', 'mediterranean-garden', 'japanese-inspired-landscape']
    },
    'commercial-plaza-landscaping': {
      title: 'Commercial Plaza Landscaping',
      category: 'Commercial',
      client: 'Metro Development Group',
      location: 'Downtown Business District',
      completionDate: 'Summer 2022',
      duration: '3 months',
      description: 'Drought-resistant landscaping for a large commercial plaza with integrated seating areas.',
      fullDescription: 'This commercial project involved redesigning the outdoor spaces of a busy downtown business plaza. The client needed a low-maintenance, water-efficient landscape that would enhance the property value while providing attractive outdoor spaces for employees and visitors. We created a design that featured drought-resistant native plants, efficient irrigation systems, and comfortable seating areas shaded by strategically placed trees.',
      services: ['Commercial Landscape Design', 'Irrigation Installation', 'Hardscape Construction', 'Native Planting', 'Seating Areas'],
      challenges: 'The high-traffic urban location presented challenges for installation, and the previous landscape had been neglected for years, requiring significant rehabilitation of the soil and drainage systems.',
      solutions: 'We developed a phased implementation plan that minimized disruption to businesses, and installed a state-of-the-art irrigation system with smart controllers to optimize water usage. Soil remediation and the addition of organic matter improved the growing environment for new plants.',
      mainImage: '/images/portfolio/commercial-plaza.jpg',
      gallery: [
        '/images/portfolio/commercial-plaza/overview.jpg',
        '/images/portfolio/commercial-plaza/seating.jpg',
        '/images/portfolio/commercial-plaza/plants.jpg',
        '/images/portfolio/commercial-plaza/walkways.jpg',
        '/images/portfolio/commercial-plaza/lighting.jpg',
        '/images/portfolio/commercial-plaza/entrance.jpg',
      ],
      testimonial: {
        quote: "The transformation of our plaza has been remarkable. The landscaping has significantly enhanced our property's appearance and created usable outdoor spaces that our tenants love. The drought-resistant approach has also reduced our water bills substantially.",
        client: "Sarah Chen",
        position: "Property Manager, Metro Development Group"
      },
      relatedProjects: ['rooftop-garden', 'community-park-renovation', 'native-plant-restoration']
    },
    'mediterranean-garden': {
      title: 'Mediterranean Garden Estate',
      category: 'Residential',
      client: 'The Martinez Family',
      location: 'Lakeside Estates',
      completionDate: 'Fall 2022',
      duration: '5 months',
      description: 'A Mediterranean-inspired garden with fountain features, olive trees, and lavender fields.',
      fullDescription: 'This extensive residential project transformed a bland suburban property into a Mediterranean oasis. The homeowners, inspired by their travels to southern Europe, wanted to recreate the ambiance of Italian and Spanish gardens. The design includes a central courtyard with a tiered fountain, gravel pathways lined with lavender and rosemary, an olive grove, and a dedicated area for entertaining with a pergola covered in grapevines.',
      services: ['Mediterranean Landscape Design', 'Water Feature Installation', 'Custom Hardscaping', 'Specialty Planting', 'Irrigation System', 'Pergola Construction'],
      challenges: 'Adapting Mediterranean plant species to the local climate required careful selection and placement. Additionally, creating authentic-looking hardscape elements that would withstand local weather conditions was a priority.',
      solutions: 'We selected Mediterranean plant varieties known to perform well in the local climate, and supplemented with native plants that offer a similar aesthetic. For hardscaping, we used high-quality materials and construction techniques that provide both authenticity and durability.',
      mainImage: 'https://img.freepik.com/free-photo/view-oia-street-mornong_268835-3837.jpg?t=st=1746723114~exp=1746726714~hmac=ca3866cd44bb67ff9769fd46a6b8c08a488c177dd3b4fee401f1b36ae8b93ad7&w=1380',
      gallery: [
        'https://img.freepik.com/free-photo/fountains-bridge-manzanares-river-madrid_1398-2686.jpg?t=st=1746722876~exp=1746726476~hmac=e06088f5bf2f7f56faac99a854ce87eb50ef1a8fcfdadcac0fe1043910ce2433&w=1380',
        'https://img.freepik.com/free-photo/trees-planted-dirt-roads_1160-738.jpg?t=st=1746722925~exp=1746726525~hmac=a1edb3829eeebb3cf5fa440d3b18b624de579a252e00d8331a3c5d41f850c836&w=1380',
        'https://img.freepik.com/free-photo/trees-planted-dirt-roads_1160-738.jpg?t=st=1746722925~exp=1746726525~hmac=a1edb3829eeebb3cf5fa440d3b18b624de579a252e00d8331a3c5d41f850c836&w=1380',
        'https://img.freepik.com/free-photo/low-angle-shot-white-wooden-garden-arch_181624-18297.jpg?t=st=1746723022~exp=1746726622~hmac=ed101e0cb3f330d698d58afb33b906bc0a7f800bbfc9f56fc93ba73660f97eac&w=1380',
        'https://img.freepik.com/free-photo/beautiful-balcony-old-house-pals-spain_181624-40218.jpg?t=st=1746723066~exp=1746726666~hmac=4d172fbf6c6bed265d64addec7388cdcc39181b6983b7f44f81c011421675770&w=1380',
        
      ],
      testimonial: {
        quote: "Every time we step into our garden, we feel transported to the Mediterranean. The attention to detail is incredible - from the authentic fountain to the carefully selected plants. It's truly our dream garden come to life.",
        client: "Elena Martinez",
        position: "Homeowner"
      },
      relatedProjects: ['modern-backyard-retreat', 'japanese-inspired-landscape', 'luxury-pool-landscape']
    }
  };

  // Add more projects as needed, following the same structure

  return projects[id] || null;
};

export default function ProjectPage({ params }) {
  const project = getProjectData(params.id);
  
  if (!project) {
    return (
      <Container className="py-16 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Project Not Found</h1>
        <p className="text-gray-700 mb-8">The project you're looking for could not be found.</p>
        <Link href="/portfolio">
          <span className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors">
            View All Projects
          </span>
        </Link>
      </Container>
    );
  }

  return (
    <>
      <PageHeader 
        title={project.title}
        description={project.description}
        backgroundImage={project.mainImage}
      />
      
      <Container className="py-16">
        {/* Project Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-green-800 mb-6">Project Overview</h2>
            <p className="text-gray-700 mb-8 leading-relaxed">{project.fullDescription}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-semibold text-green-800 mb-4">Challenges</h3>
                <p className="text-gray-700">{project.challenges}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-800 mb-4">Solutions</h3>
                <p className="text-gray-700">{project.solutions}</p>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-green-800 mb-4">Services Provided</h3>
            <ul className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-2">
              {project.services.map((service, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{service}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-green-800 mb-6">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-medium">{project.client}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{project.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion Date</p>
                  <p className="font-medium">{project.completionDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Project Duration</p>
                  <p className="font-medium">{project.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{project.category}</p>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Interested in a similar project?</h3>
                <Link href="/contact">
                  <span className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded text-center transition-colors">
                    Request a Consultation
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Project Gallery */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-green-800 mb-8">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.gallery.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img src={image} alt={`${project.title} - Image ${index + 1}`} className="w-full h-64 object-cover" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Testimonial */}
        {project.testimonial && (
          <div className="mb-16 bg-gray-50 rounded-lg p-8 shadow-inner">
            <div className="max-w-3xl mx-auto text-center">
              <svg className="h-12 w-12 text-green-400 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl italic text-gray-700 mb-6">{project.testimonial.quote}</p>
              <div>
                <p className="font-semibold text-green-800">{project.testimonial.client}</p>
                <p className="text-gray-600">{project.testimonial.position}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Related Projects */}
        {project.relatedProjects && project.relatedProjects.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-8">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {project.relatedProjects.map((relatedId) => {
                const relatedProject = getProjectData(relatedId);
                if (!relatedProject) return null;
                
                return (
                  <Link key={relatedId} href={`/portfolio/${relatedId}`}>
                    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={relatedProject.mainImage} 
                          alt={relatedProject.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-green-800 group-hover:text-green-600 transition-colors">
                          {relatedProject.title}
                        </h3>
                        <p className="text-sm text-gray-600">{relatedProject.category}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </>
  );
} 