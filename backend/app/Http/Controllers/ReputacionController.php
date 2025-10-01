<?php

namespace App\Http\Controllers;

use App\Models\RegistroReputacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReputacionController extends Controller
{
    public function logs()
    {
        return RegistroReputacion::where('usuario_id', Auth::id())->get();
    }

    public function sumarPuntos(Request $request)
    {
        $request->validate([
            'accion' => 'required|string',
            'puntos' => 'required|integer'
        ]);

        $usuario = \App\Models\Usuario::find(Auth::id());

        if (!$usuario) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $registro = \App\Models\RegistroReputacion::create([
            'usuario_id' => $usuario->id,
            'accion' => $request->accion,
            'puntos' => $request->puntos
        ]);

        $usuario->reputacion = $usuario->reputacion + $request->puntos;
        $usuario->save();

        return response()->json($registro, 201);
    }
}
