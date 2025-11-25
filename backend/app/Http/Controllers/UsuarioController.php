<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log; // Agregar este use
use Illuminate\Support\Facades\Storage; // Para manejar archivos

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

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'mensaje' => 'Usuario registrado correctamente',
            'usuario' => $usuario,
            'token' => $token
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

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'mensaje' => 'Inicio de sesión correcto',
            'usuario' => [
                'id' => $usuario->id,
                'nombre_usuario' => $usuario->nombre_usuario,
                'correo' => $usuario->correo,
                'creado_en' => $usuario->creado_en,
            ],
            'token' => $token
        ], 200);
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->tokens()->delete();

            return response()->json([
                'mensaje' => 'Sesión cerrada correctamente'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error en logout: ' . $e->getMessage());
            return response()->json([
                'error' => 'Error al cerrar sesión'
            ], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            $usuario = $request->user();

            return response()->json([
                'usuario' => [
                    'id' => $usuario->id,
                    'nombre_usuario' => $usuario->nombre_usuario,
                    'correo' => $usuario->correo,
                    'reputacion' => $usuario->reputacion,
                    'creado_en' => $usuario->creado_en,
                    'foto_perfil_url' => $usuario->foto_perfil_url, // Agregar esto
                ],
                'status' => 'success'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error obteniendo usuario: ' . $e->getMessage());
            return response()->json([
                'error' => 'Usuario no autenticado'
            ], 401);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $usuario = $request->user();

            $validator = Validator::make($request->all(), [
                'nombre_usuario' => 'sometimes|string|max:100|unique:usuarios,nombre_usuario,' . $usuario->id,
                'correo' => 'sometimes|string|email|max:150|unique:usuarios,correo,' . $usuario->id,
                'contrasena_actual' => 'required_with:nueva_contrasena',
                'nueva_contrasena' => 'sometimes|string|min:6',
                'foto_perfil' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Error de validación',
                    'errores' => $validator->errors(),
                    'status' => 'error'
                ], 422);
            }

            $data = $request->only(['nombre_usuario', 'correo']);

            // Manejar subida de foto de perfil
            if ($request->hasFile('foto_perfil')) {
                // Eliminar foto anterior si existe
                if ($usuario->foto_perfil && Storage::exists($usuario->foto_perfil)) {
                    Storage::delete($usuario->foto_perfil);
                }

                // Guardar nueva foto
                $path = $request->file('foto_perfil')->store('fotos_perfil', 'public');
                $data['foto_perfil'] = $path;
            }

            // Si se está cambiando la contraseña
            if ($request->has('nueva_contrasena')) {
                // Verificar contraseña actual
                if (!Hash::check($request->contrasena_actual, $usuario->contrasena)) {
                    return response()->json([
                        'error' => 'La contraseña actual es incorrecta',
                        'status' => 'error'
                    ], 422);
                }

                $data['contrasena'] = Hash::make($request->nueva_contrasena);
            }

            $usuario->update($data);

            return response()->json([
                'mensaje' => 'Perfil actualizado correctamente',
                'usuario' => [
                    'id' => $usuario->id,
                    'nombre_usuario' => $usuario->nombre_usuario,
                    'correo' => $usuario->correo,
                    'reputacion' => $usuario->reputacion,
                    'creado_en' => $usuario->creado_en,
                    'foto_perfil_url' => $usuario->foto_perfil_url,
                ],
                'status' => 'success'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error actualizando perfil: ' . $e->getMessage());

            return response()->json([
                'error' => 'Error al actualizar el perfil',
                'status' => 'error'
            ], 500);
        }
    }

    /**
     * Eliminar foto de perfil
     */
    public function eliminarFotoPerfil(Request $request)
    {
        try {
            $usuario = $request->user();

            if ($usuario->foto_perfil) {
                // Eliminar archivo físico
                if (Storage::exists($usuario->foto_perfil)) {
                    Storage::delete($usuario->foto_perfil);
                }

                // Eliminar referencia en la base de datos
                $usuario->update(['foto_perfil' => null]);

                return response()->json([
                    'mensaje' => 'Foto de perfil eliminada correctamente',
                    'usuario' => [
                        'id' => $usuario->id,
                        'nombre_usuario' => $usuario->nombre_usuario,
                        'correo' => $usuario->correo,
                        'reputacion' => $usuario->reputacion,
                        'creado_en' => $usuario->creado_en,
                        'foto_perfil_url' => $usuario->foto_perfil_url,
                    ],
                    'status' => 'success'
                ], 200);
            }

            return response()->json([
                'error' => 'No hay foto de perfil para eliminar',
                'status' => 'error'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Error eliminando foto de perfil: ' . $e->getMessage());

            return response()->json([
                'error' => 'Error al eliminar la foto de perfil',
                'status' => 'error'
            ], 500);
        }
    }
}
