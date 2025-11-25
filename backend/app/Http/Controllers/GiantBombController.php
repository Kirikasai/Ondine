<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GiantBombController extends Controller
{
    private function getApiKey()
    {
        return env('GIANTBOMB_API_KEY');
    }

    private function makeGiantBombRequest($endpoint, $params = [])
    {
        try {
            $apiKey = $this->getApiKey();

            if (!$apiKey) {
                Log::error('API Key de GiantBomb faltante');
                return null;
            }

            // Parámetros base
            $baseParams = [
                'api_key' => $apiKey,
                'format' => 'json',
            ];

            $allParams = array_merge($baseParams, $params);

            Log::info("Haciendo request a GiantBomb: {$endpoint}", ['params' => $allParams]);

            $response = Http::timeout(30)
                ->get("https://www.giantbomb.com/api/{$endpoint}/", $allParams);

            // Capturar respuesta para diagnóstico
            $status = $response->status();
            $body = $response->body();

            Log::info("Respuesta GiantBomb {$endpoint}", [
                'status' => $status,
                'body_length' => strlen($body),
                'params' => $allParams
            ]);

            if ($response->successful()) {
                $data = $response->json();
                Log::info("✅ Request exitoso - {$endpoint}", [
                    'results' => $data['number_of_total_results'] ?? 0,
                    'page_results' => $data['number_of_page_results'] ?? 0
                ]);
                return $data;
            }

            // Log detallado del error
            Log::error("❌ Error GiantBomb API", [
                'endpoint' => $endpoint,
                'status' => $status,
                'response' => $body,
                'params' => $allParams
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('💥 Excepción en makeGiantBombRequest: ' . $e->getMessage());
            return null;
        }
    }

    public function getJuegos(Request $request)
    {
        try {
            Log::info('🎮 SOLICITANDO JUEGOS DE GIANTBOMB');

            $pagina = max(1, (int)$request->get('pagina', 1));
            $limite = min(100, max(1, (int)$request->get('limite', 20)));
            $offset = ($pagina - 1) * $limite;

            $params = [
                'limit' => $limite,
                'offset' => $offset,
                'field_list' => 'id,name,image,original_release_date,expected_release_day,site_detail_url,deck,platforms,genres'
            ];

            // Filtro de búsqueda
            $busqueda = $request->get('busqueda');
            if ($busqueda && trim($busqueda) !== '') {
                $params['filter'] = 'name:' . trim($busqueda);
            }

            // Filtro de género
            $genero = $request->get('genero');
            if ($genero && $genero !== 'todos' && is_numeric($genero)) {
                // GiantBomb usa IDs de género diferentes
                $params['filter'] = isset($params['filter']) ? $params['filter'] . ',genres:' . $genero : 'genres:' . $genero;
            }

            // Filtro de plataforma
            $plataforma = $request->get('plataforma');
            if ($plataforma && $plataforma !== 'todas' && is_numeric($plataforma)) {
                $params['filter'] = isset($params['filter']) ? $params['filter'] . ',platforms:' . $plataforma : 'platforms:' . $plataforma;
            }

            // Orden por defecto
            $params['sort'] = 'original_release_date:desc';

            Log::info('📝 Params final', ['params' => $params]);

            $response = $this->makeGiantBombRequest('games', $params);

            if ($response === null) {
                Log::error('❌ GiantBomb no respondió');
                return response()->json([
                    'juegos' => [],
                    'data' => [],
                    'paginacion' => [
                        'pagina_actual' => $pagina,
                        'total_juegos' => 0,
                        'total_paginas' => 0
                    ],
                    'status' => 'error',
                    'mensaje' => 'Error de conexión con GiantBomb'
                ], 500);
            }

            // Procesar juegos
            $juegosProcesados = [];
            $results = $response['results'] ?? [];

            foreach ($results as $juego) {
                $juegosProcesados[] = [
                    'id' => $juego['id'] ?? null,
                    'name' => $juego['name'] ?? 'Nombre no disponible',
                    'background_image' => $juego['image']['medium_url'] ?? $juego['image']['small_url'] ?? null,
                    'cover' => [
                        'image_id' => basename($juego['image']['medium_url'] ?? '') ?? null
                    ],
                    'released' => $juego['original_release_date'] ?? null,
                    'rating' => null, // GiantBomb no tiene rating como IGDB
                    'rating_top' => 5,
                    'genres' => array_map(function($genre) {
                        return ['name' => $genre['name'] ?? ''];
                    }, $juego['genres'] ?? []),
                    'platforms' => array_map(function($platform) {
                        return ['name' => $platform['name'] ?? ''];
                    }, $juego['platforms'] ?? []),
                    'summary' => $juego['deck'] ?? 'Descripción no disponible',
                    'short_description' => $juego['deck'] ?? 'Descripción no disponible',
                    'slug' => $juego['site_detail_url'] ?? null,
                    'giantbomb_url' => $juego['site_detail_url'] ?? null
                ];
            }

            $totalJuegos = $response['number_of_total_results'] ?? 0;
            $juegosPorPagina = $response['number_of_page_results'] ?? $limite;

            Log::info("✅ Juegos procesados: " . count($juegosProcesados));

            return response()->json([
                'juegos' => $juegosProcesados,
                'data' => $juegosProcesados,
                'paginacion' => [
                    'pagina_actual' => $pagina,
                    'total_juegos' => $totalJuegos,
                    'total_paginas' => $juegosPorPagina > 0 ? ceil($totalJuegos / $juegosPorPagina) : 0
                ],
                'total' => $totalJuegos,
                'meta' => [
                    'current_page' => $pagina,
                    'last_page' => $juegosPorPagina > 0 ? ceil($totalJuegos / $juegosPorPagina) : 0,
                    'total' => $totalJuegos
                ],
                'status' => 'success',
                'fuente' => 'giantbomb',
                'mensaje' => count($juegosProcesados) . ' juegos cargados desde GiantBomb'
            ]);

        } catch (\Exception $e) {
            Log::error('💥 Error en getJuegos: ' . $e->getMessage());
            return response()->json([
                'juegos' => [],
                'data' => [],
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

    // Métodos de prueba para GiantBomb
    public function testUltraSimple()
    {
        try {
            $params = [
                'limit' => 1,
                'field_list' => 'name'
            ];

            Log::info('🧪 TEST ULTRA SIMPLE GIANTBOMB', ['params' => $params]);

            $result = $this->makeGiantBombRequest('games', $params);

            return response()->json([
                'test' => 'ultra_simple_giantbomb',
                'params' => $params,
                'resultados' => $result ? count($result['results'] ?? []) : 0,
                'data' => $result,
                'status' => $result ? 'success' : 'error'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'test' => 'ultra_simple_giantbomb',
                'error' => $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function testGeneros()
    {
        try {
            $params = [
                'limit' => 5,
                'field_list' => 'id,name'
            ];

            Log::info('🧪 TEST GÉNEROS GIANTBOMB', ['params' => $params]);

            $result = $this->makeGiantBombRequest('genres', $params);

            return response()->json([
                'test' => 'generos_giantbomb',
                'params' => $params,
                'resultados' => $result ? count($result['results'] ?? []) : 0,
                'data' => $result,
                'status' => $result ? 'success' : 'error'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'test' => 'generos_giantbomb',
                'error' => $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }

    public function verificarCredenciales()
    {
        $apiKey = $this->getApiKey();

        // Ejecutar tests
        $testUltraSimple = $this->testUltraSimple()->getData();
        $testGeneros = $this->testGeneros()->getData();

        return response()->json([
            'verificacion' => [
                'credenciales' => [
                    'GIANTBOMB_API_KEY' => $apiKey ? 'CONFIGURADO' : 'NO CONFIGURADO'
                ],
                'tests' => [
                    'ultra_simple' => $testUltraSimple,
                    'generos' => $testGeneros
                ],
                'recomendaciones' => [
                    '1. Obtener API Key de https://www.giantbomb.com/api/',
                    '2. Verificar los límites de la API (200-400 requests por día)',
                    '3. Revisar los logs para errores específicos'
                ]
            ]
        ]);
    }

    public function getGeneros()
    {
        try {
            $params = [
                'limit' => 50,
                'field_list' => 'id,name',
                'sort' => 'name:asc'
            ];

            $response = $this->makeGiantBombRequest('genres', $params);

            if (!$response) {
                return response()->json([
                    'generos' => [],
                    'data' => [],
                    'total' => 0,
                    'status' => 'error',
                    'mensaje' => 'No se pudieron cargar los géneros'
                ], 500);
            }

            $generos = $response['results'] ?? [];

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
                'data' => [],
                'total' => 0,
                'status' => 'error',
                'mensaje' => 'Error al cargar géneros'
            ], 500);
        }
    }

    public function getPlataformas()
    {
        try {
            $params = [
                'limit' => 50,
                'field_list' => 'id,name',
                'sort' => 'name:asc'
            ];

            $response = $this->makeGiantBombRequest('platforms', $params);

            if (!$response) {
                return response()->json([
                    'plataformas' => [],
                    'data' => [],
                    'total' => 0,
                    'status' => 'error',
                    'mensaje' => 'No se pudieron cargar las plataformas'
                ], 500);
            }

            $plataformas = $response['results'] ?? [];

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
                'data' => [],
                'total' => 0,
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
                    'data' => [],
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
                'data' => [],
                'total' => 0,
                'status' => 'error',
                'mensaje' => 'Error en la búsqueda'
            ], 500);
        }
    }
}
