// 'use client';

// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';
// import Button from '../ui/Button';
// import { useDashboard } from '@/contexts/DashboardContext';
// import { useEffect, useState, useRef } from 'react';
// import { 
//   Menu, X, ChevronDown, User, LogOut, 
//   Settings, Phone, Mail, Calendar, ChevronRight, 
//   Leaf
// } from 'lucide-react';

// const Header = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { userData, userRole, isLoading, logout } = useDashboard();
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const [activeNavItem, setActiveNavItem] = useState('/');
//   const dropdownRef = useRef(null);
//   const mobileMenuRef = useRef(null);

//   const navItems = [
//     { path: '/', label: 'Home' },
//     { path: '/about', label: 'About Us' },
//     { path: '/services', label: 'Services' },
//     { path: '/gallery', label: 'Portfolio' },
//     { path: '/ourgallery', label: 'Gallery' },
//     { path: '/contact', label: 'Contact' },
    
//   ];

//   useEffect(() => {
//     setActiveNavItem(pathname);
    
//     const handleScroll = () => {
//       if (window.scrollY > 20) {
//         setScrolled(true);
//       } else {
//         setScrolled(false);
//       }
//     };
    
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [pathname]);

//   // const handleBookNowClick = (e) => {
//   //   e.preventDefault();
    
//   //   if (userData && userRole === 'customer') {
//   //     router.push('/booking');
//   //   } else {
//   //     router.push('/login');
//   //   }
//   // };



//       const handleBookNowClick = (e) => {
//   e.preventDefault();

//   const token = userData?.token;
//   const role = userData?.role || '';

//   if (token && role === 'customer') {
//     router.push('/booking');
//   } else {
//     // Append redirect query
//     router.push('/login?redirect=/booking');
//   }
// };
//   const handleLogout = () => {
//     logout();
//     router.push('/login');
//     setShowDropdown(false);
//     setMobileMenuOpen(false);
//   };

//   const toggleDropdown = () => {
//     setShowDropdown(!showDropdown);
//   };

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(!mobileMenuOpen);
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && mobileMenuOpen) {
//         setMobileMenuOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [mobileMenuOpen]);

//   // Close mobile menu on route change
//   useEffect(() => {
//     setMobileMenuOpen(false);
//   }, [pathname]);

//   // Skip rendering on admin pages
//   if (pathname && pathname.startsWith('/admin')) {
//     return null;
//   }

//   return (
//     <>
    
      
//       {/* Main Header */}
//       <header 
//         className={`py-4 sticky top-0 z-50 transition-all duration-300 ${
//           scrolled 
//             ? 'bg-white shadow-md' 
//             : pathname === '/' 
//               ? 'bg-transparent' 
//               : 'bg-white border-b border-gray-100'
//         }`}
//       >
//         <div className="container mx-auto px-4">
//           <div className="flex justify-between items-center">
//             {/* Logo */}
//             <Link 
//               href="/" 
//               className="flex items-center space-x-2 text-2xl font-bold text-green-600"
//             >
//               <Leaf className="w-8 h-8" />
//               <span className="text-green-600">
//                 Gildordo Rochin
//               </span>
//             </Link>

//             {/* Desktop Navigation */}
//             <nav className="hidden lg:flex items-center space-x-1">
//               {navItems.map((item) => (
//                 <Link 
//                   key={item.path}
//                   href={item.path} 
//                   className={`px-4 py-2 mx-1 rounded-md transition-all duration-300 text-sm font-medium ${
//                     activeNavItem === item.path 
//                       ? 'text-green-600 bg-green-50' 
//                       : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
//                   }`}
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//             </nav>

//             {/* Right Side - CTA and Profile */}
//             <div className="flex items-center space-x-4">
//               {/* Book Now Button - Desktop */}
//               <div className="hidden md:block">
//                 <button
//                   onClick={handleBookNowClick}
//                   className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
//                     scrolled || pathname !== '/' 
//                       ? 'bg-green-600 text-white hover:bg-green-700' 
//                       : 'bg-white text-green-700 hover:bg-green-50'
//                   }`}
//                 >
//                   Book Now
//                 </button>
//               </div>
              
//               {/* User Profile */}
//               {!isLoading && userData && (
//                 <div className="relative" ref={dropdownRef}>
//                   <button 
//                     onClick={toggleDropdown}
//                     className="flex items-center space-x-2 focus:outline-none p-2 rounded-full hover:bg-gray-100"
//                     aria-label="Open user menu"
//                   >
//                     {userData.profileImage ? (
//                       <img 
//                         src={userData.profileImage} 
//                         alt="Profile" 
//                         className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
//                       />
//                     ) : (
//                       <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
//                         <User className="w-4 h-4" />
//                       </div>
//                     )}
//                     <ChevronDown className="w-4 h-4 text-gray-500" />
//                   </button>
                  
//                   {showDropdown && (
//                     <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-10 border border-gray-100 overflow-hidden">
//                       <div className="px-4 py-3 border-b border-gray-100">
//                         <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
//                         <p className="text-xs text-gray-500 truncate">{userData.email || ''}</p>
//                       </div>
                      
//                       <div className="py-1">
//                         <Link href="/customers" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                           <User className="w-4 h-4 mr-3 text-gray-500" />
//                           Profile
//                         </Link>
//                         <Link href="/customers/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                           <Settings className="w-4 h-4 mr-3 text-gray-500" />
//                           Settings
//                         </Link>
//                         <div className="h-px bg-gray-100 my-1"></div>
//                         <button 
//                           onClick={handleLogout}
//                           className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                         >
//                           <LogOut className="w-4 h-4 mr-3" />
//                           Logout
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               )}
              
