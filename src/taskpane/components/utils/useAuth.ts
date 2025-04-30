import { useState, useCallback } from 'react';
import { refreshAccessToken, isTokenExpired, getTokens } from './authUtils';

export const useAuth = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getAuthHeaders = useCallback(async () => {
    if (isTokenExpired()) {
      if (isRefreshing) {
        // Wait for the ongoing refresh to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getAuthHeaders();
      }

      setIsRefreshing(true);
      try {
        const newTokens = await refreshAccessToken();
        if (!newTokens) {
          throw new Error('Failed to refresh token');
        }
        return {
          'Authorization': `Bearer ${newTokens.access_token}`,
          'Content-Type': 'application/json'
        };
      } finally {
        setIsRefreshing(false);
      }
    }

    const tokens = getTokens();
    if (!tokens) {
      throw new Error('No tokens available');
    }

    return {
      'Authorization': `Bearer ${tokens.access_token}`,
      'Content-Type': 'application/json'
    };
  }, [isRefreshing]);

  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token might be invalid, try refreshing
      const newTokens = await refreshAccessToken();
      if (!newTokens) {
        throw new Error('Authentication failed');
      }
      
      // Retry the request with new token
      const newHeaders = await getAuthHeaders();
      return fetch(url, {
        ...options,
        headers: {
          ...newHeaders,
          ...options.headers,
        },
      });
    }

    return response;
  }, [getAuthHeaders]);

  return { authFetch, getAuthHeaders };
}; 