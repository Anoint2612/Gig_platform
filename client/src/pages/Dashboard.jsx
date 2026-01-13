import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyGigs, createGig } from '../store/slices/gigsSlice';
import { fetchMyBids } from '../store/slices/bidsSlice';
import { Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { gigs: myGigs, loading: gigsLoading } = useSelector((state) => state.gigs);
    const { bids: myBids, loading: bidsLoading } = useSelector((state) => state.bids);

    const [showCreateGig, setShowCreateGig] = useState(false);
    const [gigForm, setGigForm] = useState({ title: '', description: '', budget: '' });

    useEffect(() => {
        dispatch(fetchMyGigs());
        dispatch(fetchMyBids());
    }, [dispatch]);

    const handleCreateGig = async (e) => {
        e.preventDefault();
        const result = await dispatch(createGig(gigForm));
        if (!result.error) {
            setShowCreateGig(false);
            setGigForm({ title: '', description: '', budget: '' });
            dispatch(fetchMyGigs()); // Refresh list
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Dashboard</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateGig(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} /> Post New Gig
                </button>
            </div>

            {/* Create Gig Modal/Panel */}
            {showCreateGig && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', position: 'relative' }}>
                    <button
                        onClick={() => setShowCreateGig(false)}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>
                    <h2 style={{ marginBottom: '1.5rem' }}>Create a New Gig</h2>
                    <form onSubmit={handleCreateGig} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Gig Title"
                            className="input-field"
                            value={gigForm.title}
                            onChange={(e) => setGigForm({ ...gigForm, title: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Description"
                            className="input-field"
                            rows="4"
                            value={gigForm.description}
                            onChange={(e) => setGigForm({ ...gigForm, description: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Budget ($)"
                            className="input-field"
                            value={gigForm.budget}
                            onChange={(e) => setGigForm({ ...gigForm, budget: e.target.value })}
                            required
                        />
                        <button type="submit" className="btn btn-primary">Publish Gig</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* My Gigs Section */}
                <div>
                    <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>My Gigs</h2>
                    {gigsLoading ? <p>Loading...</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {myGigs.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No gigs posted yet.</p> : (
                                myGigs.map(gig => (
                                    <div key={gig._id} className="glass-panel" style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h3 style={{ margin: '0 0 0.5rem 0' }}>{gig.title}</h3>
                                            <span style={{
                                                fontSize: '0.8rem',
                                                padding: '0.2rem 0.5rem',
                                                borderRadius: '4px',
                                                background: gig.status === 'open' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                                color: gig.status === 'open' ? 'var(--success)' : 'var(--error)'
                                            }}>
                                                {gig.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Budget: ${gig.budget}</p>
                                        <Link to={`/gigs/${gig._id}`} style={{ fontSize: '0.9rem', color: 'var(--accent-color)', marginTop: '0.5rem', display: 'inline-block' }}>
                                            View & Manage Bids
                                        </Link>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* My Bids Section */}
                <div>
                    <h2 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>My Bids</h2>
                    {bidsLoading ? <p>Loading...</p> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {myBids.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No bids placed yet.</p> : (
                                myBids.map(bid => (
                                    <div key={bid._id} className="glass-panel" style={{ padding: '1rem' }}>
                                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{bid.gigId?.title || 'Unknown Gig'}</h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                            <span>My Offer: ${bid.price}</span>
                                            <span style={{
                                                color: bid.status === 'accepted' ? 'var(--success)' : bid.status === 'rejected' ? 'var(--error)' : 'var(--text-secondary)'
                                            }}>
                                                {bid.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
