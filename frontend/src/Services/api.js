const API_BASE = "http://localhost:8000/api";
const REQUEST_TIMEOUT = 30000; // 30 segundos

const handleResponse = async (response) => {
  // Log status para debugging
  console.log("📡 Response status:", response.status);

  // 204 No Content
  if (response.status === 204) return {};

  if (!response.ok) {
    let errorMessage = `Error HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.mensaje ||
        errorData.error ||
        JSON.stringify(errorData) ||
        errorMessage;
    } catch (e) {
      const text = await response.text();
      errorMessage = text || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // try json sino se devuelve texto
  try {
    return await response.json();
  } catch (e) {
    return await response.text();
  }
};

// Unified fetch y automatizado JSON handling + auth header
async function fetchAPI(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
  console.log(`🔄 Haciendo request a: ${url}`);

  const controller = new AbortController();
  const timeout = options.timeout ?? 30000; // 30s default
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") || localStorage.getItem("token") : null;

    const headers = {
      Accept: "application/json",
      ...(options.headers || {}),
    };

    let body = options.body;

    // si el body es un plain object y no un FormData, se usa stringify y se le da un header
    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;
    const isPlainObject =
      body &&
      typeof body === "object" &&
      !isFormData &&
      !(body instanceof ArrayBuffer);

    if (isPlainObject) {
      body = JSON.stringify(body);
      if (!headers["Content-Type"])
        headers["Content-Type"] = "application/json";
    }

    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    const fetchOptions = {
      method: options.method || (body ? "POST" : "GET"),
      headers,
      body,
      signal: controller.signal,
    };

    if (
      (fetchOptions.method || "GET").toUpperCase() === "GET" ||
      (fetchOptions.method || "GET").toUpperCase() === "HEAD"
    ) {
      delete fetchOptions.body;
    }

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);
    return await handleResponse(response);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("❌ Error en fetchAPI:", error);
    if (error.name === "AbortError") {
      throw new Error("La solicitud tardó demasiado tiempo.");
    }
    throw error;
  }
}

async function fetchAuthAPI(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const url = `${API_BASE}${endpoint}`;
    console.log(`🔐 Auth request a: ${url}`);

    let body = options.body;
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    const headers = {
      Accept: 'application/json',
      ...(options.headers || {}),
    };

    if (!isFormData) {
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    // ✅ CRÍTICO: Leer token con clave consistente
    const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log("✅ Token agregado al header:", token.substring(0, 10) + '...');
    } else {
      console.warn("⚠️ Sin token en localStorage para petición autenticada");
    }

    if (body && typeof body === 'object' && !(body instanceof FormData)) {
      body = JSON.stringify(body);
    }

    const fetchOptions = {
      method: options.method || 'GET',
      headers,
      body,
      signal: controller.signal,
    };

    if (['GET', 'HEAD'].includes(fetchOptions.method.toUpperCase())) {
      delete fetchOptions.body;
    }

    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);

    console.log(`📡 Response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.mensaje || errorData.message || JSON.stringify(errorData);
      } catch (e) {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) return {};
    return await response.json();
  } catch (error) {
    console.error('❌ Auth API Error:', error);
    if (error.name === 'AbortError') {
      throw new Error('Timeout en la solicitud');
    }
    throw error;
  }
}

/*
    API helpers
*/
export const authAPI = {
  // Auth
  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: credentials
  }),
  
  register: (userData) => fetchAPI('/auth/register', {
    method: 'POST',
    body: userData
  }),
  
  logout: () => fetchAuthAPI('/auth/logout', { method: 'POST' }),
  
  getUser: () => fetchAuthAPI('/auth/user'),
  
  updateProfile: (data) => fetchAuthAPI('/auth/profile', {
    method: 'PUT',
    body: data
  }),

  get: (endpoint) => fetchAuthAPI(endpoint),

  // Blogs
  getBlogs: (params = {}) => {
    const qp = new URLSearchParams();
    Object.keys(params).forEach(k => {
      if (params[k] !== undefined) qp.append(k, params[k]);
    });
    const qs = qp.toString() ? `?${qp.toString()}` : '';
    return fetchAPI(`/blogs${qs}`);
  },

  getBlog: (id) => fetchAPI(`/blogs/${id}`),

  //  Comentarios de blogs
  getBlogComments: (blogId) => {
    return fetchAPI(`/blogs/${blogId}/comentarios`);
  },

  addBlogComment: (blogId, contenido) => {
    return fetchAuthAPI(`/blogs/${blogId}/comentarios`, {
      method: 'POST',
      body: { contenido }
    });
  },

  deleteBlogComment: (blogId, comentarioId) => {
    return fetchAuthAPI(`/blogs/${blogId}/comentarios/${comentarioId}`, {
      method: 'DELETE'
    });
  },

  //  Likes de blogs
  likeBlog: (blogId) => {
    return fetchAuthAPI(`/blogs/${blogId}/like`, {
      method: 'POST'
    });
  },

  getBlogLikesInfo: (blogId) => {
    return fetchAPI(`/blogs/${blogId}/likes`);
  }
};

