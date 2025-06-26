// app/forgot-password/page.js

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthFormContainer from '../../components/auth/AuthFormContainer';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const trimmedEmail = email.trim();
  
  if (!trimmedEmail) {
    setError('Email is required');
    setIsLoading(false);
    return;
  }

    if (!email) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/forgotpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        // Handle 404 specifically
        if (response.status === 404) {
          // Still show success for security reasons
          setSuccess(true);
          return;
        }
        setError(data.error || 'Error sending reset link');
        return;
      }
  
      setSuccess(true);
      if (process.env.NODE_ENV === 'development' && data.resetToken) {
        console.log('Development reset token:', data.resetToken);
      }
    } catch (err) {
      setError('Network error. Please try again later.');
      console.error('Forgot password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormContainer title="Forgot your password?" subtitle="Enter your email to receive a password reset link.">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p className="font-bold">Error!</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Input
          label="Email Address"
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          required
        />

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Send Reset Link
        </Button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </AuthFormContainer>
  );
}
