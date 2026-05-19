export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : '',
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    // Optionally handle unauthorized/forbidden errors (e.g., redirect to login)
    console.error('Unauthorized or Forbidden access');
  }

  return response;
};
