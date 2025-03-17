import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Input from '../components/Input';
import Button from '../components/Button';
import LinkComponent from '../components/Link';

export function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (userCredential.user) {
        const userData = {
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
        };
        setUser(userData);
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-home">
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="text-center">
          <div className="flex justify-center">
            <Plane className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-700">
            Don't have an account?{' '}
            <LinkComponent 
              to='/signup'
              text='Sign up'
            />
          </p>
        </div>

        <div className="mt-8 bg-white/70 backdrop-blur-md py-8 px-6 shadow-md rounded-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <Input label='Email address'
              htmlFor='email'
              value={email}
              setValue={setEmail}
              id='email'
              name='email'
              autoComplete='email'
              required={true}
              type='email'
              placeholder='Enter your email'
            />

       
            <Input label='Password'
              htmlFor='password'
              value={password}
              setValue={setPassword}
              id='password'
              name='password'
              autoComplete='current-password'
              required={true}
              type='password'
              placeholder='Enter your password'
            />

            <Button 
              loading={loading}
              text='Signing in...'
              conditionalText='Sign in'
            />
          </form>
        </div>
      </div>
    </div>
  );
}