//               {/* Login Button - Desktop */}
//               {!isLoading && !userData && (
//                 <div className="hidden md:block">
//                   <Link 
//                     href="/login"
//                     className="flex items-center space-x-1 text-sm font-medium px-4 py-2 rounded-md transition-all duration-300 text-gray-700 hover:bg-gray-100"
//                   >
//                     <User className="w-4 h-4 mr-1" />
//                     <span>Login</span>
//                   </Link>
//                 </div>
//               )}
              
//               {/* Mobile Menu Button */}
//               <button 
//                 className="lg:hidden p-2 rounded-md focus:outline-none"
//                 onClick={toggleMobileMenu}
//                 aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
//               >
//                 <Menu className="w-6 h-6 text-gray-700" />
//               </button>
//             </div>
//           </div>
//         </div>
        
//         {/* Mobile Menu */}
//         <div 
//           className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
//             mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
//           }`}
//           ref={mobileMenuRef}
//         >
//           <div className="flex flex-col h-full">
//             <div className="flex items-center justify-between p-4 border-b border-gray-100">
//               <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-green-600">
//                 <Leaf className="w-6 h-6" />
//                 <span>Gildordo Rochin</span>
//               </Link>
//               <button 
//                 onClick={toggleMobileMenu}
//                 className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
            
//             <div className="p-4 border-b border-gray-100">
//               {!isLoading && userData ? (
//                 <div className="flex items-center space-x-3">
//                   {userData.profileImage ? (
//                     <img 
//                       src={userData.profileImage} 
//                       alt="Profile" 
//                       className="w-10 h-10 rounded-full object-cover border border-gray-200"
//                     />
//                   ) : (
//                     <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
//                       <User className="w-5 h-5" />
//                     </div>
//                   )}
//                   <div>
//                     <p className="font-medium text-gray-900">{userData.name || 'User'}</p>
//                     <p className="text-sm text-gray-500 truncate">{userData.email || ''}</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-col space-y-2">
//                   <Link 
//                     href="/login"
//                     className="w-full py-2 px-4 bg-green-600 text-white rounded-md text-center font-medium"
//                   >
//                     Login
//                   </Link>
//                   <Link 
//                     href="/signup"
//                     className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md text-center font-medium"
//                   >
//                     Sign Up
//                   </Link>
//                 </div>
//               )}
//             </div>
            
//             <nav className="flex-1 overflow-y-auto py-4">
//               <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                 Navigation
//               </div>
//               {navItems.map((item) => (
//                 <Link 
//                   key={item.path}
//                   href={item.path} 
//                   className={`flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 ${
//                     activeNavItem === item.path ? 'bg-green-50 text-green-600 font-medium' : ''
//                   }`}
//                 >
//                   <span>{item.label}</span>
//                   {activeNavItem === item.path && (
//                     <ChevronRight className="w-4 h-4 text-green-600" />
//                   )}
//                 </Link>
//               ))}
              
//               {userData && (
//                 <>
//                   <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     Account
//                   </div>
//                   <Link 
//                     href="/customers" 
//                     className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
//                   >
//                     <User className="w-4 h-4 mr-3 text-gray-500" />
//                     <span>Profile</span>
//                   </Link>
//                   <Link 
//                     href="/customers/settings" 
//                     className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
//                   >
//                     <Settings className="w-4 h-4 mr-3 text-gray-500" />
//                     <span>Settings</span>
//                   </Link>
//                   <button 
//                     onClick={handleLogout}
//                     className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
//                   >
//                     <LogOut className="w-4 h-4 mr-3" />
//                     <span>Logout</span>
//                   </button>
//                 </>
//               )}
//             </nav>
            
//             <div className="p-4 border-t border-gray-100">
//               <button
//                 onClick={handleBookNowClick}
//                 className="w-full py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center"
//               >
//                 <Calendar className="w-4 h-4 mr-2" />
//                 Book a Service
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>
//     </>
//   );
// };

