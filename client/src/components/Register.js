// src/App.js (or src/App.jsx)
import React from 'react';

function Register() {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');

    async function registerUser(){
        const res = await fetch('/api/register',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        });

        const data = await res.json();

        if (res.ok){
            setMessage('User Registered');
        } else {
            setMessage('Error Registering User: ' + data.error);
        }
    }
    console.log(username, password);
    return (
    <div className="flex flex-col items-center mt-20">
        <h1 className="font-semibold text-lg">Register an account!</h1>
        <input 
            className="mt-4 mb-4 px-4 py-2 w-64 border rounded text-center" 
            type="text" 
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
        />
        <input 
            className="mt-4 mb-4 px-4 py-2 w-64 border rounded text-center" 
            type="text" 
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
        />
        <button className="w-32 border rounded text-center" onClick={registerUser}>Create Account</button>
        {message && <p>{message}</p>}
    </div>
    );
    
}



export default Register;