'use client';

import React from 'react';

export default function AdminLayout({ children }) {
  // This layout will prevent the Header from showing in admin routes
  return <>{children}</>;
} 