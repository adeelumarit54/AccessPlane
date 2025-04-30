import React, { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from '../pages/Home'; // Example: Adjust the path to your actual component
import Login from '../pages/Login';
import { isTokenExpired, isRefreshTokenExpired, refreshAccessToken, getTokens } from '../utils/authUtils';

const TokenCheck: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const tokens = getTokens();
      const onLoginPage = location.pathname === '/';

      console.log('Current tokens:', tokens);
      console.log('Current path:', location.pathname);

      // 🚫 Skip refresh logic if we're already on the login page
      if (onLoginPage) {
        if (tokens && !isTokenExpired()) {
          console.log('Redirecting to home from login page');
          navigate("/home");
        }
        return;
      }

      // ✅ If refresh token is expired, go to login
      if (isRefreshTokenExpired()) {
        console.log('Refresh token expired, redirecting to login');
        navigate("/");
        return;
      }

      // 🔁 Try to refresh access token if expired
      if (isTokenExpired()) {
        console.log('Access token expired, attempting refresh');
        const newTokens = await refreshAccessToken();
        if (!newTokens) {
          console.log('Token refresh failed, redirecting to login');
          navigate("/");
          return;
        }
        console.log('Token refresh successful');
      }

      // 🔐 If no valid tokens, go to login
      if (!tokens || isTokenExpired()) {
        console.log('No valid tokens, redirecting to login');
        navigate("/");
        return;
      }
    };

    checkAuth();
  }, [navigate, location]);

  return null;
};


const AppRouter: React.FC = () => {
  return (
    <Router>
      <TokenCheck />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRouter;