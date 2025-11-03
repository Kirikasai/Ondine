const API_BASE = 'http://localhost:8000/api';

const REQUEST_TIMEOUT = 10000;

const getCommonHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

// Función genérica para autenticación
async function fetchAuthAPI(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    const url = `${API_BASE}${endpoint}`;
    console.log(`🔐 Auth request a: ${url}`);
    
    // Obtener token si existe
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(url, {
      headers: {
        ...getCommonHeaders(),
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      signal: controller.signal,
      ...options
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.message || JSON.stringify(errorData)}`);
      } catch {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Auth API Error:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado tiempo. Verifica tu conexión.');
    }
    
    throw error;
  }
}

// Auth API
export const authAPI = {
  login: (credentials) => {
    return fetchAuthAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },
  
  register: (userData) => {
    return fetchAuthAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  logout: () => {
    return fetchAuthAPI('/auth/logout', {
      method: 'POST'
    });
  },
  
  getUser: () => {
    return fetchAuthAPI('/auth/user');
  },
  
  updateProfile: (userData) => {
    return fetchAuthAPI('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },
  
  // Verificar si el usuario está autenticado
  checkAuth: () => {
    return fetchAuthAPI('/auth/check');
  }
};

// Exportación por defecto para compatibilidad
export default authAPI;