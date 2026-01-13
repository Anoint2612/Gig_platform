import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Bell, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => state.notifications);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="glass-panel" style={{
            padding: '1rem 2rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '0 0 16px 16px',
            borderTop: 'none'
        }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                GigSpace
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/gigs" style={{ fontWeight: 500 }}>Find Gigs</Link>

                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" style={{ fontWeight: 500 }}>Dashboard</Link>
                        <div style={{ position: 'relative', cursor: 'pointer' }}>
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: 'var(--error)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '16px',
                                    height: '16px',
                                    fontSize: '10px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {unreadCount}
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} />
                            <span>{user?.email}</span>
                        </div>
                        <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <LogOut size={20} />
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ fontWeight: 500 }}>Login</Link>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
