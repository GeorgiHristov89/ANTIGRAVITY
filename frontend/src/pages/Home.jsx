import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');
    const [message, setMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:5000/search?q=${query}`);
            setResults(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/items', {
                name: newItemName,
                description: newItemDesc
            });
            setMessage('Item added successfully!');
            setNewItemName('');
            setNewItemDesc('');
            // Optional: refresh search results if query exists, or just clear them
            if (query) {
                const res = await axios.get(`http://localhost:5000/search?q=${query}`);
                setResults(res.data);
            }
        } catch (err) {
            setMessage('Failed to add item. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className='container'>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                <h1>Flight Manager</h1>
                <nav>
                    <Link to="/profile" className='btn-primary' style={{ textDecoration: 'none', background: 'transparent', border: '1px solid var(--primary)' }}>My Profile</Link>
                </nav>
            </header>

            <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Find what you need</h2>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <input
                        type='text'
                        className='input-field'
                        placeholder='Search for flights...'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type='submit' className='btn-primary'>Search</button>
                </form>

                <div className='glass' style={{ padding: '2rem', borderRadius: '1rem', width: '100%', marginBottom: '3rem', textAlign: 'left' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Add New Item</h3>
                    {message && <p style={{ color: message.includes('Success') ? '#10b981' : 'var(--primary)', marginBottom: '1rem' }}>{message}</p>}
                    <form onSubmit={handleAddItem}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor='itemName' style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Item Name</label>
                            <input
                                id='itemName'
                                type='text'
                                className='input-field'
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                required
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor='itemDesc' style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Description</label>
                            <input
                                id='itemDesc'
                                type='text'
                                className='input-field'
                                value={newItemDesc}
                                onChange={(e) => setNewItemDesc(e.target.value)}
                                required
                            />
                        </div>
                        <button type='submit' className='btn-primary' style={{ width: '100%' }}>Add Item</button>
                    </form>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {results.map((item) => (
                        <div key={item.id} className='glass' style={{ padding: '1.5rem', borderRadius: '0.75rem', textAlign: 'left' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.name}</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>{item.description}</p>
                        </div>
                    ))}
                    {results.length === 0 && query && <p style={{ color: 'var(--text-muted)' }}>No results found.</p>}
                </div>
            </div>
        </div>
    );
};

export default Home;
