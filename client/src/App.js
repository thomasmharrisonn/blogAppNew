import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import CreatePost from './components/CreatePost';
import Posts from './components/Posts';

function App() {
  console.log("App loaded");
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('You have been logged out.');
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col items-center w-full">
      <Router>
        <nav className="flex gap-4 mt-6 mb-8">
          <Link
            to="/"
            className="px-4 py-2 rounded-lg text-slate-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Home
          </Link>
          {/* only if not logged in */}
          {!isLoggedIn && (
            <>
              <Link
                to="/Login"
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-blue-100 hover:text-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/Register"
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-blue-100 hover:text-blue-700 transition"
              >
                Register
              </Link>
            </>
          )}
          {/* only if logged in */}
          {isLoggedIn && (
            <>
              <Link
                to="/CreatePost"
                className="px-4 py-2 rounded-lg text-slate-700 hover:bg-blue-100 hover:text-blue-700 transition"
              >
                Create Post
              </Link>
            </>
          )}
          <Link
            to="/Posts"
            className="px-4 py-2 rounded-lg text-slate-700 hover:bg-blue-100 hover:text-blue-700 transition"
          >
            Posts
          </Link>
          {isLoggedIn && (
            <>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-100 hover:text-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Register" element={<Register/>}/>
          <Route path="/CreatePost" element={<CreatePost/>}/>
          <Route path="/Posts" element={<Posts/>}/>
        </Routes>
      </Router>
      </div>
  );
}

export default App;