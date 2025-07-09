// src/App.js (or src/App.jsx)
import React from 'react';

function Register() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');

    async function registerUser() {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok) {
            setMessage('Registration successful! You are now logged in.');
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            // Optionally redirect or update UI
            setUsername('');
            setPassword('');
        } else {
            setMessage('Error: ' + data.error);
        }
    }

    return (
        <div className="flex flex-col items-center h-screen w-full">
            <div className="flex flex-col items-center mt-20 border w-1/2 h-1/3 bg-white rounded-lg shadow-sm">
                <h1 className="font-semibold text-lg">Register</h1>
                <input
                    className="mt-4 mb-4 px-4 py-2 w-64 border rounded-2xl text-center"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    className="mt-4 mb-4 px-4 py-2 w-64 border rounded-2xl text-center"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    className="w-32 border rounded-3xl text-center bg-blue-400 hover:bg-blue-600 text-white"
                    onClick={registerUser}
                >
                    Register
                </button>
                {message && <p className="text-center w-full mt-2">{message}</p>}
            </div>
        </div>
    );
}

export default Register;