import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  console.log("App loaded");
  const [message, setMessage] = useState('');

  /*useEffect(() => {
      fetch('/api/message')
          .then(res => res.json())
          .then(data => setMessage(data.message))
          .catch(err => console.error(err));
  }, []);*/

  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> |{" "}
        <Link to="/Login">Login</Link> |{" "}
        <Link to="/Register">Register</Link> |{" "}
        <Link to="/Dashboard">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<><Home/><Home/></>}/>
        <Route path="/Login" element={<Login/>}/>
        <Route path="/Register" element={<Register/>}/>
        <Route path="/Dashboard" element={<h2>Dashboard</h2>}/>
      </Routes>
    </Router>
  );
}

export default App;