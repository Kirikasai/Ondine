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
        return Cache::remember('igdb_access_token', 86400, function () {
            try {
                $response = Http::asForm()->post('https://id.twitch.tv/oauth2/token', [
                    'client_id' => $this->getClientId(),
                    'client_secret' => $this->getClientSecret(),
                    'grant_type' => 'client_credentials'
                ]);

                if ($response->successful()) {
                    return $response->json()['access_token'];
                }
                return null;
            } catch (\Exception $e) {
                return null;
            }
        });
    }

    private function makeIgdbRequest($endpoint, $query)
    {
        try {
            $token = $this->getAccessToken();
            $clientId = $this->getClientId();

            if (!$token || !$clientId) {
                return null;
            }

            $cacheKey = 'igdb_' . md5($endpoint . $query);

            return Cache::remember($cacheKey, 3600, function () use ($endpoint, $query, $token, $clientId) {
                $response = Http::timeout(30)
                    ->withHeaders([
                        'Client-ID' => $clientId,
                        'Authorization' => "Bearer {$token}",
                    ])->withBody($query, 'text/plain')
                    ->post("https://api.igdb.com/v4/{$endpoint}");

                return $response->successful() ? $response->json() : null;
            });

        } catch (\Exception $e) {
            return null;
        }
    }

    public function getJuegos(Request $request)
    {
        try {
            $pagina = max(1, (int)$request->get('pagina', 1));
            $limite = min(40, max(1, (int)$request->get('limite', 20)));
            $busqueda = $request->get('busqueda');
            $genero = $request->get('genero');
            $plataforma = $request->get('plataforma');

            $offset = ($pagina - 1) * $limite;

            // QUERY OPTIMIZADA - Solo campos esenciales
            $whereConditions = ["category = 0", "rating >= 70"];

            if ($busqueda) {
                $whereConditions[] = "name ~ *\"{$busqueda}\"*";
            }

            $whereClause = implode(' & ', $whereConditions);

            $query = "
                fields name, cover.url, rating, first_release_date, genres.name, platforms.name;
                where {$whereClause};
                sort rating desc;
                limit {$limite};
                offset {$offset};
            ";

            $juegos = $this->makeIgdbRequest('games', $query);

            if (!$juegos) {
                return $this->getJuegosLocales($request);
            }

            $juegosProcesados = $this->procesarJuegosIgdb($juegos);

            return response()->json([
                'juegos' => $juegosProcesados,
                'paginacion' => [
                    'pagina_actual' => $pagina,
                    'limite' => $limite,
                    'total_juegos' => 1000,
                    'total_paginas' => ceil(1000 / $limite),
                    'siguiente_pagina' => $pagina < ceil(1000 / $limite) ? $pagina + 1 : null,
                    'pagina_anterior' => $pagina > 1 ? $pagina - 1 : null
                ],
                'status' => 'success',
                'fuente' => 'igdb',
                'mensaje' => '🎮 ' . count($juegosProcesados) . ' juegos cargados desde IGDB'
            ]);

        } catch (\Exception $e) {
            return $this->getJuegosLocales($request);
        }
    }

    public function getDetallesJuego($id)
    {
        try {
            $query = "
                fields name, summary, cover.url, rating, first_release_date, genres.name, platforms.name;
                where id = {$id};
            ";

            $juego = $this->makeIgdbRequest('games', $query);

            if (!$juego || empty($juego)) {
                return response()->json(['error' => 'Juego no encontrado'], 404);
            }

            return response()->json([
                'data' => $this->procesarJuegoDetallesIgdb($juego[0]),
                'status' => 'success',
                'fuente' => 'igdb'
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener detalles'], 500);
        }
    }

    public function getGeneros()
    {
        try {
            $query = "fields name; sort name asc; limit 50;";
            $generos = $this->makeIgdbRequest('genres', $query);

            if (!$generos) {
                return response()->json(['error' => 'No se pudieron cargar los géneros'], 500);
            }

            return response()->json([
                'generos' => $generos,
                'total' => count($generos)
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al cargar géneros'], 500);
        }
    }

    public function getPlataformas()
    {
        try {
            $query = "fields name; sort name asc; limit 50;";
            $plataformas = $this->makeIgdbRequest('platforms', $query);

            if (!$plataformas) {
                return response()->json(['error' => 'No se pudieron cargar las plataformas'], 500);
            }

            return response()->json([
                'plataformas' => $plataformas,
                'total' => count($plataformas)
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al cargar plataformas'], 500);
        }
    }

    public function buscarJuegos(Request $request)
    {
        $busqueda = $request->get('q');
        if (!$busqueda) {
            return response()->json(['error' => 'Término de búsqueda requerido'], 400);
        }

        return $this->getJuegos(new Request([
            'busqueda' => $busqueda,
            'limite' => 20
        ]));
    }

    public function getJuegosPopulares()
    {
        return $this->getJuegos(new Request([
            'limite' => 12
        ]));
    }

    private function procesarJuegosIgdb($juegos)
    {
        return array_map(function($juego) {
            return [
                'id' => $juego['id'],
                'name' => $juego['name'],
                'background_image' => isset($juego['cover']['url'])
                    ? 'https:' . str_replace('thumb', 'cover_big', $juego['cover']['url'])
                    : null,
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
        }, $juegos);
    }

    private function procesarJuegoDetallesIgdb($juego)
    {
        return [
            'id' => $juego['id'],
            'name' => $juego['name'],
            'description' => $juego['summary'] ?? '',
            'background_image' => isset($juego['cover']['url'])
                ? 'https:' . str_replace('thumb', 'cover_big_2x', $juego['cover']['url'])
                : null,
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

    private function getJuegosLocales(Request $request)
    {
        return response()->json([
            'juegos' => [],
            'paginacion' => [
                'pagina_actual' => 1,
                'limite' => 20,
                'total_juegos' => 0,
                'total_paginas' => 0
            ],
            'status' => 'success',
            'fuente' => 'local',
            'mensaje' => 'No hay juegos disponibles'
        ]);
    }
}
