import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { addNotification } from './store/slices/notificationSlice';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GigList from './pages/GigList';
import Dashboard from './pages/Dashboard';

// Placeholder Components (We'll implement these next)
const GigDetail = () => <div className="container"><h1>Gig Detail</h1></div>;

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    let socket;
    if (isAuthenticated && user) {
      socket = io('http://localhost:5000', {
        withCredentials: true,
      });

      socket.on('connect', () => {
        console.log('Connected to socket');
      });

      socket.on('hired', (data) => {
        console.log('Hired event received:', data);
        dispatch(addNotification({
          type: 'hired',
          message: data.message,
          data: { gigId: data.gigId, title: data.title },
          read: false,
          createdAt: new Date().toISOString(),
        }));
        // Optional: Show toast here
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [isAuthenticated, user, dispatch]);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gigs" element={<GigList />} />
          <Route path="/gigs/:id" element={<GigDetail />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
