<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class RawgController extends Controller
{
    private $apiKey;
    private $baseUrl = 'https://api.rawg.io/api';

    public function __construct()
    {
        $this->apiKey = env('RAWG_API_KEY');
    }

    private function makeRequest($endpoint, $params = [])
    {
        try {
            if (!$this->apiKey) {
                Log::error('🔴 RAWG API Key no configurada');
                return null;
            }

            $baseParams = ['key' => $this->apiKey];
            $allParams = array_merge($baseParams, $params);

            Log::info("📡 Request a RAWG: {$endpoint}", [
                'params' => array_merge($allParams, ['key' => '***'])
            ]);

            $response = Http::timeout(30)
                ->retry(2, 100)
                ->get("{$this->baseUrl}/{$endpoint}", $allParams);

            if ($response->successful()) {
                $data = $response->json();
                Log::info(" RAWG exitoso - {$endpoint}", [
                    'total_results' => $data['count'] ?? 0
                ]);
                return $data;
            }

            Log::error("❌ Error RAWG API", [
                'endpoint' => $endpoint,
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('💥 Exception en RAWG: ' . $e->getMessage());
            return null;
        }
    }

    public function getJuegos(Request $request)
    {
        try {
            Log::info('🎮 SOLICITANDO JUEGOS DE RAWG');

            $pagina = max(1, (int)$request->get('pagina', 1));
            $limite = min(40, max(1, (int)$request->get('limite', 20)));

            $params = [
                'page_size' => $limite,
                'page' => $pagina,
                'ordering' => '-rating',
                'exclude_tags' => '17848', // Solo el tag "NSFW" específico de RAWG
            ];

            $busqueda = $request->get('busqueda');
            if ($busqueda && trim($busqueda) !== '') {
                $params['search'] = trim($busqueda);
            }

            $genero = $request->get('genero');
            if ($genero && $genero !== 'todos') {
                $params['genres'] = $genero;
            }

            $plataforma = $request->get('plataforma');
            if ($plataforma && $plataforma !== 'todas') {
                $params['parent_platforms'] = $plataforma;
            }

            $response = $this->makeRequest('games', $params);

            if (!$response) {
                return response()->json([
                    'juegos' => [],
                    'data' => [],
                    'paginacion' => [
                        'pagina_actual' => $pagina,
                        'total_juegos' => 0,
                        'total_paginas' => 0
                    ],
                    'status' => 'error',
                    'mensaje' => 'Error de conexión con RAWG'
                ], 500);
            }

            //  Obtener el total ANTES del filtrado
            $totalJuegosRawg = $response['count'] ?? 0;

            //  LISTA NEGRA MUY ESPECÍFICA (solo juegos explícitos conocidos)
            $juegosProhibidos = [
                'tentacle van',
                'tentacle-van',
            ];

            //  TAGS ADULTOS MUY ESPECÍFICOS (solo contenido sexual explícito)
            $tagsAdultosMuyExplicitos = [
                'sexual content',
                'nsfw',
                'erotic',
                'hentai',
            ];

            $juegosProcesados = [];
            $results = $response['results'] ?? [];

            foreach ($results as $juego) {
                $nombreJuego = strtolower($juego['name'] ?? '');
                $slugJuego = strtolower($juego['slug'] ?? '');

                //  FILTRO 1: Verificar lista negra específica
                $estaProhibido = false;
                foreach ($juegosProhibidos as $prohibido) {
                    $prohibidoLower = strtolower($prohibido);
                    if ($nombreJuego === $prohibidoLower || $slugJuego === $prohibidoLower) {
                        $estaProhibido = true;
                        Log::info("🚫 Bloqueado por lista negra: " . $juego['name']);
                        break;
                    }
                }

                if ($estaProhibido) {
                    continue;
                }

                //  FILTRO 2: Verificar tags adultos 
                $tags = array_map(fn($t) => strtolower($t['name'] ?? ''), $juego['tags'] ?? []);
                $tieneContenidoAdultoExplicito = false;

                foreach ($tagsAdultosMuyExplicitos as $tagAdulto) {
                    if (in_array(strtolower($tagAdulto), $tags)) {
                        $tieneContenidoAdultoExplicito = true;
                        Log::info("🔞 Filtrado por tag adulto explícito: " . $juego['name']);
                        break;
                    }
                }

                if ($tieneContenidoAdultoExplicito) {
                    continue;
                }

                //  FILTRO 3: Solo rating "Adults Only" (AO)
                $rating = strtolower($juego['esrb_rating']['name'] ?? '');
                if ($rating === 'adults only' || $rating === 'ao') {
                    Log::info("🔞 Filtrado por rating AO: " . $juego['name']);
                    continue;
                }

                // Obtener imagen principal
                $imagenPrincipal = $juego['background_image']
                    ?? ($juego['short_screenshots'][0]['image'] ?? null)
                    ?? $juego['background_image_additional']
                    ?? null;

                // Generar descripción desde tags/géneros
                $tagsLimpios = array_slice(array_map(fn($t) => $t['name'] ?? '', $juego['tags'] ?? []), 0, 3);
                $genres = array_slice(array_map(fn($g) => $g['name'] ?? '', $juego['genres'] ?? []), 0, 3);

                $descripcion = '';
                if (!empty($genres)) {
                    $descripcion = implode(', ', $genres);
                }
                if (!empty($tagsLimpios)) {
                    $descripcion .= ($descripcion ? ' • ' : '') . implode(', ', $tagsLimpios);
                }
                if (!$descripcion) {
                    $descripcion = 'Explora este juego en RAWG para más detalles.';
                }

                $juegosProcesados[] = [
                    'id' => $juego['id'] ?? null,
                    'name' => $juego['name'] ?? 'Nombre no disponible',
                    'slug' => $juego['slug'] ?? null,
                    'rawg_url' => isset($juego['slug']) ? "https://rawg.io/games/{$juego['slug']}" : null,

                    // Imágenes
                    'background_image' => $imagenPrincipal,
                    'background_image_additional' => $juego['background_image_additional'] ?? null,
                    'short_screenshots' => $juego['short_screenshots'] ?? [],
                    'cover' => [
                        'image_id' => $imagenPrincipal ? basename($imagenPrincipal) : null,
                        'url' => $imagenPrincipal
                    ],

                    // Fechas
                    'released' => $juego['released'] ?? null,
                    'tba' => $juego['tba'] ?? false,

                    // Rating
                    'rating' => floatval($juego['rating'] ?? 0),
                    'rating_top' => 5,
                    'ratings_count' => intval($juego['ratings_count'] ?? 0),
                    'reviews_count' => intval($juego['reviews_count'] ?? 0),
                    'reviews_text_count' => intval($juego['reviews_text_count'] ?? 0),
                    'metacritic' => $juego['metacritic'] ?? null,
                    'added' => intval($juego['added'] ?? 0),

                    // Categorías
                    'genres' => array_map(fn($g) => [
                        'id' => $g['id'] ?? null,
                        'name' => $g['name'] ?? ''
                    ], $juego['genres'] ?? []),

                    'platforms' => array_map(fn($p) => [
                        'id' => $p['platform']['id'] ?? null,
                        'name' => $p['platform']['name'] ?? ''
                    ], $juego['platforms'] ?? []),

                    'tags' => array_map(fn($t) => [
                        'id' => $t['id'] ?? null,
                        'name' => $t['name'] ?? ''
                    ], array_slice($juego['tags'] ?? [], 0, 5)),

                    'stores' => array_map(fn($s) => [
                        'id' => $s['store']['id'] ?? null,
                        'name' => $s['store']['name'] ?? ''
                    ], $juego['stores'] ?? []),

                    // Descripción
                    'summary' => $descripcion,
                    'short_description' => strlen($descripcion) > 150
                        ? substr($descripcion, 0, 150) . '...'
                        : $descripcion,

                    // Extras
                    'playtime' => intval($juego['playtime'] ?? 0),
                    'suggestions_count' => intval($juego['suggestions_count'] ?? 0),
                    'esrb_rating' => $juego['esrb_rating']['name'] ?? null,
                ];
            }

            //  Usar el total de RAWG, no el filtrado
            $totalPaginas = $limite > 0 ? ceil($totalJuegosRawg / $limite) : 0;

            Log::info(" Juegos en esta página: " . count($juegosProcesados) . " | Total RAWG: " . $totalJuegosRawg);

            return response()->json([
                'juegos' => $juegosProcesados,
                'data' => $juegosProcesados,
                'paginacion' => [
                    'pagina_actual' => $pagina,
                    'total_juegos' => $totalJuegosRawg, //  Total de RAWG
                    'total_paginas' => $totalPaginas
                ],
                'status' => 'success',
                'fuente' => 'rawg'
            ]);

        } catch (\Exception $e) {
            Log::error('💥 Error en getJuegos: ' . $e->getMessage());
            return response()->json([
                'juegos' => [],
                'data' => [],
                'paginacion' => ['pagina_actual' => 1, 'total_juegos' => 0, 'total_paginas' => 0],
                'status' => 'error',
                'mensaje' => $e->getMessage()
            ], 500);
        }
    }

    public function getGeneros()
    {
        try {
            $cacheKey = 'rawg_generos';
            $data = Cache::remember($cacheKey, 86400, function () {
                return $this->makeRequest('genres', ['page_size' => 50]);
            });

            if (!$data) {
                return response()->json([
                    'generos' => [],
                    'data' => [],
                    'status' => 'error'
                ], 500);
            }

            $generos = $data['results'] ?? [];
            return response()->json([
                'generos' => $generos,
                'data' => $generos,
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            Log::error('Error en getGeneros: ' . $e->getMessage());
            return response()->json(['generos' => [], 'data' => [], 'status' => 'error'], 500);
        }
    }

    public function getPlataformas()
    {
        try {
            $cacheKey = 'rawg_plataformas';
            $data = Cache::remember($cacheKey, 86400, function () {
                return $this->makeRequest('platforms/lists/parents', ['page_size' => 50]);
            });

            if (!$data) {
                return response()->json([
                    'plataformas' => [],
                    'data' => [],
                    'status' => 'error'
                ], 500);
            }

            $plataformas = $data['results'] ?? [];
            return response()->json([
                'plataformas' => $plataformas,
                'data' => $plataformas,
                'status' => 'success'
            ]);
        } catch (\Exception $e) {
            Log::error('Error en getPlataformas: ' . $e->getMessage());
            return response()->json(['plataformas' => [], 'data' => [], 'status' => 'error'], 500);
        }
    }

    public function buscarJuegos(Request $request)
    {
        try {
            $busqueda = $request->get('q');
            if (!$busqueda || trim($busqueda) === '') {
                return response()->json([
                    'juegos' => [],
                    'data' => [],
                    'total' => 0,
                    'status' => 'success'
                ]);
            }

            $newRequest = new Request(['busqueda' => $busqueda, 'limite' => 20, 'pagina' => 1]);
            return $this->getJuegos($newRequest);
        } catch (\Exception $e) {
            Log::error('Error en buscarJuegos: ' . $e->getMessage());
            return response()->json(['juegos' => [], 'data' => [], 'status' => 'error'], 500);
        }
    }

    public function verificarCredenciales()
    {
        try {
            $test = Http::timeout(10)->get("{$this->baseUrl}/games", [
                'key' => $this->apiKey,
                'page_size' => 1
            ]);

            return response()->json([
                'verificacion' => [
                    'api_key_configurada' => !!$this->apiKey,
                    'test_conexion' => $test->successful() ? 'OK' : 'ERROR',
                    'status_code' => $test->status(),
                    'mensaje' => $test->successful()
                        ? ' RAWG API funcionando correctamente'
                        : "❌ Error: " . $test->status()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'verificacion' => [
                    'api_key_configurada' => !!$this->apiKey,
                    'test_conexion' => 'ERROR',
                    'error' => $e->getMessage()
                ]
            ], 500);
        }
    }
}
