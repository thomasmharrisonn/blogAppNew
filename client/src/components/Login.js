// src/App.js (or src/App.jsx)
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [message, setMessage] = React.useState('');
    const navigate = useNavigate();
    async function loginUser(){
        const res = await fetch('/api/login',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        });

        console.log("HERE");

        const data = await res.json();
        

        console.log(data);

        if (res.ok){
            setMessage("User logged in");
            // store token in local storage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', username);
            window.location.reload();
            navigate('/Posts')
        } else {
            setMessage('Error Logging In: '+ data.error);
        }
    }
    console.log(username, password);
    const isLoggedIn = localStorage.getItem('token') ? true : false;
    if(!isLoggedIn) {
        console.log(username, password);
        return (
            <div className="flex flex-col items-center h-screen w-full">
                <div className="flex flex-col items-center mt-20 border w-1/2 h-1/3 bg-white rounded-lg shadow-sm">
                    <h1 className="font-semibold text-lg ">Login</h1>
                    <input 
                        className="mt-4 mb-4 px-4 py-2 w-64 border rounded-2xl text-center" 
                        type="text" 
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input 
                        className="mt-4 mb-4 px-4 py-2 w-64 border rounded-2xl text-center" 
                        type="text" 
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button className="w-32 border rounded-3xl text-center bg-blue-400 hover:bg-blue-600 text-white" onClick={loginUser }>Login</button>
                    <p className="mt-2">Dont have an account? Register <a href="/Register" className="text-blue-500 hover:underline"> here</a></p>
                    {message && <p className="text-center w-full mt-2">{message}</p>}
                </div>
            </div>
        );   
    }
    else{
        return (
            <div className="flex flex-col items-center mt-20">
                <p>Hello, {localStorage.getItem('username')}!</p>
                <p>You are logged in.</p>
            </div>
        );
    }


}

export default Login;