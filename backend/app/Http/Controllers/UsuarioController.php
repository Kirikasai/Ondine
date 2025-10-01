<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function registro(Request $request)
    {
        $request->validate([
            'nombre_usuario' => 'required|string|max:100|unique:usuarios,nombre_usuario',
            'correo' => 'required|string|email|max:150|unique:usuarios,correo',
            'contrasena' => 'required|string|min:6',
        ]);

        $usuario = Usuario::create([
            'nombre_usuario' => $request->nombre_usuario,
            'correo' => $request->correo,
            'contrasena' => Hash::make($request->contrasena),
        ]);

        return response()->json([
            'mensaje' => 'Usuario registrado correctamente',
            'usuario' => $usuario
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'correo' => 'required|string|email',
            'contrasena' => 'required|string',
        ]);

        $usuario = Usuario::where('correo', $request->correo)->first();

        if (!$usuario || !Hash::check($request->contrasena, $usuario->contrasena)) {
            return response()->json([
                'error' => 'Credenciales inválidas'
            ], 401);
        }

        $token = $usuario->createToken('api_token')->plainTextToken;

        return response()->json([
            'mensaje' => 'Inicio de sesión correcto',
            'usuario' => $usuario,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'mensaje' => 'Sesión cerrada correctamente'
        ]);
    }
}
