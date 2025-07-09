// src/App.js (or src/App.jsx)
import React from 'react';

function Home() {
  const isLoggedIn = localStorage.getItem('token') ? true : false;
  const username = localStorage.getItem('username');

  return (
    <div className="flex flex-col items-center justify-center w-full  min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="bg-white rounded-xl shadow-lg p-8 ">
        {isLoggedIn ? (
          <>
            <h1 className="text-3xl font-bold text-purple-700 mb-4">Welcome back!</h1>
            <p className="text-lg text-gray-700 mb-6">Hello, <span className="font-semibold">{username}</span> 👋</p>
            <a
              href="/dashboard"
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition"
            >
              Go to Dashboard
            </a>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-blue-700 mb-4">Welcome to BlogApp</h1>
            <p className="text-lg text-gray-700 mb-6">Please log in to continue.</p>
            <a
              href="/Login"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Login
            </a>
          </>
        )}
      </div>
    </div>
  );
}
export default Home;