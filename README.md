# Green Gardens Landscaping Booking App

A frontend application for a landscaping company to manage bookings, estimates, and appointments.

## Features

### Public Landing Page
- Hero section with call to action
- Services grid 
- Testimonials section
- Gallery of before/after photos
- Contact form

### Customer Booking Flow
- Multi-step booking form
- Service selection
- Date/time scheduling
- Customer information form
- Photo upload capability (mock)
- Booking confirmation page

### Estimate Review
- Service summary
- Price breakdown
- Approval functionality (mock)

### Admin Dashboard
- Appointment list and management
- Appointment details view
- Estimate creation form
- Photo gallery viewer

## Tech Stack

- Next.js (App Router)
- Tailwind CSS
- Zustand for state management
- React Hook Form (simulated)

## Project Structure

```
src/
├── app/                # Next.js App Router structure
│   ├── admin/          # Admin pages
│   ├── booking/        # Booking flow pages
│   └── estimates/      # Estimate pages
├── components/         # React components
│   ├── admin/          # Admin-specific components
│   ├── booking/        # Booking flow components
│   ├── home/           # Landing page components
│   ├── layout/         # Layout components (Header, Footer)
│   └── ui/             # Reusable UI components
└── lib/                # Utilities and hooks
    ├── data/           # Mock data
    └── store.js        # Zustand store
```

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Notes

- This is a frontend-only application with mock data
- No actual backend or database integration
- Form submissions are simulated and stored in-memory using Zustand
- In a production app, you would:
  - Implement proper authentication for the admin area
  - Connect to a real backend API
  - Add form validation
  - Implement actual photo upload functionality
  - Add error handling and loading states