export const rawgAPI = {
  getJuegos: async (params = {}) => {
    const defaultParams = { pagina: 1, limite: 20 };
    const finalParams = { ...defaultParams, ...params };
    const queryParams = new URLSearchParams();

    Object.keys(finalParams).forEach((key) => {
      const val = finalParams[key];
      if (val !== undefined && val !== "" && val !== null)
        queryParams.append(key, val);
    });

    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : "";
    console.log("🔗 Solicitando RAWG:", `${API_BASE}/juegos${queryStr}`);
    return fetchAPI(`/juegos${queryStr}`);
  },

  buscarJuegos: async (termino) => {
    if (!termino || termino.trim() === "") return { juegos: [], total: 0 };
    console.log("🔍 Buscando en RAWG:", termino);
    return fetchAPI(`/juegos/buscar?q=${encodeURIComponent(termino)}`);
  },

  getGeneros: async () => {
    console.log("📋 Solicitando géneros de RAWG...");
    return fetchAPI("/generos");
  },

  getPlataformas: async () => {
    console.log("🖥️ Solicitando plataformas de RAWG...");
    return fetchAPI("/plataformas");
  },
};

// Mantener alias para compatibilidad hacia atrás
export const giantbombAPI = rawgAPI;

export const newsAPI = {
  getNoticias: (params = {}) => {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      if (
        params[key] !== undefined &&
        params[key] !== "" &&
        params[key] !== null
      ) {
        queryParams.append(key, params[key]);
      }
    });

    const queryString = queryParams.toString();
    return fetch(
      `${API_BASE}/noticias${queryString ? "?" + queryString : ""}`
    ).then((response) => response.json());
  },

  buscarNoticias: (termino, categoria = null) => {
    if (!termino || termino.trim() === "") {
      return Promise.resolve({ noticias: [], total: 0 });
    }

    const queryParams = new URLSearchParams();
    queryParams.append("q", termino);
    if (categoria) {
      queryParams.append("categoria", categoria);
    }

    return fetch(`${API_BASE}/noticias/buscar?${queryParams.toString()}`).then(
      (response) => response.json()
    );
  },

  getCategorias: () => {
    return fetch(`${API_BASE}/noticias/categorias`).then((response) =>
      response.json()
    );
  },

  getNoticiasRecientes: (limite = 5) => {
    return fetch(`${API_BASE}/noticias/recientes?limite=${limite}`).then(
      (response) => response.json()
    );
  },
};

export const userAPI = {
  getFavoritos: () => {
    return fetchAPI("/user/favoritos");
  },

  agregarFavorito: (appId) => {
    if (!appId) {
      throw new Error("appId es requerido");
    }
    return fetchAPI("/user/favoritos", {
      method: "POST",
      body: JSON.stringify({ app_id: appId }),
    });
  },

  eliminarFavorito: (appId) => {
    if (!appId) {
      throw new Error("appId es requerido");
    }
    return fetchAPI(`/user/favoritos/${appId}`, {
      method: "DELETE",
    });
  },

  esFavorito: (appId) => {
    if (!appId) {
      throw new Error("appId es requerido");
    }
    return fetchAPI(`/user/favoritos/${appId}/check`);
  },
};

export const analyticsAPI = {
  getEstadisticas: () => {
    return fetchAPI("/analytics/estadisticas");
  },

  getJuegosPopulares: (limite = 10) => {
    return fetchAPI(`/analytics/juegos-populares?limite=${limite}`);
  },

  getTendenciasBusqueda: (limite = 10) => {
    return fetchAPI(`/analytics/tendencias-busqueda?limite=${limite}`);
  },
};

export { fetchAPI };
