// // app/reset-password/[token]/page.js

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useParams } from 'next/navigation'; // for dynamic token
// import AuthFormContainer from '../../../components/auth/AuthFormContainer';
// import Input from '../../../components/ui/Input';
// import Button from '../../../components/ui/Button';
// import Link from 'next/link';

// export default function ResetPassword() {
//   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
//   const { token } = useParams(); // Get the token from the URL
//   const router = useRouter();
  
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (!token) {
//       setError('Invalid or expired token');
//     }
//   }, [token]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
    
//     if (newPassword !== confirmPassword) {
//       setError('Passwords do not match');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${API_URL}/auth/resetpassword/${token}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({newPassword }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         setSuccessMessage('Password reset successful! Redirecting to login...');
//         setTimeout(() => router.push('/login'), 2000);
//       } else {
//         setError(data.message || 'An error occurred. Please try again later.');
//       }
//     } catch (err) {
//       setError('Error resetting password. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AuthFormContainer title="Reset your password" subtitle="Enter your new password below.">
//       {successMessage && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
//           <p className="font-bold">Success!</p>
//           <p className="text-sm">{successMessage}</p>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
//           <p className="font-bold">Error!</p>
//           <p className="text-sm">{error}</p>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//         <Input
//           label="New Password"
//           type="password"
//           id="newPassword"
//           name="newPassword"
//           placeholder="Enter new password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           required
//         />

//         <Input
//           label="Confirm Password"
//           type="password"
//           id="confirmPassword"
//           name="confirmPassword"
//           placeholder="Confirm new password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//         />

//         <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
//           Reset Password
//         </Button>

//         <div className="text-center mt-4">
//           <p className="text-sm text-gray-600">
//             Remembered your password?{' '}
//             <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
//               Log in
//             </Link>
//           </p>
//         </div>
//       </form>
//     </AuthFormContainer>
//   );
// }


'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import AuthFormContainer from '../../../components/auth/AuthFormContainer';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const token = params.token;
  
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!password || !confirmPassword) {
      setError('Both password fields are required');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Error resetting password');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormContainer 
      title="Reset Your Password" 
      subtitle="Enter your new password below"
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-bold">Error!</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-bold">Success!</p>
          <p className="text-sm">Password reset successfully. Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            label="New Password"
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            isLoading={isLoading}
          >
            Reset Password
          </Button>
        </form>
      )}
    </AuthFormContainer>
  );
}