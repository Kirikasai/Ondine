<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class NoticiasController extends Controller
{
    private function getNewsApiKey()
    {
        return env('NEWS_API_KEY');
    }

    public function getNoticias(Request $request)
    {
        try {
            $categoria = $request->get('categoria', 'gaming');
            $pagina = max(1, (int)$request->get('pagina', 1));
            $limite = 20; // NewsAPI máximo 100 por página

            $cacheKey = "noticias_{$categoria}_{$pagina}";

            $noticias = Cache::remember($cacheKey, 600, function () use ($categoria, $pagina, $limite) {
                $apiKey = $this->getNewsApiKey();

                if (!$apiKey) {
                    Log::warning('News API Key no configurada, usando datos demo');
                    return $this->getNoticiasDemo($pagina, $limite);
                }

                Log::info("📰 Solicitando noticias - Categoría: {$categoria}, Página: {$pagina}");

                $response = Http::timeout(20)
                    ->retry(2, 1000)
                    ->get('https://newsapi.org/v2/everything', [
                        'q' => $categoria,
                        'language' => 'es',
                        'pageSize' => $limite,
                        'page' => $pagina,
                        'sortBy' => 'publishedAt',
                        'apiKey' => $apiKey
                    ]);

                Log::info("📊 Status NewsAPI: " . $response->status());

                if ($response->successful()) {
                    $data = $response->json();
                    Log::info("✅ NewsAPI success - Artículos: " . count($data['articles'] ?? []));
                    return $data;
                }

                Log::error("❌ NewsAPI error: " . $response->body());
                return $this->getNoticiasDemo($pagina, $limite);
            });

            $articulos = $noticias['articles'] ?? [];
            $totalNoticias = $noticias['totalResults'] ?? count($articulos);

            // Calcular páginas (NewsAPI limita a 1000 resultados máximo = 50 páginas)
            $totalPaginas = min(50, ceil($totalNoticias / $limite));

            return response()->json([
                'noticias' => $articulos,
                'paginacion' => [
                    'pagina_actual' => $pagina,
                    'limite' => $limite,
                    'total_noticias' => $totalNoticias,
                    'total_paginas' => $totalPaginas,
                    'siguiente_pagina' => $pagina < $totalPaginas ? $pagina + 1 : null,
                    'pagina_anterior' => $pagina > 1 ? $pagina - 1 : null
                ],
                'categoria' => $categoria,
                'fuente' => isset($apiKey) ? 'newsapi' : 'demo',
                'status' => 'success'
            ]);

        } catch (\Exception $e) {
            Log::error('💥 Error en getNoticias: ' . $e->getMessage());
            return response()->json([
                'noticias' => $this->getNoticiasDemo(1, 10)['articles'],
                'paginacion' => [
                    'pagina_actual' => 1,
                    'limite' => 10,
                    'total_noticias' => 10,
                    'total_paginas' => 1,
                    'siguiente_pagina' => null,
                    'pagina_anterior' => null
                ],
                'categoria' => 'videojuegos',
                'fuente' => 'demo',
                'status' => 'error',
                'message' => 'Usando noticias de demostración'
            ]);
        }
    }

    public function buscarNoticias(Request $request)
    {
        $busqueda = $request->get('q');
        $pagina = max(1, (int)$request->get('pagina', 1));
        $limite = 20;

        if (!$busqueda) {
            return response()->json(['error' => 'Término de búsqueda requerido'], 400);
        }

        try {
            $apiKey = $this->getNewsApiKey();

            if (!$apiKey) {
                // Si no hay API key, filtrar noticias demo
                $noticiasDemo = $this->getNoticiasDemo($pagina, $limite);
                $noticiasFiltradas = array_filter($noticiasDemo['articles'], function($noticia) use ($busqueda) {
                    return stripos($noticia['title'], $busqueda) !== false ||
                           stripos($noticia['description'], $busqueda) !== false;
                });

                $noticiasPagina = array_slice(array_values($noticiasFiltradas), 0, $limite);

                return response()->json([
                    'noticias' => $noticiasPagina,
                    'paginacion' => [
                        'pagina_actual' => $pagina,
                        'limite' => $limite,
                        'total_noticias' => count($noticiasFiltradas),
                        'total_paginas' => ceil(count($noticiasFiltradas) / $limite),
                        'siguiente_pagina' => $pagina < ceil(count($noticiasFiltradas) / $limite) ? $pagina + 1 : null,
                        'pagina_anterior' => $pagina > 1 ? $pagina - 1 : null
                    ],
                    'busqueda' => $busqueda,
                    'fuente' => 'demo',
                    'status' => 'success'
                ]);
            }

            Log::info("🔍 Buscando noticias: '{$busqueda}', Página: {$pagina}");

            $response = Http::timeout(20)
                ->get('https://newsapi.org/v2/everything', [
                    'q' => $busqueda,
                    'language' => 'es',
                    'pageSize' => $limite,
                    'page' => $pagina,
                    'sortBy' => 'publishedAt',
                    'apiKey' => $apiKey
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $totalNoticias = $data['totalResults'] ?? 0;
                $totalPaginas = min(50, ceil($totalNoticias / $limite));

                return response()->json([
                    'noticias' => $data['articles'] ?? [],
                    'paginacion' => [
                        'pagina_actual' => $pagina,
                        'limite' => $limite,
                        'total_noticias' => $totalNoticias,
                        'total_paginas' => $totalPaginas,
                        'siguiente_pagina' => $pagina < $totalPaginas ? $pagina + 1 : null,
                        'pagina_anterior' => $pagina > 1 ? $pagina - 1 : null
                    ],
                    'busqueda' => $busqueda,
                    'fuente' => 'newsapi',
                    'status' => 'success'
                ]);
            }

            Log::error("❌ Error en búsqueda NewsAPI: " . $response->body());
            return response()->json(['error' => 'Error en la búsqueda de noticias'], 500);

        } catch (\Exception $e) {
            Log::error('💥 Error en buscarNoticias: ' . $e->getMessage());
            return response()->json(['error' => 'Error en la búsqueda'], 500);
        }
    }

    public function getNoticiasPopulares()
    {
        return $this->getNoticias(new Request([
            'categoria' => 'videojuegos',
            'pagina' => 1,
            'limite' => 12
        ]));
    }

    public function getCategorias()
    {
        $categorias = [
            ['id' => 'gaming', 'nombre' => 'Videojuegos', 'descripcion' => 'Noticias sobre gaming'],
            ['id' => 'esports', 'nombre' => 'eSports', 'descripcion' => 'Competencias profesionales'],
            ['id' => 'playstation', 'nombre' => 'PlayStation', 'descripcion' => 'Noticias de PS5, PS4'],
            ['id' => 'xbox', 'nombre' => 'Xbox', 'descripcion' => 'Noticias de Xbox Series X|S'],
            ['id' => 'nintendo', 'nombre' => 'Nintendo', 'descripcion' => 'Noticias de Switch'],
            ['id' => 'pc-gaming', 'nombre' => 'PC Gaming', 'descripcion' => 'Juegos para PC'],
            ['id' => 'mobile-gaming', 'nombre' => 'Mobile Gaming', 'descripcion' => 'Juegos para móviles'],
            ['id' => 'realidad-virtual', 'nombre' => 'Realidad Virtual', 'descripcion' => 'VR y AR'],
        ];

        return response()->json([
            'categorias' => $categorias,
            'total' => count($categorias)
        ]);
    }

    private function getNoticiasDemo($pagina = 1, $limite = 20)
    {
        $todasNoticias = [
            [
                'title' => 'Nuevo juego de acción anunciado para 2024 con gráficos revolucionarios',
                'description' => 'Los desarrolladores han anunciado un emocionante nuevo juego de acción que llegará el próximo año con tecnología de vanguardia.',
                'url' => 'https://ejemplo.com/noticia1',
                'urlToImage' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop',
                'publishedAt' => now()->toISOString(),
                'source' => ['name' => 'GameNews'],
                'author' => 'Redacción Gaming',
                'content' => 'El mundo de los videojuegos está de enhorabuena con este nuevo anuncio...'
            ],
            [
                'title' => 'Actualización masiva para popular RPG incluye nuevo contenido',
                'description' => 'El famoso RPG recibe una actualización con nuevo contenido, misiones y mejoras de rendimiento significativas.',
                'url' => 'https://ejemplo.com/noticia2',
                'urlToImage' => 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop',
                'publishedAt' => now()->subHours(2)->toISOString(),
                'source' => ['name' => 'RPG World'],
                'author' => 'Carlos Martínez',
                'content' => 'Los jugadores del aclamado RPG están de celebración...'
            ],
            [
                'title' => 'Torneo de eSports con premio millonario bate récords de audiencia',
                'description' => 'Se anuncia torneo internacional con uno de los premios más grandes de la historia y transmisión global.',
                'url' => 'https://ejemplo.com/noticia3',
                'urlToImage' => 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=200&fit=crop',
                'publishedAt' => now()->subDays(1)->toISOString(),
                'source' => ['name' => 'eSports Daily'],
                'author' => 'Ana López',
                'content' => 'El mundo de los eSports está revolucionado con el anuncio...'
            ],
            [
                'title' => 'Lanzamiento sorpresa de indie game conquista a la crítica',
                'description' => 'Un estudio independiente lanza su juego sin previo aviso y recibe elogios de la crítica especializada.',
                'url' => 'https://ejemplo.com/noticia4',
                'urlToImage' => 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=200&fit=crop',
                'publishedAt' => now()->subDays(2)->toISOString(),
                'source' => ['name' => 'Indie Games'],
                'author' => 'Miguel Torres',
                'content' => 'En una movida sorpresa, un pequeño estudio...'
            ],
            [
                'title' => 'Nueva consola portátil promete revolucionar el gaming móvil',
                'description' => 'Una nueva consola portátil con hardware de última generación se presenta en el mercado.',
                'url' => 'https://ejemplo.com/noticia5',
                'urlToImage' => 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=200&fit=crop',
                'publishedAt' => now()->subDays(3)->toISOString(),
                'source' => ['name' => 'Tech Gaming'],
                'author' => 'Laura García',
                'content' => 'El mercado de consolas portátiles se sacude con...'
            ],
            [
                'title' => 'Actualización de temporada añade nuevo mapa y personajes',
                'description' => 'El popular juego battle royale recibe su mayor actualización con nuevo contenido jugable.',
                'url' => 'https://ejemplo.com/noticia6',
                'urlToImage' => 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=200&fit=crop',
                'publishedAt' => now()->subDays(4)->toISOString(),
                'source' => ['name' => 'Battle Royale News'],
                'author' => 'David Chen',
                'content' => 'Los jugadores del aclamado battle royale...'
            ],
            [
                'title' => 'Estudio anuncia remake de clásico de los 90',
                'description' => 'Uno de los juegos más icónicos de la década de los 90 recibirá un remake completo con gráficos modernos.',
                'url' => 'https://ejemplo.com/noticia7',
                'urlToImage' => 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=400&h=200&fit=crop',
                'publishedAt' => now()->subDays(5)->toISOString(),
                'source' => ['name' => 'Retro Gaming'],
                'author' => 'Sofia Rodríguez',
                'content' => 'Los fans de los clásicos están de enhorabuena...'
            ],
            [
                'title' => 'Nueva tecnología de renderizado mejora performance en PC',
                'description' => 'Una nueva tecnología de renderizado promete mejorar significativamente el rendimiento en tarjetas gráficas modernas.',
                'url' => 'https://ejemplo.com/noticia8',
                'urlToImage' => 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=400&h=200&fit=crop',
                'publishedAt' => now()->subDays(6)->toISOString(),
                'source' => ['name' => 'PC Master'],
                'author' => 'Alex Thompson',
                'content' => 'Los desarrolladores de motores gráficos...'
            ],
            [
                'title' => 'Crossover inesperado entre dos franquicias populares',
                'description' => 'Dos franquicias de videojuegos anuncian un crossover sorpresa que unirá sus universos.',
                'url' => 'https://ejemplo.com/noticia9',
                'urlToImage' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop',
                'publishedAt' => now()->subDays(7)->toISOString(),
                'source' => ['name' => 'Crossover News'],
                'author' => 'Marta Jiménez',
                'content' => 'En un movimiento sorpresa, dos estudios...'
            ],
            [
                'title' => 'Servidores dedicados mejoran experiencia multijugador',
                'description' => 'El juego más popular del momento migra a servidores dedicados para mejorar la experiencia online.',
                'url' => 'https://ejemplo.com/noticia10',
                'urlToImage' => 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=200&fit=crop',
                'publishedAt' => now()->subDays(8)->toISOString(),
                'source' => ['name' => 'Online Gaming'],
                'author' => 'Roberto Silva',
                'content' => 'Los jugadores del título multijugador...'
            ]
        ];

        // Paginación para datos demo
        $offset = ($pagina - 1) * $limite;
        $noticiasPagina = array_slice($todasNoticias, $offset, $limite);

        return [
            'articles' => $noticiasPagina,
            'totalResults' => count($todasNoticias)
        ];
    }

    public function verificarNewsApi()
    {
        try {
            $apiKey = $this->getNewsApiKey();

            if (!$apiKey) {
                return response()->json([
                    'status' => 'error',
                    'message' => '❌ NEWS_API_KEY no configurada en .env',
                    'instrucciones' => 'Regístrate en https://newsapi.org y agrega tu API Key al .env'
                ], 500);
            }

            $response = Http::timeout(15)
                ->get('https://newsapi.org/v2/top-headlines', [
                    'country' => 'us',
                    'pageSize' => 1,
                    'apiKey' => $apiKey
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'status' => 'success',
                    'message' => '✅ NewsAPI funciona correctamente',
                    'api_key' => substr($apiKey, 0, 8) . '...',
                    'articulos_disponibles' => $data['totalResults'] ?? 0
                ]);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => '❌ NewsAPI no responde correctamente',
                    'error' => $response->body()
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => '💥 Error verificando NewsAPI: ' . $e->getMessage()
            ], 500);
        }
    }
}
