import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Find Your Next Gig in Space
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>
                Connect with top talent or find your dream project on the galaxy's premier freelance platform. Secure, fast, and out of this world.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/gigs" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                    Browse Gigs
                </Link>
                <Link to="/register" className="btn" style={{ fontSize: '1.1rem', padding: '1rem 2rem', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)' }}>
                    Join Now
                </Link>
            </div>

            <div style={{ marginTop: '5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ color: 'var(--accent-color)' }}>Secure Payments</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Escrow protection for every mission.</p>
                </div>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ color: 'var(--accent-color)' }}>Verified Talent</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Only the best pilots in the fleet.</p>
                </div>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ color: 'var(--accent-color)' }}>Fast Comms</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Real-time updates at light speed.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
