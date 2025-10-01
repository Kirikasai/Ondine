<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\ForoController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\GuiaController;
use App\Http\Controllers\TransmisionController;
use App\Http\Controllers\ClanController;
use App\Http\Controllers\ReputacionController;
use App\Http\Controllers\LogroController;
use App\Http\Controllers\EventoController;

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
