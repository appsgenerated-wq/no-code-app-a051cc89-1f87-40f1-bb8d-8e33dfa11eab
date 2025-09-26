import React, { useState } from 'react';
import config from '../constants.js';

const AuthForm = ({ isLogin, onSubmit, onToggle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onSubmit(email, password);
    } else {
      onSubmit(name, email, password);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{isLogin ? 'Welcome Back' : 'Join CreatorFolio'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        )}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
          {isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>
      <p className="text-center text-gray-600 mt-6">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}
        <button onClick={onToggle} className="text-blue-600 hover:underline font-semibold ml-2">
          {isLogin ? 'Sign Up' : 'Login'}
        </button>
      </p>
    </div>
  );
};

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      <div className="lg:w-1/2 w-full flex flex-col justify-center items-start p-8 lg:p-20 bg-white">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">CreatorFolio</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-xl">The ultimate platform to build, manage, and share your creative portfolio. Powered by Manifest.</p>
        <div className="flex space-x-4">
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                Admin Panel
            </a>
            <button onClick={() => onLogin('demo@example.com', 'password')} className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                Try Demo
            </button>
        </div>
      </div>
      <div className="lg:w-1/2 w-full flex justify-center items-center p-8 bg-gradient-to-br from-blue-500 to-indigo-600">
          <AuthForm 
            isLogin={isLoginView} 
            onSubmit={isLoginView ? onLogin : onSignup} 
            onToggle={() => setIsLoginView(!isLoginView)} 
           />
      </div>
    </div>
  );
};

export default LandingPage;
