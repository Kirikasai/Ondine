const API_BASE = 'http://localhost:8000/api';


const REQUEST_TIMEOUT = 10000;

const getCommonHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

export const verificarAPI = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE}/test`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('❌ API no disponible:', error);
    return false;
  }
};

async function fetchAPI(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    const url = `${API_BASE}${endpoint}`;
    console.log(`🔄 Haciendo request a: ${url}`);
    
    const response = await fetch(url, {
      headers: getCommonHeaders(),
      signal: controller.signal,
      ...options
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Ruta no encontrada: ${url}. Verifica tu backend Laravel.`);
      }
      
      try {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.message || JSON.stringify(errorData)}`);
      } catch {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
    }

    const json = await response.json();
    console.log('✅ API response for', url, json); // <-- debug log
    return json;
  } catch (error) {
    console.error('❌ API Error:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado tiempo. Verifica tu conexión.');
    }
    
    throw error;
  }
}
const handleResponse = async (response) => {
  console.log('📡 Response status:', response.status);
  
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {
      // Si no se puede parsear JSON, usar texto plano
      const text = await response.text();
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }
  
  try {
    const data = await response.json();
    console.log('📦 Response data:', data);
    return data;
  } catch (e) {
    console.error('❌ Error parsing JSON:', e);
    throw new Error('Invalid JSON response from server');
  }
};

export const steamAPI = {
  getJuegos: async (params = {}) => {
    console.log('🎮 INICIO: getJuegos', params);
    
    const queryParams = new URLSearchParams();
    
    // Agregar solo parámetros válidos
    const validParams = ['pagina', 'limite', 'busqueda', 'genero', 'plataforma'];
    validParams.forEach(key => {
      if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const url = `${API_BASE}/juegos${queryString ? '?' + queryString : ''}`;
    
    console.log('🔗 URL final:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      const data = await handleResponse(response);
      console.log('✅ getJuegos exitoso:', {
        juegosCount: data.juegos ? data.juegos.length : 0,
        fuente: data.fuente,
        mensaje: data.mensaje
      });
      
      return data;
    } catch (error) {
      console.error('❌ Error en getJuegos:', error);
      throw error;
    }
  },

  buscarJuegos: async (termino) => {
    if (!termino || termino.trim() === '') {
      console.log('🔍 Búsqueda vacía, retornando vacío');
      return { juegos: [], total: 0 };
    }
    
    console.log('🔍 Buscando juegos:', termino);
    
    try {
      const response = await fetch(`${API_BASE}/juegos/buscar?q=${encodeURIComponent(termino)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const data = await handleResponse(response);
      console.log('✅ buscarJuegos exitoso:', {
        resultados: data.juegos ? data.juegos.length : 0
      });
      
      return data;
    } catch (error) {
      console.error('❌ Error en buscarJuegos:', error);
      throw error;
    }
  },

  getDetallesJuego: async (id) => {
    if (!id) {
      throw new Error('ID es requerido');
    }
    
    console.log('🔍 Obteniendo detalles del juego:', id);
    
    try {
      const response = await fetch(`${API_BASE}/juegos/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error('❌ Error en getDetallesJuego:', error);
      throw error;
    }
  },
  
  getGeneros: async () => {
    console.log('📋 Solicitando géneros...');
    
    try {
      const response = await fetch(`${API_BASE}/generos`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const data = await handleResponse(response);
      console.log('✅ getGeneros exitoso:', {
        total: data.total,
        generosCount: data.generos ? data.generos.length : 0
      });
      
      return data;
    } catch (error) {
      console.error('❌ Error en getGeneros:', error);
      throw error;
    }
  },

  getPlataformas: async () => {
    console.log('🖥️ Solicitando plataformas...');
    
    try {
      const response = await fetch(`${API_BASE}/plataformas`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      const data = await handleResponse(response);
      console.log('✅ getPlataformas exitoso:', {
        total: data.total,
        plataformasCount: data.plataformas ? data.plataformas.length : 0
      });
      
      return data;
    } catch (error) {
      console.error('❌ Error en getPlataformas:', error);
      throw error;
    }
  }
};

export const newsAPI = {
  getNoticias: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    return fetch(`${API_BASE}/noticias${queryString ? '?' + queryString : ''}`)
      .then(response => response.json());
  },

  buscarNoticias: (termino, categoria = null) => {
    if (!termino || termino.trim() === '') {
      return Promise.resolve({ noticias: [], total: 0 });
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('q', termino);
    if (categoria) {
      queryParams.append('categoria', categoria);
    }
    
    return fetch(`${API_BASE}/noticias/buscar?${queryParams.toString()}`)
      .then(response => response.json());
  },

  getCategorias: () => {
    return fetch(`${API_BASE}/noticias/categorias`)
      .then(response => response.json());
  },

  getNoticiasRecientes: (limite = 5) => {
    return fetch(`${API_BASE}/noticias/recientes?limite=${limite}`)
      .then(response => response.json());
  }
};


export const userAPI = {

  getFavoritos: () => {
    return fetchAPI('/user/favoritos');
  },
 
  agregarFavorito: (appId) => {
    if (!appId) {
      throw new Error('appId es requerido');
    }
    return fetchAPI('/user/favoritos', {
      method: 'POST',
      body: JSON.stringify({ app_id: appId })
    });
  },

  eliminarFavorito: (appId) => {
    if (!appId) {
      throw new Error('appId es requerido');
    }
    return fetchAPI(`/user/favoritos/${appId}`, {
      method: 'DELETE'
    });
  },
  

  esFavorito: (appId) => {
    if (!appId) {
      throw new Error('appId es requerido');
    }
    return fetchAPI(`/user/favoritos/${appId}/check`);
  }
};


export const analyticsAPI = {

  getEstadisticas: () => {
    return fetchAPI('/analytics/estadisticas');
  },
  

  getJuegosPopulares: (limite = 10) => {
    return fetchAPI(`/analytics/juegos-populares?limite=${limite}`);
  },
  

  getTendenciasBusqueda: (limite = 10) => {
    return fetchAPI(`/analytics/tendencias-busqueda?limite=${limite}`);
  }
};
export { fetchAPI };
