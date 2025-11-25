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
use App\Http\Controllers\GiantBombController;
use App\Http\Controllers\TwitchController;
use App\Http\Controllers\NoticiasController;
use App\Http\Controllers\FavoritoController;

// Rutas públicas (sin autenticación)
Route::get('/test-conexion', function () {
    return response()->json(['message' => 'API funcionando']);
});

// Auth routes
Route::post('/auth/register', [UsuarioController::class, 'registro']);
Route::post('/auth/login', [UsuarioController::class, 'login']);
Route::get('/auth/user', [UsuarioController::class, 'user']);
Route::put('/auth/profile', [UsuarioController::class, 'updateProfile']);

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

// Rutas GiantBomb (públicas)
Route::get('/verificar-giantbomb', [GiantBombController::class, 'verificarCredenciales']);
Route::get('/test-ultra-simple', [GiantBombController::class, 'testUltraSimple']);
Route::get('/test-generos', [GiantBombController::class, 'testGeneros']);
Route::get('/juegos', [GiantBombController::class, 'getJuegos']);
Route::get('/juegos/buscar', [GiantBombController::class, 'buscarJuegos']);
Route::get('/generos', [GiantBombController::class, 'getGeneros']);
Route::get('/plataformas', [GiantBombController::class, 'getPlataformas']);

// Rutas noticias (públicas)
Route::get('/noticias', [NoticiasController::class, 'getNoticias']);
Route::get('/noticias/buscar', [NoticiasController::class, 'buscarNoticias']);
Route::get('/noticias/categorias', [NoticiasController::class, 'getCategorias']);

// Rutas que requieren autenticación
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [UsuarioController::class, 'logout']);
    Route::get('/auth/user', [UsuarioController::class, 'user']);
    Route::put('/auth/profile', [UsuarioController::class, 'updateProfile']);

    // Rutas de favoritos (requieren autenticación)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/favoritos', [FavoritoController::class, 'index']);
        Route::post('/favoritos', [FavoritoController::class, 'store']);
        Route::get('/favoritos/{id}', [FavoritoController::class, 'show']);
        Route::put('/favoritos/{id}', [FavoritoController::class, 'update']);
        Route::delete('/favoritos/{id}', [FavoritoController::class, 'destroy']);
        Route::get('/favoritos/buscar', [FavoritoController::class, 'buscar']);
    });
    // Creación de contenido
    // Rutas públicas de blogs
    Route::get('/blogs', [BlogController::class, 'index']);
    Route::get('/blogs/{id}', [BlogController::class, 'show']);
    Route::get('/blogs/{id}/comentarios', [BlogController::class, 'getComentarios']);
    Route::get('/blogs/{id}/likes', [BlogController::class, 'getLikesInfo']);

    // Rutas protegidas de blogs
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/blogs', [BlogController::class, 'store']);
        Route::put('/blogs/{id}', [BlogController::class, 'update']);
        Route::delete('/blogs/{id}', [BlogController::class, 'destroy']);

        // Comentarios
        Route::post('/blogs/{id}/comentarios', [BlogController::class, 'crearComentario']);
        Route::delete('/blogs/{blogId}/comentarios/{comentarioId}', [BlogController::class, 'eliminarComentario']);

        // Likes
        Route::post('/blogs/{id}/like', [BlogController::class, 'darLike']);
    });

    Route::post('/foros/{foroId}/hilos', [ForoController::class, 'crearHilo']);
    Route::post('/hilos/{hiloId}/responder', [ForoController::class, 'responder']);
    Route::delete('/hilos/{id}', [HiloController::class, 'destroy']);
    Route::delete('/respuestas/{id}', [RespuestaController::class, 'destroy']);

    Route::get('/eventos/{id}/asistentes', [EventoController::class, 'asistentes']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/eventos/{id}/mi-estado', [EventoController::class, 'miEstado']);
        Route::post('/eventos/{id}/asistencia', [EventoController::class, 'manejarAsistencia']);
    });

    Route::post('/guias', [GuiaController::class, 'store']);
    Route::put('/guias/{id}', [GuiaController::class, 'update']);
    Route::delete('/guias/{id}', [GuiaController::class, 'destroy']);

    Route::post('/clanes', [ClanController::class, 'store']);
    Route::post('/clanes/{id}/unirse', [ClanController::class, 'unirse']);
    Route::delete('/clanes/{id}', [ClanController::class, 'destroy']);

    Route::get('/transmisiones', [TransmisionController::class, 'index']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/transmisiones', [TransmisionController::class, 'store']);
        Route::put('/transmisiones/{id}', [TransmisionController::class, 'update']);
        Route::delete('/transmisiones/{id}', [TransmisionController::class, 'destroy']);
    });
});
