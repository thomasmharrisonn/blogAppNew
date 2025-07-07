// src/App.js (or src/App.jsx)
import React from 'react';

function Home() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Hello, Simple React UI!</h1>
      <p>This is a basic example of a React component.</p>
      <button onClick={() => alert('Button clicked!')}>Click Me</button>
    </div>
  );
}

export default Home;