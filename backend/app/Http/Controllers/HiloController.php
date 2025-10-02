<?php

namespace App\Http\Controllers;

use App\Models\Hilo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HiloController extends Controller
{
    // Ver todos los hilos de un foro
    public function index($foroId)
    {
        return Hilo::where('foro_id', $foroId)->with('usuario')->get();
    }

    // Crear un nuevo hilo en un foro
    public function store(Request $request, $foroId)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'cuerpo' => 'required|string'
        ]);

        $hilo = Hilo::create([
            'foro_id' => $foroId,
            'usuario_id' => Auth::id(),
            'titulo' => $request->titulo,
            'cuerpo' => $request->cuerpo
        ]);

        return response()->json($hilo, 201);
    }
}
