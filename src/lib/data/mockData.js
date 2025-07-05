// Mock data for the landscaping booking app

// Services offered
export const services = [
  {
    id: 1,
    name: "Lawn Care",
    description: "Regular maintenance including mowing, edging, and fertilization",
    price: 75,
    image: "/images/lawn-care.jpg"
  },

  {
    id: 2,
    name: "Tree Pruning",
    description: "Professional pruning and shaping of trees and shrubs",
    price: 120,
    image: "/images/tree-pruning.jpg"
  },
  {
    id: 3,
    name: "Landscaping Design",
    description: "Custom design and installation of gardens and landscapes",
    price: 200,
    image: "/images/landscaping-design.jpg"
  },
  {
    id: 4,
    name: "Irrigation Installation",
    description: "Installation and repair of sprinkler systems",
    price: 150,
    image: "/images/irrigation.jpg"
  },
  {
    id: 5,
    name: "Hardscaping",
    description: "Installation of walkways, patios, and retaining walls",
    price: 250,
    image: "/images/hardscaping.jpg"
  },
  {
    id: 6,
    name: "Seasonal Cleanup",
    description: "Leaf removal, garden bed cleanup, and debris removal",
    price: 100,
    image: "/images/seasonal-cleanup.jpg"
  }
];

// Testimonials
export const testimonials = [
  {
    id: 1,
    name: "Punit S.",
    // role: "Homeowner",
    comment: "The team was absolutely phenomenal. They completely revitalized our backyard, turning it from dry and neglected into a vibrant, green paradise. Our trees were expertly pruned, showing off their natural beauty, and our lawn has never looked so lush and healthy. It's become our favorite spot to relax!",
    rating: 5,
    image: "/images/testimonial-1.jpg"
  },
  {
    id: 6,
    name: "Amy D.",
    // role: "Homeowner",
    comment: "Our palm trees had become an eyesore, with dead fronds and messy overgrowth making our yard look neglected. Each palm was meticulously trimmed and shaped, with all debris removed and the trees left impeccably manicured. The transformation was so remarkable that several neighbors have stopped by just to ask who did such fantastic work!",
    rating: 5,
    image: "/images/testimonial-1.jpg"
  },
  {
    id: 2,
    name: "Gary D.",
    // role: "Property Manager",
    comment: "We had a severe sprinkler system malfunction that flooded sections of our yard and left other areas dry and patchy. The issue was quickly identified, the broken lines were efficiently repaired, and the irrigation system was recalibrated for optimal water coverage. Now our lawn is thriving evenly, and the flooding issues are a thing of the past!",
    rating: 5,
    image: "/images/testimonial-2.jpg"
  },
  {
    id: 3,
    name: "Larry O.",
    // role: "Homeowner",
    comment: "From start to finish, the work demonstrated outstanding professionalism and attention to detail. The trees were carefully pruned, every single leaf was cleaned up, and all debris was blown away, leaving our yard spotless. The meticulous effort was clear, and the results speak volumes—our yard looks brand new!",
    rating: 4,
    image: "/images/testimonial-3.jpg"
  },
   {
    id: 3,
    name: "Jacob S.",
    // role: "Homeowner",
    comment: "My garden was struggling with multiple dead plants and poor design. The dead plants weren’t just replaced— the garden layout was thoughtfully redesigned, with fresh, vibrant flowers and plants that beautifully complemented each other. The garden now looks stunning, and I couldn’t be happier. Highly recommend the services!",
    rating: 4,
    image: "/images/testimonial-3.jpg"
  }
];

// Mock gallery images
export const galleryImages = [
  {
    id: 1,
    title: "Backyard Transformation",
    type: "before-after",
    before: "/images/before-1.jpg",
    after: "/images/after-1.jpg"
  },
  {
    id: 2,
    title: "Garden Installation",
    type: "before-after",
    before: "/images/before-2.jpg",
    after: "/images/after-2.jpg"
  },
  {
    id: 3,
    title: "Custom Patio",
    type: "completed",
    image: "/images/completed-1.jpg"
  },
  {
    id: 4,
    title: "Irrigation System",
    type: "completed",
    image: "/images/completed-2.jpg"
  }
];

// Mock appointments
export const appointments = [
  {
    id: 1,
    customerName: "James Wilson",
    customerEmail: "james.wilson@example.com",
    customerPhone: "555-123-4567",
    serviceId: 1,
    serviceName: "Lawn Care",
    date: "2023-05-15",
    timeSlot: "09:00 AM - 11:00 AM",
    frequency: "weekly",
    address: "123 Maple St, Springfield, IL",
    notes: "Gate code: 1234. Please knock before entering.",
    status: "completed",
    photos: ["/images/customer-lawn-1.jpg", "/images/customer-lawn-2.jpg"]
  },
  {
    id: 2,
    customerName: "Emily Brown",
    customerEmail: "emily.brown@example.com",
    customerPhone: "555-987-6543",
    serviceId: 3,
    serviceName: "Landscaping Design",
    date: "2023-05-20",
    timeSlot: "01:00 PM - 03:00 PM",
    frequency: "one-time",
    address: "456 Oak Ave, Springfield, IL",
    notes: "Looking for a modern design with low maintenance plants.",
    status: "scheduled",
    photos: ["/images/customer-garden-1.jpg"]
  },
  {
    id: 3,
    customerName: "Robert Davis",
    customerEmail: "robert.davis@example.com",
    customerPhone: "555-456-7890",
    serviceId: 2,
    serviceName: "Tree Pruning",
    date: "2023-05-22",
    timeSlot: "10:00 AM - 12:00 PM",
    frequency: "one-time",
    address: "789 Pine Rd, Springfield, IL",
    notes: "Three large oak trees in backyard need pruning.",
    status: "pending-estimate",
    photos: ["/images/customer-trees-1.jpg", "/images/customer-trees-2.jpg"]
  }
];

// Mock estimates
export const estimates = [
  {
    id: 1,
    appointmentId: 3,
    customerName: "Robert Davis",
    services: [
      { id: 2, name: "Tree Pruning", quantity: 3, unitPrice: 120, total: 360 }
    ],
    additionalFees: [
      { name: "Debris Removal", amount: 50 }
    ],
    subtotal: 360,
    tax: 36,
    total: 446,
    status: "pending",
    createdAt: "2023-05-18",
    expiresAt: "2023-06-01"
  }
]; 