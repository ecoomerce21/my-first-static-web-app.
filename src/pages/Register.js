import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = ({ setMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consumer'); // Default role is 'consumer'
  const [localMessage, setLocalMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Store the user's role in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        role,
      });

      // Set a success message
      setMessage && setMessage('Registration successful!');
      setLocalMessage(''); // Clear any local error messages

      // Redirect to the login page
      navigate('/login'); // After registration, navigate to the login page

    } catch (error) {
      // Handle any errors (e.g., user already exists)
      const errorMsg = error.message || 'Something went wrong.';
      setMessage && setMessage(errorMsg);
      setLocalMessage(errorMsg); // Display local error message
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="creator">Creator</option>
          <option value="consumer">Consumer</option>
        </select>
        <button type="submit">Register</button>
        {localMessage && <div className="register-message">{localMessage}</div>}
      </form>
    </div>
  );
};

export default Register;
