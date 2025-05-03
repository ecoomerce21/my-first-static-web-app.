import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import CreatorView from './pages/CreatorView';
import ConsumerView from './pages/ConsumerView';
import Login from './pages/Login';
import Register from './pages/Register';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import './App.css';

function AppWrapper() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userRole = userData.role || 'consumer'; // Default to 'consumer' if role is not set
            setRole(userRole);
            setMessage('Login successful!');
            // Navigate to the appropriate view based on the role
            navigate(userRole === 'creator' ? '/creator' : '/consumer');
          } else {
            setMessage('User not found in Firestore');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      } else {
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setMessage('Logged out successfully');
    navigate('/');
  };

  return (
    <>
      <div className="navbar">
        {!user ? (
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: '1rem' }}>Logged in as {role}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>

      {message && <div style={{ margin: '1rem', color: 'green' }}>{message}</div>}

      <Routes>
        <Route path="/login" element={<Login setMessage={setMessage} />} />
        <Route path="/register" element={<Register setMessage={setMessage} />} />
        <Route path="/creator" element={<CreatorView />} />
        <Route path="/consumer" element={<ConsumerView />} />
        <Route path="/" element={<h1 style={{ padding: '2rem', color: 'white', textAlign: 'center' }}>Welcome to Video Sharing App!</h1>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
