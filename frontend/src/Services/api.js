const API_BASE = "http://localhost:8000/api";

const handleResponse = async (response) => {
  // Log status for debugging
  console.log("📡 Response status:", response.status);

  // 204 No Content
  if (response.status === 204) return {};

  if (!response.ok) {
    let errorMessage = `Error HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      // backend uses 'mensaje' or 'error'
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

  // try parse json, else return text
  try {
    return await response.json();
  } catch (e) {
    return await response.text();
  }
};

// Unified fetch helper with optional timeout and automatic JSON handling + auth header
async function fetchAPI(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
  console.log(`🔄 Haciendo request a: ${url}`);

  const controller = new AbortController();
  const timeout = options.timeout ?? 30000; // 30s default
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers = {
      Accept: "application/json",
      ...(options.headers || {}),
    };

    let body = options.body;

    // If body is a plain object and not FormData, stringify it and set header
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

    // remove body for GET/HEAD
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

/* ==========================
   Named API helpers
   ========================== */
export const authAPI = {
  // Métodos básicos
  get: async (endpoint) => {
    return fetchAPI(endpoint, {
      method: "GET",
    });
  },

  post: async (endpoint, data = {}) => {
    return fetchAPI(endpoint, {
      method: "POST",
      body: data,
    });
  },

  put: async (endpoint, data = {}) => {
    return fetchAPI(endpoint, {
      method: "PUT",
      body: data,
    });
  },

  delete: async (endpoint) => {
    return fetchAPI(endpoint, {
      method: "DELETE",
    });
  },

  // Métodos específicos de auth
  login: async (credentials) => {
    return fetchAPI("/auth/login", {
      method: "POST",
      body: credentials,
    });
  },

  register: async (userData) => {
    return fetchAPI("/auth/register", {
      method: "POST",
      body: userData,
    });
  },

  logout: async () => {
    return fetchAPI("/auth/logout", {
      method: "POST",
    });
  },

  getUser: async () => {
    return fetchAPI("/auth/user");
  },

  updateProfile: async (userData) => {
    return fetchAPI("/auth/profile", {
      method: "PUT",
      body: userData,
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
  likeBlog: async (blogId) => {
    return fetchAPI(`/blogs/${blogId}/like`, {
      method: 'POST'
    });
  },

  unlikeBlog: async (blogId) => {
    return fetchAPI(`/blogs/${blogId}/like`, {
      method: 'DELETE'
    });
  },

  checkBlogLike: async (blogId) => {
    return fetchAPI(`/blogs/${blogId}/like/status`);
  },

  // Comentarios para blogs
  getBlogComments: async (blogId) => {
    return fetchAPI(`/blogs/${blogId}/comentarios`);
  },

  addBlogComment: async (blogId, comment) => {
    return fetchAPI(`/blogs/${blogId}/comentarios`, {
      method: 'POST',
      body: comment
    });
  }
};

export const giantbombAPI = {
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
    console.log("🔗 Solicitando:", `${API_BASE}/juegos${queryStr}`);
    return fetchAPI(`/juegos${queryStr}`);
  },

  buscarJuegos: async (termino) => {
    if (!termino || termino.trim() === "") return { juegos: [], total: 0 };
    console.log("🔍 Buscando juegos:", termino);
    return fetchAPI(`/juegos/buscar?q=${encodeURIComponent(termino)}`);
  },

  getGeneros: async () => {
    console.log("📋 Solicitando géneros...");
    return fetchAPI("/generos");
  },

  getPlataformas: async () => {
    console.log("🖥️ Solicitando plataformas...");
    return fetchAPI("/plataformas");
  },
};

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
