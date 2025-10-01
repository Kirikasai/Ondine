<?php

namespace App\Http\Controllers;

use App\Models\Foro;
use App\Models\Hilo;
use App\Models\Respuesta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForoController extends Controller
{
     public function index()
    {
        return Foro::all();
    }

    public function hilos($foroId)
    {
        return Hilo::where('foro_id', $foroId)->with(['usuario', 'respuestas'])->get();
    }

    public function crearHilo(Request $request, $foroId)
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

    public function responder(Request $request, $hiloId)
    {
        $request->validate(['cuerpo' => 'required|string']);

        $respuesta = Respuesta::create([
            'hilo_id' => $hiloId,
            'usuario_id' => Auth::id(),
            'cuerpo' => $request->cuerpo
        ]);

        return response()->json($respuesta, 201);
    }
}
