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

    return await response.json();
  } catch (error) {
    console.error('❌ API Error:', error);
    
    if (error.name === 'AbortError') {
      throw new Error('La solicitud tardó demasiado tiempo. Verifica tu conexión.');
    }
    
    throw error;
  }
}

export const steamAPI = {
  getJuegos: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    return fetchAPI(`/juegos${queryString ? '?' + queryString : ''}`);
  },

  buscarJuegos: (termino, genero = 'todos') => {
    if (!termino || termino.trim() === '') {
      return Promise.resolve({ data: [], total: 0 });
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('q', termino);
    if (genero !== 'todos') {
      queryParams.append('genero', genero);
    }
    
    return fetchAPI(`/juegos/buscar?${queryParams.toString()}`);
  },

  getDetallesJuego: (appId) => {
    if (!appId) {
      throw new Error('appId es requerido');
    }
    return fetchAPI(`/juegos/${appId}`);
  },
  
  getJuegosPorGenero: (genero) => {
    if (!genero) {
      throw new Error('género es requerido');
    }
    return fetchAPI(`/juegos/genero/${encodeURIComponent(genero)}`);
  },
  
  getGeneros: () => {
    return fetchAPI('/generos');
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
    return fetchAPI(`/noticias${queryString ? '?' + queryString : ''}`);
  },

  buscarNoticias: (termino, categoria = null) => {
    if (!termino || termino.trim() === '') {
      return Promise.resolve({ data: [], total: 0 });
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('q', termino);
    if (categoria) {
      queryParams.append('categoria', categoria);
    }
    
    return fetchAPI(`/noticias/buscar?${queryParams.toString()}`);
  },

  getNoticiasPorCategoria: (categoria, pagina = 1, limite = 10) => {
    if (!categoria) {
      throw new Error('categoría es requerida');
    }
    return fetchAPI(`/noticias/categoria/${encodeURIComponent(categoria)}?pagina=${pagina}&limite=${limite}`);
  },
  
  getDetallesNoticia: (id) => {
    if (!id) {
      throw new Error('id es requerido');
    }
    return fetchAPI(`/noticias/${id}`);
  },

  getCategorias: () => {
    return fetchAPI('/noticias/categorias');
  },

  getNoticiasRecientes: (limite = 5) => {
    return fetchAPI(`/noticias/recientes?limite=${limite}`);
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
