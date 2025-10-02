<?php

namespace App\Http\Controllers;

use App\Models\Respuesta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RespuestaController extends Controller
{
    public function store(Request $request, $hiloId)
    {
        $request->validate(['cuerpo' => 'required|string']);

        $respuesta = Respuesta::create([
            'hilo_id' => $hiloId,
            'usuario_id' => Auth::id(),
            'cuerpo' => $request->cuerpo
        ]);

        return response()->json($respuesta, 201);
    }

    public function destroy($id)
    {
        $respuesta = Respuesta::findOrFail($id);

        if ($respuesta->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $respuesta->delete();

        return response()->json(['mensaje' => 'Respuesta eliminada']);
    }
}
