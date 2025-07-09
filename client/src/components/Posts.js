import React from 'react';
import { useNavigate } from 'react-router-dom';

function Posts() {
    const [posts, setPosts] = React.useState([]);
    const [editingId, setEditingId] = React.useState(null);
    const [editTitle, setEditTitle] = React.useState('');
    const [editContent, setEditContent] = React.useState('');
    const [message, setMessage] = React.useState('');
    const navigate = useNavigate();

    async function fetchPosts() {
        const res = await fetch('/api/posts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (res.ok) {
            setPosts(data.posts);
        } else {
            console.error('Error fetching posts:', data.error);
        }
    }

    async function deletePost(postId) {
        const res = await fetch(`/api/post/delete/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
            setMessage('Post deleted successfully');
            fetchPosts();
        } else {
            const data = await res.json();
            setMessage('Error deleting post: ' + data.error);
        }
    }

    async function editPost(postId) {
        const res = await fetch(`/api/post/edit/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ posttitle: editTitle, content: editContent }),
        });

        if (res.ok) {
            setMessage('Post edited successfully');
            setEditingId(null);
            fetchPosts();
        } else {
            const data = await res.json();
            setMessage('Error editing post: ' + data.error);
        }
    }

    React.useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="flex flex-col items-center mt-8 w-full">
            <button className="w-32 mb-8 border rounded-3xl text-center bg-blue-400 hover:bg-blue-600 text-white" onClick={() => navigate('/CreatePost')}>Create Post</button>
            {message && <p className="mb-12">{message}</p>}
            {posts.map(post => (
                <div key={post.id} className="bg-white shadow border rounded-3xl p-6 mb-4 w-5/6">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col w-full">
                            {editingId === post.id ? (
                                <>
                                    <div className="flex flex-col w-ful items-center">
                                        <input
                                            className="mb-2 px-4 py-2 w-full border rounded-2xl text-center"
                                            value={editTitle}
                                            onChange={e => setEditTitle(e.target.value)}
                                        />
                                        <textarea
                                            className="mb-2 px-4 py-2 w-full border rounded-2xl text-center"
                                            value={editContent}
                                            onChange={e => setEditContent(e.target.value)}
                                            rows={4}
                                        />
                                        <div className="flex gap-4 items-center">
                                            <button
                                                className="w-32 border rounded-3xl text-center bg-blue-400 hover:bg-blue-600 text-white mb-2"
                                                onClick={() => editPost(post.id)}
                                            >Save</button>
                                            <button
                                                className="w-32 border rounded-3xl text-center bg-gray-400 hover:bg-gray-600 text-white mb-2"
                                                onClick={() => setEditingId(null)}
                                            >Cancel</button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                                    <p className="mb-2">{post.content}</p>
                                    <p className="text-sm text-gray-500">By {post.username}</p>
                                    <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleString()}</p>
                                </>
                            )}
                        </div>
                        {/* Only show buttons if not editing this post */}
                        {editingId !== post.id && (
                            <div className="flex flex-col items-end space-y-2 ml-4">
                                <button
                                    className="w-32 border rounded-3xl text-center bg-blue-400 hover:bg-blue-600 text-white"
                                    onClick={() => {
                                        setEditingId(post.id);
                                        setEditTitle(post.title);
                                        setEditContent(post.content);
                                    }}
                                    disabled={editingId !== null}
                                >
                                    Edit
                                </button>
                                <button
                                    className="w-32 border rounded-3xl text-center bg-blue-400 hover:bg-blue-600 text-white"
                                    onClick={() => deletePost(post.id)}
                                    disabled={editingId !== null}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}

        </div>
    );
}

export default Posts;