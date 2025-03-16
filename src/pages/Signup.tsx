import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseConfig';
import LinkComponent from '../components/Link';
import Input from '../components/Input';
import Button from '../components/Button';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", userCredential.user);
  
      if (userCredential.user) {
        setUser({
          id: userCredential.user.uid,
          email: userCredential.user.email!,
        });
        navigate('/dashboard');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('email-already-in-use')) {
        setError('An account with this email already exists. Please use a different email or log in.');
      } else {
        setError(error instanceof Error ? error.message : 'An error occurred during signup');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-home">
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      {/* Content wrapper to ensure it stays in front */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md p-6 text-center">
        <div className="flex justify-center">
          <Plane className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-700">
          Already have an account?{' '}
          <LinkComponent
            to="/login"
            text="Sign in"
          />
        </p>

        <div className="mt-8 bg-white/70 backdrop-blur-md py-8 px-6 shadow-md rounded-lg">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            <Input 
              htmlFor="email"
              label="Email address"
              value={email}
              setValue={setEmail}
              id="email"
              name="email"
              autoComplete="email"
              required
              type="email"
              placeholder="Enter your email"
            />

      
            <Input 
              htmlFor="password"
              label="Password"
              value={password}
              setValue={setPassword}
              id="password"
              name="password"
              autoComplete="new-password"
              required
              type="password"
              placeholder="Enter your password"
            />

            <div>
              <Button 
                text="Creating account..."
                conditionalText="Create account"
                loading={loading}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}