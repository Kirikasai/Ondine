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
                Log::error('RAWG API Key faltante');
                return null;
            }

            $baseParams = ['key' => $this->apiKey];
            $allParams = array_merge($baseParams, $params);

            Log::info("📡 Request a RAWG: {$endpoint}", ['params' => $allParams]);

            $response = Http::timeout(30)
                ->get("{$this->baseUrl}/{$endpoint}", $allParams);

            if ($response->successful()) {
                $data = $response->json();
                Log::info("✅ RAWG exitoso - {$endpoint}", [
                    'total_results' => $data['count'] ?? 0
                ]);
                return $data;
            }

            Log::error("❌ Error RAWG API", [
                'endpoint' => $endpoint,
                'status' => $response->status(),
                'response' => $response->body()
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
            $limite = min(40, max(1, (int)$request->get('limite', 20))); // RAWG maxea en 40
            $offset = ($pagina - 1) * $limite;

            $params = [
                'page_size' => $limite,
                'page' => $pagina,
                'ordering' => '-released' // Más recientes primero
            ];

            // Búsqueda
            $busqueda = $request->get('busqueda');
            if ($busqueda && trim($busqueda) !== '') {
                $params['search'] = trim($busqueda);
                $params['search_exact'] = false; // Búsqueda parcial
            }

            // Género
            $genero = $request->get('genero');
            if ($genero && $genero !== 'todos') {
                $params['genres'] = $genero;
            }

            // Plataforma
            $plataforma = $request->get('plataforma');
            if ($plataforma && $plataforma !== 'todas') {
                $params['parent_platforms'] = $plataforma;
            }

            $response = $this->makeRequest('games', $params);

            if (!$response) {
                return response()->json([
                    'juegos' => [],
                    'paginacion' => [
                        'pagina_actual' => $pagina,
                        'total_juegos' => 0,
                        'total_paginas' => 0
                    ],
                    'status' => 'error',
                    'mensaje' => 'Error de conexión con RAWG'
                ], 500);
            }

            // Procesar juegos
            $juegosProcesados = [];
            $results = $response['results'] ?? [];

            foreach ($results as $juego) {
                $juegosProcesados[] = [
                    'id' => $juego['id'] ?? null,
                    'name' => $juego['name'] ?? 'Nombre no disponible',
                    'background_image' => $juego['background_image'] ?? null,
                    'cover' => [
                        'image_id' => basename($juego['background_image'] ?? '') ?? null
                    ],
                    'released' => $juego['released'] ?? null,
                    'rating' => round($juego['rating'] ?? 0, 1),
                    'rating_top' => 5,
                    'genres' => array_map(function($genre) {
                        return ['name' => $genre['name'] ?? ''];
                    }, $juego['genres'] ?? []),
                    'platforms' => array_map(function($platform) {
                        return ['name' => $platform['platform']['name'] ?? ''];
                    }, $juego['platforms'] ?? []),
                    'summary' => $juego['description'] ?? 'Descripción no disponible',
                    'short_description' => substr($juego['description'] ?? '', 0, 200),
                    'slug' => $juego['slug'] ?? null,
                    'rawg_url' => "https://rawg.io/games/" . ($juego['slug'] ?? '')
                ];
            }

            $totalJuegos = $response['count'] ?? 0;
            $totalPaginas = ceil($totalJuegos / $limite);

            Log::info("✅ Juegos procesados: " . count($juegosProcesados));

            return response()->json([
                'juegos' => $juegosProcesados,
                'data' => $juegosProcesados,
                'paginacion' => [
                    'pagina_actual' => $pagina,
                    'total_juegos' => $totalJuegos,
                    'total_paginas' => $totalPaginas
                ],
                'total' => $totalJuegos,
                'meta' => [
                    'current_page' => $pagina,
                    'last_page' => $totalPaginas,
                    'total' => $totalJuegos
                ],
                'status' => 'success',
                'fuente' => 'rawg',
                'mensaje' => count($juegosProcesados) . ' juegos cargados desde RAWG'
            ]);

        } catch (\Exception $e) {
            Log::error('💥 Error en getJuegos: ' . $e->getMessage());
            return response()->json([
                'juegos' => [],
                'paginacion' => [
                    'pagina_actual' => 1,
                    'total_juegos' => 0,
                    'total_paginas' => 0
                ],
                'status' => 'error',
                'mensaje' => 'Error interno del servidor'
            ], 500);
        }
    }

    public function getGeneros()
    {
        try {
            $cacheKey = 'rawg_generos';

            // Cachear por 24 horas
            $data = Cache::remember($cacheKey, 86400, function () {
                return $this->makeRequest('genres', ['page_size' => 50]);
            });

            if (!$data) {
                return response()->json([
                    'generos' => [],
                    'status' => 'error',
                    'mensaje' => 'No se pudieron cargar los géneros'
                ], 500);
            }

            $generos = $data['results'] ?? [];

            return response()->json([
                'generos' => $generos,
                'data' => $generos,
                'total' => count($generos),
                'status' => 'success'
            ]);

        } catch (\Exception $e) {
            Log::error('Error en getGeneros: ' . $e->getMessage());
            return response()->json([
                'generos' => [],
                'status' => 'error',
                'mensaje' => 'Error al cargar géneros'
            ], 500);
        }
    }

    public function getPlataformas()
    {
        try {
            $cacheKey = 'rawg_plataformas';

            $data = Cache::remember($cacheKey, 86400, function () {
                return $this->makeRequest('parent_platforms', ['page_size' => 50]);
            });

            if (!$data) {
                return response()->json([
                    'plataformas' => [],
                    'status' => 'error',
                    'mensaje' => 'No se pudieron cargar las plataformas'
                ], 500);
            }

            $plataformas = $data['results'] ?? [];

            return response()->json([
                'plataformas' => $plataformas,
                'data' => $plataformas,
                'total' => count($plataformas),
                'status' => 'success'
            ]);

        } catch (\Exception $e) {
            Log::error('Error en getPlataformas: ' . $e->getMessage());
            return response()->json([
                'plataformas' => [],
                'status' => 'error',
                'mensaje' => 'Error al cargar plataformas'
            ], 500);
        }
    }

    public function buscarJuegos(Request $request)
    {
        try {
            $busqueda = $request->get('q');
            if (!$busqueda || trim($busqueda) === '') {
                return response()->json([
                    'juegos' => [],
                    'total' => 0,
                    'status' => 'success',
                    'mensaje' => 'Término de búsqueda vacío'
                ]);
            }

            return $this->getJuegos(new Request([
                'busqueda' => $busqueda,
                'limite' => 20,
                'pagina' => 1
            ]));

        } catch (\Exception $e) {
            Log::error('Error en buscarJuegos: ' . $e->getMessage());
            return response()->json([
                'juegos' => [],
                'total' => 0,
                'status' => 'error',
                'mensaje' => 'Error en la búsqueda'
            ], 500);
        }
    }

    public function verificarCredenciales()
    {
        try {
            $params = ['key' => $this->apiKey, 'page_size' => 1];
            $test = Http::timeout(10)->get("{$this->baseUrl}/games", $params);

            $status = $test->successful() ? 'OK' : 'ERROR';
            $statusCode = $test->status();

            return response()->json([
                'verificacion' => [
                    'api_key_configurada' => !!$this->apiKey,
                    'test_conexion' => $status,
                    'status_code' => $statusCode,
                    'mensaje' => $status === 'OK'
                        ? '✅ RAWG API funcionando correctamente'
                        : "❌ Error conectando a RAWG (Status: {$statusCode})"
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