// export default Header;



'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Button from '../ui/Button';
import { useDashboard } from '@/contexts/DashboardContext';
import { useEffect, useState, useRef } from 'react';
import { 
  Menu, X, ChevronDown, User, LogOut, 
  Settings, Phone, Mail, Calendar, ChevronRight, 
  Leaf
} from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userData, userRole, isLoading, logout } = useDashboard();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('/');
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Helper function to get dashboard path based on role
  const getDashboardPath = (role) => {
    switch(role) {
      case 'admin':
        return '/admin';
      case 'professional':
        return '/professional';
      case 'customer':
        return '/customers';
        case 'superAdmin':
        return '/super-admin';
      default:
        return '/';
    }
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'Services' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/ourgallery', label: 'Gallery' },
    { path: '/contact', label: 'Contact' },
  ];

  useEffect(() => {
    setActiveNavItem(pathname);
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleBookNowClick = (e) => {
    e.preventDefault();
    const token = userData?.token;
    const role = userData?.role || '';
    if (token && role === 'customer') {
      router.push('/booking');
    } else {
      router.push('/login?redirect=/booking');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Main Header */}
      <header 
        className={`py-4 sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white shadow-md' 
            : pathname === '/' 
              ? 'bg-transparent' 
              : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex flex-col items-start"
            >
              <div className="flex items-center space-x-2 text-2xl font-bold text-green-600">
                <Leaf className="w-8 h-8" />
               <div className='flex flex-col items-start gap-1'>
                 <span className="text-green-600">
                 Gardening 360°
                </span>
                 <span className="text-xs text-green-700 font-medium  -mt-1">
                Complete 360° Digital Landscaping Services
              </span>
               </div>
              </div>
             
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`px-4 py-2 mx-1 rounded-md transition-all duration-300 text-sm font-medium ${
                    activeNavItem === item.path 
                      ? 'text-green-600 bg-green-50' 
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side - CTA and Profile */}
            <div className="flex items-center space-x-4">
              {/* Book Now Button - Desktop */}
              {/* <div className="hidden md:block">
                <button
                  onClick={handleBookNowClick}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    scrolled || pathname !== '/' 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-white text-green-700 hover:bg-green-50'
                  }`}
                 >
                  Book Now
                </button>
              </div> */}
              
              {/* User Profile */}
              {!isLoading && userData && (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 focus:outline-none p-2 rounded-full hover:bg-gray-100"
                    aria-label="Open user menu"
                  >
                    {userData.profileImage ? (
                      <img 
                        src={userData.profileImage} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-10 border border-gray-100 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{userData.email || ''}</p>
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          href={getDashboardPath(userData?.role)} 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-4 h-4 mr-3 text-gray-500" />
                          Profile
                        </Link>
                        <Link 
                          href={`${getDashboardPath(userData?.role)}/settings`} 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Settings className="w-4 h-4 mr-3 text-gray-500" />
                          Settings
                        </Link>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Login Button - Desktop */}
              {!isLoading && !userData && (
                <div className="hidden md:block">
                  <Link 
                    href="/login"
                    className="flex items-center space-x-1 text-sm font-medium px-4 py-2 rounded-md transition-all duration-300 text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4 mr-1" />
                    <span>Login</span>
                  </Link>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 rounded-md focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          ref={mobileMenuRef}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-green-600">
                <Leaf className="w-6 h-6" />
                <span>Gardening 360°</span>
              </Link>
              <button 
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 border-b border-gray-100">
              {!isLoading && userData ? (
                <div className="flex items-center space-x-3">
                  {userData.profileImage ? (
                    <img 
                      src={userData.profileImage} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{userData.name || 'User'}</p>
                    <p className="text-sm text-gray-500 truncate">{userData.email || ''}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    href="/login"
                    className="w-full py-2 px-4 bg-green-600 text-white rounded-md text-center font-medium"
                  >
                    Login
                  </Link>
                  {/* <Link 
                    href="/signup"
                    className="w-full py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md text-center font-medium"
                  >
                    Sign Up
                  </Link> */}
                </div>
              )}
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Navigation
              </div>
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 ${
                    activeNavItem === item.path ? 'bg-green-50 text-green-600 font-medium' : ''
                  }`}
                >
                  <span>{item.label}</span>
                  {activeNavItem === item.path && (
                    <ChevronRight className="w-4 h-4 text-green-600" />
                  )}
                </Link>
              ))}
              
              {userData && (
                <>
                  <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Account
                  </div>
                  <Link 
                    href={getDashboardPath(userData?.role)} 
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    <span>Profile</span>
                  </Link>
                  <Link 
                    href={`${getDashboardPath(userData?.role)}/settings`} 
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-500" />
                    <span>Settings</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </nav>
            
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={handleBookNowClick}
                className="w-full py-3 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book a Service
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;