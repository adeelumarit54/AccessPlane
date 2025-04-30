interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_token_expires_in: number;
  token_type: string;
  userID: string;
  expiryTime: number;
  refreshExpiryTime: number;
}

const TOKEN_KEY = 'auth_tokens';

export const storeTokens = (tokenData: TokenData) => {
  const expiryTime = Date.now() + (tokenData.expires_in * 1000);
  const refreshExpiryTime = Date.now() + (tokenData.refresh_token_expires_in * 1000);
  
  const tokens = {
    ...tokenData,
    expiryTime,
    refreshExpiryTime
  };
  
  console.log('Storing tokens with expiry:', {
    accessTokenExpiry: new Date(expiryTime).toLocaleString(),
    refreshTokenExpiry: new Date(refreshExpiryTime).toLocaleString()
  });
  
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
};

export const getTokens = (): TokenData | null => {
  const tokensStr = localStorage.getItem(TOKEN_KEY);
  if (!tokensStr) {
    console.log('No tokens found in storage');
    return null;
  }
  
  const tokens = JSON.parse(tokensStr);
  console.log('Retrieved tokens with expiry:', {
    accessTokenExpiry: new Date(tokens.expiryTime).toLocaleString(),
    refreshTokenExpiry: new Date(tokens.refreshExpiryTime).toLocaleString(),
    currentTime: new Date().toLocaleString()
  });
  return tokens;
};

export const isTokenExpired = (): boolean => {
  const tokens = getTokens();
  if (!tokens) return true;
  
  const isExpired = Date.now() >= tokens.expiryTime;
  console.log('Access token expired check:', {
    isExpired,
    expiryTime: new Date(tokens.expiryTime).toLocaleString(),
    currentTime: new Date().toLocaleString()
  });
  return isExpired;
};

export const isRefreshTokenExpired = (): boolean => {
  const tokens = getTokens();
  if (!tokens) return true;
  
  const isExpired = Date.now() >= tokens.refreshExpiryTime;
  console.log('Refresh token expired check:', {
    isExpired,
    expiryTime: new Date(tokens.refreshExpiryTime).toLocaleString(),
    currentTime: new Date().toLocaleString()
  });
  return isExpired;
};

export const refreshAccessToken = async (): Promise<TokenData | null> => {
  const tokens = getTokens();
  if (!tokens || isRefreshTokenExpired()) {
    return null;
  }

  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "refresh_token");
    urlencoded.append("refresh_token", tokens.refresh_token);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    const response = await fetch(
      "https://outlookdemo.accessplanit.com/accessplansandbox/api/v2/token",
      requestOptions
    );
    
    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const result = await response.json();
    storeTokens(result);
    return result;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
}; 