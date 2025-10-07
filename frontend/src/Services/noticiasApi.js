useEffect(() => {
  async function fetchNoticias() {
    try {
      setLoading(true);
      const API_KEY = 'cb2b83f8d1534895b7b214721e1f3cc1';
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=videojuegos&language=es&sortBy=publishedAt&pageSize=12&apiKey=${API_KEY}`
      );
      
      if (!response.ok) throw new Error('Error en la API');
      
      const data = await response.json();
      setNoticias(data.articles);
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudieron cargar las noticias');
    } finally {
      setLoading(false);
    }
  }
  
  fetchNoticias();
}, [categoria]);