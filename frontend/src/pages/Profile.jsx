import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className='center-screen'>
            <div className='glass' style={{ padding: '3rem', borderRadius: '1rem', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                    {user?.username?.charAt(0).toUpperCase()}
                </div>
                <h2 style={{ marginBottom: '0.5rem' }}>{user?.username}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{user?.email}</p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/" className='btn-primary' style={{ textDecoration: 'none', background: 'transparent', border: '1px solid var(--glass-border)' }}>
                        Back to Search
                    </Link>
                    <button onClick={handleLogout} className='btn-primary' style={{ background: '#ef4444' }}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
