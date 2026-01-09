import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Callback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleTokenExtraction = () => {
      try {
        const hash = location.hash; 
        if (hash) {
          const params = new URLSearchParams(hash.substring(1));
          const extractedToken = params.get('token');
          if (extractedToken) {
            localStorage.setItem('jwtToken', extractedToken);
            console.log(extractedToken);
            console.log('Token extracted and stored in localStorage!');
            // Clear hash for clean URL
            window.history.replaceState({}, document.title, '/callback');   
          }
        }
      } catch (err) {
        setError('Token extraction failed: ' + err.message);
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    handleTokenExtraction();
  }, [location.hash, navigate]);

  if (loading) {
    return (
      <div className="callback-loading">
        <h2>Processing Login...</h2>
        <p>Extracting token from Google OAuth...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="callback-error">
        <h2>Login Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return null;  // Redirecting...
};

export default Callback;