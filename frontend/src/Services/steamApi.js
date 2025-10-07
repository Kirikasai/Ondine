const STEAM_API_BASE = "https://api.steampowered.com";

// Función para obtener la lista completa de juegos
export async function getAppList() {
  try {
    console.log("📡 Fetching app list...");
    const response = await fetch(`${STEAM_API_BASE}/ISteamApps/GetAppList/v2/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("✅ App list fetched successfully");
    return data.applist.apps;
  } catch (error) {
    console.error("❌ Error fetching app list:", error);
    return [];
  }
}

// Función para obtener detalles de un juego específico
export async function getGameDetails(appId) {
  try {
    console.log(`📡 Fetching details for app ${appId}...`);
    
    // Usar un proxy para evitar problemas de CORS
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=spanish`;
    
    const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Response for app ${appId}:`, data);
    
    // Verificar si la respuesta es válida
    if (!data || !data[appId]) {
      console.warn(`❌ Invalid response for app ${appId}`);
      return null;
    }
    
    if (data[appId].success) {
      const gameData = {
        steam_appid: appId,
        name: data[appId].data.name || `Juego ${appId}`,
        short_description: data[appId].data.short_description || "Descripción no disponible",
        header_image: data[appId].data.header_image || "/placeholder-game.jpg",
        ...data[appId].data
      };
      console.log(`🎮 Game data for ${appId}:`, gameData.name);
      return gameData;
    } else {
      console.warn(`❌ No success for app ${appId}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error fetching details for app ${appId}:`, error);
    return null;
  }
}