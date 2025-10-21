<?php
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Response;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ForoController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\GuiaController;
use App\Http\Controllers\TransmisionController;
use App\Http\Controllers\ClanController;
use App\Http\Controllers\ReputacionController;
use App\Http\Controllers\LogroController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\IgdbController;
use App\Http\Controllers\NoticiasController;

Route::get('/test-conexion', function () {
    try {
        // Test 1: Google (siempre disponible)
        $googleResponse = Http::timeout(10)->get('https://www.google.com');

        // Test 2: API pública genérica
        $apiResponse = Http::timeout(10)->get('https://jsonplaceholder.typicode.com/posts/1');

        // Test 3: Steam API directamente
        $steamResponse = Http::timeout(10)->get('https://api.steampowered.com/ISteamApps/GetAppList/v2/');

        return response()->json([
            'google_status' => $googleResponse->status(),
            'api_publica_status' => $apiResponse->status(),
            'api_publica_data' => $apiResponse->successful() ? $apiResponse->json() : 'Error',
            'steam_status' => $steamResponse->status(),
            'steam_body' => $steamResponse->successful() ? 'Conexión exitosa' : $steamResponse->body(),
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Excepción atrapada',
            'message' => $e->getMessage(),
            'type' => get_class($e)
        ], 500);
    }
});

function corsResponse($data) {
    return response()->json($data)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

// Rutas IGDB
Route::get('/juegos', [IgdbController::class, 'getJuegos']);
Route::get('/juegos/buscar', [IgdbController::class, 'buscarJuegos']);
Route::get('/juegos/{id}', [IgdbController::class, 'getDetallesJuego']);
Route::get('/generos', [IgdbController::class, 'getGeneros']);
Route::get('/plataformas', [IgdbController::class, 'getPlataformas']);
Route::get('/juegos-populares', [IgdbController::class, 'getJuegosPopulares']);
Route::get('/juegos-recientes', [IgdbController::class, 'getJuegosRecientes']);
Route::get('/igdb/verificar', [IgdbController::class, 'verificarConexion']);

// Mantener noticias
Route::get('/noticias', [NoticiasController::class, 'getNoticias']);

Route::post('/registro', [UsuarioController::class, 'registro']);
Route::post('/login', [UsuarioController::class, 'login']);



Route::middleware('auth:sanctum')->post('/logout', [UsuarioController::class, 'logout']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/foros', [ForoController::class, 'index']);
    Route::get('/foros/{id}/hilos', [ForoController::class, 'hilos']);
    Route::post('/foros/{id}/hilos', [ForoController::class, 'crearHilo']);
    Route::post('/hilos/{id}/responder', [ForoController::class, 'responder']);

    Route::get('/blogs', [BlogController::class, 'index']);
    Route::post('/blogs', [BlogController::class, 'store']);

    Route::get('/guias', [GuiaController::class, 'index']);
    Route::post('/guias', [GuiaController::class, 'store']);

    Route::get('/transmisiones', [TransmisionController::class, 'index']);
    Route::post('/transmisiones', [TransmisionController::class, 'store']);

    Route::get('/clanes', [ClanController::class, 'index']);
    Route::post('/clanes', [ClanController::class, 'store']);
    Route::post('/clanes/{id}/unirse', [ClanController::class, 'unirse']);

    Route::get('/reputacion', [ReputacionController::class, 'logs']);
    Route::post('/reputacion/sumar', [ReputacionController::class, 'sumarPuntos']);

    Route::get('/logros', [LogroController::class, 'index']);
    Route::post('/logros/asignar', [LogroController::class, 'asignar']);

    Route::get('/eventos', [EventoController::class, 'index']);
    Route::post('/eventos', [EventoController::class, 'store']);
    Route::post('/eventos/{id}/asistir', [EventoController::class, 'asistir']);
});
