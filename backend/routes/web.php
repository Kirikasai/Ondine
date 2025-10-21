<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Ruta de prueba para verificar que las rutas web funcionan
Route::get('/test-web', function () {
    return '✅ Rutas web funcionando correctamente';
});

// Si necesitas una vista para el panel de administración
Route::get('/admin', function () {
    return view('admin');
})->name('admin');

// Ruta de fallback para manejar URLs no encontradas
Route::fallback(function () {
    return response()->json([
        'error' => 'Ruta no encontrada',
        'message' => 'La ruta solicitada no existe en la aplicación.'
    ], 404);
});
