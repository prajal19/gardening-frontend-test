import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, userRole, userName }) => {
  const router = useRouter();

  // Redirect if no role is provided (would be handled by auth in real app)
  React.useEffect(() => {
    if (!userRole) {
      router.push('/login');
    }
  }, [userRole, router]);

  if (!userRole) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="flex h-screen bg-gray-50">
    {/* Sidebar */}
    <div className="w-64 fixed inset-y-0 left-0 z-10 bg-white shadow">
      <Sidebar userRole={userRole} />
    </div>

    {/* Main Content with left margin */}
    <div className="ml-64 flex flex-col flex-1 overflow-hidden">
      <Header userName={userName} userRole={userRole} />

      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
        {children}
      </main>
    </div>
  </div>
);
};

export default DashboardLayout; 