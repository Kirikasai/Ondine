<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class IgdbController extends Controller
{
    private function getClientId()
    {
        return env('IGDB_CLIENT_ID');
    }

    private function getClientSecret()
    {
        return env('IGDB_CLIENT_SECRET');
    }

    private function getAccessToken()
    {
        $cacheKey = 'igdb_access_token';

        // Forzar renovación del token si hay problemas
        if (request()->has('reset_token')) {
            Cache::forget($cacheKey);
        }

        return Cache::remember($cacheKey, 86400, function () {
            try {
                Log::info('🔑 Solicitando nuevo token de IGDB');

                $response = Http::asForm()->post('https://id.twitch.tv/oauth2/token', [
                    'client_id' => $this->getClientId(),
                    'client_secret' => $this->getClientSecret(),
                    'grant_type' => 'client_credentials'
                ]);

                Log::info('🔐 Respuesta de autenticación IGDB', [
                    'status' => $response->status(),
                    'successful' => $response->successful()
                ]);

                if ($response->successful()) {
                    $tokenData = $response->json();
                    Log::info('✅ Token obtenido exitosamente');
                    return $tokenData['access_token'];
                } else {
                    Log::error('❌ Error en autenticación IGDB', [
                        'status' => $response->status(),
                        'body' => $response->body()
                    ]);
                    return null;
                }

            } catch (\Exception $e) {
                Log::error('💥 Excepción en getAccessToken', [
                    'error' => $e->getMessage()
                ]);
                return null;
            }
        });
    }

    private function makeIgdbRequest($endpoint, $query)
    {
        try {
            $token = $this->getAccessToken();
            $clientId = $this->getClientId();

            Log::info('🎯 Haciendo request a IGDB', [
                'endpoint' => $endpoint,
                'token_present' => !empty($token),
                'client_id_present' => !empty($clientId)
            ]);

            if (!$token || !$clientId) {
                Log::error('❌ Faltan credenciales para IGDB');
                return null;
            }

            // Cache más corto para debugging
            $cacheKey = 'igdb_' . md5($endpoint . $query . $token);

            return Cache::remember($cacheKey, 300, function () use ($endpoint, $query, $token, $clientId) {
                Log::info('📤 Enviando query a IGDB', ['query' => $query]);

                $response = Http::timeout(30)
                    ->retry(3, 1000)
                    ->withHeaders([
                        'Client-ID' => $clientId,
                        'Authorization' => "Bearer {$token}",
                        'Accept' => 'application/json',
                    ])->withBody($query, 'text/plain')
                    ->post("https://api.igdb.com/v4/{$endpoint}");

                Log::info('📥 Respuesta de IGDB', [
                    'status' => $response->status(),
                    'successful' => $response->successful(),
                    'body_size' => strlen($response->body())
                ]);

                if ($response->successful()) {
                    $data = $response->json();
                    Log::info('✅ Request exitoso', ['results_count' => count($data)]);
                    return $data;
                } else {
                    Log::error('❌ Error en request IGDB', [
                        'status' => $response->status(),
                        'body' => $response->body(),
                        'headers' => $response->headers()
                    ]);
                    return null;
                }
            });

        } catch (\Exception $e) {
            Log::error('💥 Excepción en makeIgdbRequest', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null;
        }
    }

    public function getJuegos(Request $request)
    {
        try {
            Log::info('🎮 INICIO: getJuegos', $request->all());

            // Parámetros con valores por defecto más flexibles
            $pagina = max(1, (int)$request->get('pagina', 1));
            $limite = min(50, max(1, (int)$request->get('limite', 20)));
            $busqueda = $request->get('busqueda');
            $genero = $request->get('genero');
            $plataforma = $request->get('plataforma');

            Log::info('📊 Parámetros procesados:', [
                'pagina' => $pagina,
                'limite' => $limite,
                'busqueda' => $busqueda,
                'genero' => $genero,
                'plataforma' => $plataforma
            ]);

            $offset = ($pagina - 1) * $limite;

            // QUERY MÁS FLEXIBLE - Sin filtros estrictos inicialmente
            $whereConditions = ["category = 0"]; // Solo juegos principales

            if ($busqueda) {
                $whereConditions[] = "name ~ *\"{$busqueda}\"*";
            } else {
                // Ordenar por popularidad si no hay búsqueda
                $whereConditions[] = "rating != null";
            }

            // Filtros opcionales - solo si tienen valor válido
            if ($genero && $genero !== 'todos' && is_numeric($genero)) {
                $whereConditions[] = "genres = {$genero}";
            }

            if ($plataforma && $plataforma !== 'todas' && is_numeric($plataforma)) {
                $whereConditions[] = "platforms = {$plataforma}";
            }

            $whereClause = implode(' & ', $whereConditions);

            // Query optimizada con campos esenciales
            $query = "
                fields name, cover.image_id, rating, first_release_date, genres.name, platforms.name, slug, summary;
                where {$whereClause};
                sort rating desc;
                limit {$limite};
                offset {$offset};
            ";

            Log::info('📝 Query IGDB:', ['query' => $query]);

            $juegos = $this->makeIgdbRequest('games', $query);

            Log::info('🔍 Respuesta IGDB raw:', [
                'juegos_recibidos' => $juegos ? count($juegos) : 0,
                'juegos' => $juegos ? array_slice($juegos, 0, 2) : null
            ]);

            // Si no hay juegos de IGDB, usar datos de prueba
            if (!$juegos || empty($juegos)) {
                Log::warning('❌ No se pudieron obtener juegos de IGDB, usando datos de prueba');
                return $this->getJuegosDePrueba($request);
            }

            $juegosProcesados = $this->procesarJuegosIgdb($juegos);

            Log::info('✅ Juegos procesados exitosamente:', [
                'total_procesados' => count($juegosProcesados)
            ]);

            return response()->json([
                'juegos' => $juegosProcesados,
                'paginacion' => [
                    'pagina_actual' => $pagina,
                    'limite' => $limite,
                    'total_juegos' => 1000, // Valor por defecto
                    'total_paginas' => ceil(1000 / $limite),
                    'siguiente_pagina' => $pagina < ceil(1000 / $limite) ? $pagina + 1 : null,
                    'pagina_anterior' => $pagina > 1 ? $pagina - 1 : null
                ],
                'status' => 'success',
                'fuente' => 'igdb',
                'mensaje' => '🎮 ' . count($juegosProcesados) . ' juegos cargados desde IGDB'
            ]);

        } catch (\Exception $e) {
            Log::error('💥 Error crítico en getJuegos', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // En caso de error, devolver datos de prueba
            return $this->getJuegosDePrueba($request);
        }
    }

    /**
     * Datos de prueba para cuando IGDB no funciona
     */
    private function getJuegosDePrueba(Request $request)
    {
        $juegosPrueba = [
            [
                'id' => 1942,
                'name' => 'The Witcher 3: Wild Hunt',
                'background_image' => 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
                'released' => '2015-05-19',
                'rating' => 4.9,
                'rating_top' => 5,
                'genres' => [
                    ['id' => 12, 'name' => 'Role-playing (RPG)'],
                    ['id' => 31, 'name' => 'Adventure']
                ],
                'platforms' => [
                    ['id' => 6, 'name' => 'PC'],
                    ['id' => 48, 'name' => 'PlayStation 4'],
                    ['id' => 49, 'name' => 'Xbox One']
                ],
                'short_description' => 'The Witcher 3: Wild Hunt es un juego de rol de mundo abierto...'
            ],
            [
                'id' => 1877,
                'name' => 'Cyberpunk 2077',
                'background_image' => 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2irw.jpg',
                'released' => '2020-12-10',
                'rating' => 4.2,
                'rating_top' => 5,
                'genres' => [
                    ['id' => 12, 'name' => 'Role-playing (RPG)'],
                    ['id' => 5, 'name' => 'Shooter']
                ],
                'platforms' => [
                    ['id' => 6, 'name' => 'PC'],
                    ['id' => 48, 'name' => 'PlayStation 4'],
                    ['id' => 49, 'name' => 'Xbox One']
                ],
                'short_description' => 'Cyberpunk 2077 es un RPG de acción y aventura en mundo abierto...'
            ],
            [
                'id' => 115,
                'name' => 'The Elder Scrolls V: Skyrim',
                'background_image' => 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.jpg',
                'released' => '2011-11-11',
                'rating' => 4.5,
                'rating_top' => 5,
                'genres' => [
                    ['id' => 12, 'name' => 'Role-playing (RPG)'],
                    ['id' => 31, 'name' => 'Adventure']
                ],
                'platforms' => [
                    ['id' => 6, 'name' => 'PC'],
                    ['id' => 9, 'name' => 'PlayStation 3'],
                    ['id' => 12, 'name' => 'Xbox 360']
                ],
                'short_description' => 'El Imperio de Tamriel está al borde del colapso...'
            ],
            [
                'id' => 280,
                'name' => 'Grand Theft Auto V',
                'background_image' => 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1t8d.jpg',
                'released' => '2013-09-17',
                'rating' => 4.8,
                'rating_top' => 5,
                'genres' => [
                    ['id' => 8, 'name' => 'Platform'],
                    ['id' => 31, 'name' => 'Adventure']
                ],
                'platforms' => [
                    ['id' => 6, 'name' => 'PC'],
                    ['id' => 48, 'name' => 'PlayStation 4'],
                    ['id' => 49, 'name' => 'Xbox One']
                ],
                'short_description' => 'Grand Theft Auto V es un videojuego de acción-aventura...'
            ]
        ];

        $pagina = max(1, (int)$request->get('pagina', 1));
        $limite = min(50, max(1, (int)$request->get('limite', 20)));
        $offset = ($pagina - 1) * $limite;

        // Paginar los juegos de prueba
        $juegosPaginados = array_slice($juegosPrueba, $offset, $limite);

        return response()->json([
            'juegos' => $juegosPaginados,
            'paginacion' => [
                'pagina_actual' => $pagina,
                'limite' => $limite,
                'total_juegos' => count($juegosPrueba),
                'total_paginas' => ceil(count($juegosPrueba) / $limite),
                'siguiente_pagina' => $pagina < ceil(count($juegosPrueba) / $limite) ? $pagina + 1 : null,
                'pagina_anterior' => $pagina > 1 ? $pagina - 1 : null
            ],
            'status' => 'success',
            'fuente' => 'prueba',
            'mensaje' => '🎮 ' . count($juegosPaginados) . ' juegos de prueba cargados'
        ]);
    }

    public function getDetallesJuego($id)
    {
        try {
            Log::info('🔍 Obteniendo detalles del juego:', ['id' => $id]);

            $query = "
                fields name, summary, cover.image_id, rating, first_release_date, genres.name, platforms.name, slug;
                where id = {$id};
            ";

            $juego = $this->makeIgdbRequest('games', $query);

            if (!$juego || empty($juego)) {
                Log::warning('❌ Juego no encontrado en IGDB:', ['id' => $id]);
                return response()->json(['error' => 'Juego no encontrado'], 404);
            }

            return response()->json([
                'data' => $this->procesarJuegoDetallesIgdb($juego[0]),
                'status' => 'success',
                'fuente' => 'igdb'
            ]);

        } catch (\Exception $e) {
            Log::error('💥 Error en getDetallesJuego', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return response()->json(['error' => 'Error al obtener detalles'], 500);
        }
    }

    public function getGeneros()
    {
        try {
            Log::info('📋 Solicitando géneros de IGDB');

            $query = "fields id, name; sort name asc; limit 50;";
            $generos = $this->makeIgdbRequest('genres', $query);

            if (!$generos) {
                Log::warning('❌ No se pudieron cargar géneros de IGDB, usando datos de prueba');
                return $this->getGenerosDePrueba();
            }

            Log::info('✅ Géneros cargados:', ['total' => count($generos)]);

            return response()->json([
                'generos' => $generos,
                'total' => count($generos)
            ]);

        } catch (\Exception $e) {
            Log::error('💥 Error en getGeneros', ['error' => $e->getMessage()]);
            return $this->getGenerosDePrueba();
        }
    }

    public function getPlataformas()
    {
        try {
            Log::info('🖥️ Solicitando plataformas de IGDB');

            $query = "fields id, name; sort name asc; limit 50;";
            $plataformas = $this->makeIgdbRequest('platforms', $query);

            if (!$plataformas) {
                Log::warning('❌ No se pudieron cargar plataformas de IGDB, usando datos de prueba');
                return $this->getPlataformasDePrueba();
            }

            Log::info('✅ Plataformas cargadas:', ['total' => count($plataformas)]);

            return response()->json([
                'plataformas' => $plataformas,
                'total' => count($plataformas)
            ]);

        } catch (\Exception $e) {
            Log::error('💥 Error en getPlataformas', ['error' => $e->getMessage()]);
            return $this->getPlataformasDePrueba();
        }
    }

    public function buscarJuegos(Request $request)
    {
        $busqueda = $request->get('q');
        if (!$busqueda) {
            return response()->json(['error' => 'Término de búsqueda requerido'], 400);
        }

        Log::info('🔍 Búsqueda de juegos:', ['termino' => $busqueda]);

        return $this->getJuegos(new Request([
            'busqueda' => $busqueda,
            'limite' => 20
        ]));
    }

    public function getJuegosPopulares()
    {
        Log::info('🔥 Solicitando juegos populares');
        return $this->getJuegos(new Request([
            'limite' => 12
        ]));
    }

    private function procesarJuegosIgdb($juegos)
    {
        return array_map(function($juego) {
            return [
                'id' => $juego['id'] ?? null,
                'name' => $juego['name'] ?? 'Nombre no disponible',
                'background_image' => isset($juego['cover']['image_id'])
                    ? 'https://images.igdb.com/igdb/image/upload/t_cover_big/' . $juego['cover']['image_id'] . '.jpg'
                    : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop',
                'released' => isset($juego['first_release_date'])
                    ? date('Y-m-d', $juego['first_release_date'])
                    : null,
                'rating' => $juego['rating'] ? round($juego['rating'] / 20, 2) : 0,
                'rating_top' => 5,
                'genres' => array_map(function($genre) {
                    return ['id' => $genre['id'], 'name' => $genre['name']];
                }, $juego['genres'] ?? []),
                'platforms' => array_map(function($platform) {
                    return ['id' => $platform['id'], 'name' => $platform['name']];
                }, $juego['platforms'] ?? []),
                'short_description' => $juego['summary'] ?? 'Descripción no disponible'
            ];
        }, $juegos);
    }

    private function procesarJuegoDetallesIgdb($juego)
    {
        return [
            'id' => $juego['id'] ?? null,
            'name' => $juego['name'] ?? 'Nombre no disponible',
            'description' => $juego['summary'] ?? '',
            'background_image' => isset($juego['cover']['image_id'])
                ? 'https://images.igdb.com/igdb/image/upload/t_cover_big/' . $juego['cover']['image_id'] . '.jpg'
                : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop',
            'released' => isset($juego['first_release_date'])
                ? date('Y-m-d', $juego['first_release_date'])
                : null,
            'rating' => $juego['rating'] ? round($juego['rating'] / 20, 2) : 0,
            'rating_top' => 5,
            'genres' => array_map(function($genre) {
                return ['id' => $genre['id'], 'name' => $genre['name']];
            }, $juego['genres'] ?? []),
            'platforms' => array_map(function($platform) {
                return ['id' => $platform['id'], 'name' => $platform['name']];
            }, $juego['platforms'] ?? [])
        ];
    }

    /**
     * Datos de prueba para géneros
     */
    private function getGenerosDePrueba()
    {
        $generosPrueba = [
            ['id' => 12, 'name' => 'Role-playing (RPG)'],
            ['id' => 31, 'name' => 'Adventure'],
            ['id' => 5, 'name' => 'Shooter'],
            ['id' => 10, 'name' => 'Racing'],
            ['id' => 14, 'name' => 'Sport'],
            ['id' => 7, 'name' => 'Music'],
            ['id' => 15, 'name' => 'Strategy'],
            ['id' => 25, 'name' => 'Hack and slash/Beat em up'],
            ['id' => 8, 'name' => 'Platform'],
            ['id' => 9, 'name' => 'Puzzle']
        ];

        return response()->json([
            'generos' => $generosPrueba,
            'total' => count($generosPrueba)
        ]);
    }

    /**
     * Datos de prueba para plataformas
     */
    private function getPlataformasDePrueba()
    {
        $plataformasPrueba = [
            ['id' => 6, 'name' => 'PC (Microsoft Windows)'],
            ['id' => 48, 'name' => 'PlayStation 4'],
            ['id' => 49, 'name' => 'Xbox One'],
            ['id' => 130, 'name' => 'Nintendo Switch'],
            ['id' => 167, 'name' => 'PlayStation 5'],
            ['id' => 169, 'name' => 'Xbox Series X|S'],
            ['id' => 9, 'name' => 'PlayStation 3'],
            ['id' => 12, 'name' => 'Xbox 360']
        ];

        return response()->json([
            'plataformas' => $plataformasPrueba,
            'total' => count($plataformasPrueba)
        ]);
    }
}
