import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [message, setMessage] = useState('');
  const { loginUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission for email/password login
  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data.email, data.password);
      
      // Log the entire response to check what is received
      console.log('Login Response:', response);
  
      // Ensure the token exists in the response
      if (response && response.token) {
        localStorage.setItem('token', response.token); // Store token in localStorage
        console.log('Token stored successfully:', response.token);
        alert('Login successful!');
        navigate('/'); // Navigate to home/dashboard
      } else {
        setMessage('Token not found in the response. Please check the server response.');
      }
    } catch (error) {
      setMessage('Please provide a valid email and password');
      console.error('Login Error:', error);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      console.log('Google Sign-in Result:', result);

      // Check if the result contains user data and retrieve the token
      if (result && result.user) {
        const token = await result.user.getIdToken();
        console.log('Token Retrieved:', token);
        localStorage.setItem('token', token); // Store Google token in localStorage
      }
      alert('Login successful!');
      navigate('/'); // Navigate to home/dashboard
    } catch (error) {
      console.error('Google Sign-in Error:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Please Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              {...register('email', { required: true })}
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              {...register('password', { required: true })}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>
          {message && <p className="text-red-500 text-xs italic mb-3">{message}</p>}
          <div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none">
              Login
            </button>
          </div>
        </form>
        <p className="align-baseline font-medium mt-4 text-sm">
          Haven't an account? Please{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-700">
            Register
          </Link>
        </p>

        {/* Google sign-in */}
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex flex-wrap gap-1 items-center justify-center bg-secondary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
          >
            <FaGoogle className="mr-2" />
            Sign in with Google
          </button>
        </div>

        <p className="mt-5 text-center text-gray-500 text-xs">
          ©2025 Book Store. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;

