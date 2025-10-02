<?php

namespace App\Http\Controllers;

use App\Models\RegistroReputacion;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RegistroReputacionController extends Controller
{
    // Ver historial de reputación del usuario autenticado
    public function index()
    {
        return RegistroReputacion::where('usuario_id', Auth::id())->get();
    }

    // Sumar puntos de reputación
    public function store(Request $request)
    {
        $request->validate([
            'accion' => 'required|string',
            'puntos' => 'required|integer'
        ]);

        $usuario = Usuario::find(Auth::id());
        if (!$usuario) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $registro = RegistroReputacion::create([
            'usuario_id' => $usuario->id,
            'accion' => $request->accion,
            'puntos' => $request->puntos
        ]);

        $usuario->reputacion += $request->puntos;
        $usuario->save();

        return response()->json($registro, 201);
    }
}

