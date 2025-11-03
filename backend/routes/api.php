<?php
// routes/api.php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ForoController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\GuiaController;
use App\Http\Controllers\TransmisionController;
use App\Http\Controllers\ClanController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\HiloController;
use App\Http\Controllers\RespuestaController;
use App\Http\Controllers\IgdbController;
use App\Http\Controllers\NoticiasController;

// Rutas públicas (sin autenticación)
Route::get('/test-conexion', function () {
    return response()->json(['message' => 'API funcionando']);
});

// Auth routes
Route::post('/auth/register', [UsuarioController::class, 'registro']);
Route::post('/auth/login', [UsuarioController::class, 'login']);

// Rutas públicas de contenido (lectura)
Route::get('/blogs', [BlogController::class, 'index']);
Route::get('/blogs/{id}', [BlogController::class, 'show']);
Route::get('/foros', [ForoController::class, 'index']);
Route::get('/foros/{id}', [ForoController::class, 'show']);
Route::get('/foros/{foroId}/hilos', [ForoController::class, 'hilos']);
Route::get('/hilos/{id}', [HiloController::class, 'show']);
Route::get('/hilos/{hiloId}/respuestas', [RespuestaController::class, 'index']);
Route::get('/eventos', [EventoController::class, 'index']);
Route::get('/eventos/{id}', [EventoController::class, 'show']);
Route::get('/guias', [GuiaController::class, 'index']);
Route::get('/guias/{id}', [GuiaController::class, 'show']);
Route::get('/clanes', [ClanController::class, 'index']);
Route::get('/clanes/{id}', [ClanController::class, 'show']);

// Rutas IGDB (públicas)
Route::get('/juegos', [IgdbController::class, 'getJuegos']);
Route::get('/juegos/buscar', [IgdbController::class, 'buscarJuegos']);
Route::get('/juegos/{id}', [IgdbController::class, 'getDetallesJuego']);
Route::get('/generos', [IgdbController::class, 'getGeneros']);
Route::get('/plataformas', [IgdbController::class, 'getPlataformas']);
Route::get('/juegos-populares', [IgdbController::class, 'getJuegosPopulares']);

// Rutas noticias (públicas)
Route::get('/noticias', [NoticiasController::class, 'getNoticias']);
Route::get('/noticias/buscar', [NoticiasController::class, 'buscarNoticias']);
Route::get('/noticias/categorias', [NoticiasController::class, 'getCategorias']);

// Rutas que requieren autenticación
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [UsuarioController::class, 'logout']);
    Route::get('/auth/user', [UsuarioController::class, 'user']);

    // Creación de contenido
    Route::post('/blogs', [BlogController::class, 'store']);
    Route::put('/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);

    Route::post('/foros/{foroId}/hilos', [ForoController::class, 'crearHilo']);
    Route::post('/hilos/{hiloId}/responder', [ForoController::class, 'responder']);
    Route::delete('/hilos/{id}', [HiloController::class, 'destroy']);
    Route::delete('/respuestas/{id}', [RespuestaController::class, 'destroy']);

    Route::post('/eventos', [EventoController::class, 'store']);
    Route::post('/eventos/{id}/asistir', [EventoController::class, 'asistir']);
    Route::delete('/eventos/{id}', [EventoController::class, 'destroy']);

    Route::post('/guias', [GuiaController::class, 'store']);
    Route::put('/guias/{id}', [GuiaController::class, 'update']);
    Route::delete('/guias/{id}', [GuiaController::class, 'destroy']);

    Route::post('/clanes', [ClanController::class, 'store']);
    Route::post('/clanes/{id}/unirse', [ClanController::class, 'unirse']);
    Route::delete('/clanes/{id}', [ClanController::class, 'destroy']);

    Route::post('/transmisiones', [TransmisionController::class, 'store']);
    Route::put('/transmisiones/{id}', [TransmisionController::class, 'update']);
    Route::delete('/transmisiones/{id}', [TransmisionController::class, 'destroy']);
});
