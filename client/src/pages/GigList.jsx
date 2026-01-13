import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../store/slices/gigsSlice';
import { Link } from 'react-router-dom';

const GigList = () => {
    const dispatch = useDispatch();
    const { gigs, loading, error } = useSelector((state) => state.gigs);

    useEffect(() => {
        dispatch(fetchGigs({}));
    }, [dispatch]);

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Available Gigs</h1>
                {/* Search bar could go here */}
            </div>

            {loading && <p>Loading gigs...</p>}
            {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {gigs.map((gig) => (
                    <div key={gig._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{gig.title}</h3>
                            <span style={{
                                background: 'rgba(56, 189, 248, 0.1)',
                                color: 'var(--accent-color)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                fontSize: '0.875rem'
                            }}>
                                ${gig.budget}
                            </span>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', flex: 1 }}>
                            {gig.description.substring(0, 100)}...
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                {new Date(gig.createdAt).toLocaleDateString()}
                            </span>
                            <Link to={`/gigs/${gig._id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GigList;
