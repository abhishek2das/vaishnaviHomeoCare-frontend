export const logoutAdmin = () => {
  localStorage.removeItem('adminAuthenticated');
  localStorage.removeItem('adminToken');
  window.location.href = '/admin/login';
};

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
    logoutAdmin();
  }

  return response;
};
