// src/App.js (or src/App.jsx)
import React from 'react';

function CreatePost() {
    const isLoggedIn = localStorage.getItem('token') ? true : false;
    const [posttitle, setPostTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [message, setMessage] = React.useState('');

    async function post() {
        const res = await fetch('/api/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ posttitle, content }),
        });

        if (res.ok) {
            setMessage("Post created successfully!");
            setPostTitle('');
            setContent('');
        } else {
            const data = await res.json();
            setMessage('Error creating post: ' + data.error);
        }
    }

    if (isLoggedIn) {
        return (
            <div className="flex flex-col items-center h-screen w-full">
                <div className="flex flex-col items-center mt-20 border w-1/2 min-h-96 bg-white rounded-lg shadow-sm">
                    <p className="mt-4">Hello {localStorage.getItem('username')}!</p>
                    <input
                        className="mt-4 mb-4 px-4 py-2 w-64 border rounded-2xl text-center"
                        type="text"
                        placeholder="Post Title"
                        value={posttitle}
                        onChange={e => setPostTitle(e.target.value)}
                    />
                    <textarea
                        className="mt-4 mb-4 px-4 py-2 w-64 border rounded-2xl text-center"
                        placeholder="Content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={6}
                    />
                    <button
                        className="w-32 border rounded-3xl text-center bg-blue-400 hover:bg-blue-600 text-white"
                        onClick={post}
                    >
                        Post
                    </button>
                    {message && <p className="text-center w-full mt-2">{message}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mt-20">
            <p>
                Login
                <a href="/Login" className="text-blue-500 hover:underline"> here</a>
            </p>
        </div>
    );
}

export default CreatePost;