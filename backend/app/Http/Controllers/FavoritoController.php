<?php
namespace App\Http\Controllers;

use App\Models\Favorito;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoritoController extends Controller
{
    /**
     * Obtener todos los favoritos del usuario autenticado
     */
    public function index(Request $request)
    {
        try {
            $usuario = Auth::user();

            $favoritos = Favorito::deUsuario($usuario->id)
                ->recientes()
                ->get();

            return response()->json([
                'favoritos' => $favoritos,
                'total' => $favoritos->count(),
                'status' => 'success'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al cargar favoritos',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Crear un nuevo favorito
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'titulo' => 'required|string|max:255',
                'enlace' => 'required|url|max:500',
                'resumen' => 'nullable|string',
                'imagen' => 'nullable|url|max:500'
            ]);

            $usuario = Auth::user();

            $favorito = Favorito::create([
                'usuario_id' => $usuario->id,
                'titulo' => $request->titulo,
                'enlace' => $request->enlace,
                'resumen' => $request->resumen,
                'imagen' => $request->imagen
            ]);

            return response()->json([
                'mensaje' => 'Favorito agregado correctamente',
                'favorito' => $favorito,
                'status' => 'success'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear favorito',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mostrar un favorito específico
     */
    public function show($id)
    {
        try {
            $usuario = Auth::user();

            $favorito = Favorito::deUsuario($usuario->id)
                ->findOrFail($id);

            return response()->json([
                'favorito' => $favorito,
                'status' => 'success'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Favorito no encontrado'
            ], 404);
        }
    }

    /**
     * Actualizar un favorito
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'titulo' => 'sometimes|string|max:255',
                'enlace' => 'sometimes|url|max:500',
                'resumen' => 'nullable|string',
                'imagen' => 'nullable|url|max:500'
            ]);

            $usuario = Auth::user();

            $favorito = Favorito::deUsuario($usuario->id)
                ->findOrFail($id);

            $favorito->update($request->all());

            return response()->json([
                'mensaje' => 'Favorito actualizado correctamente',
                'favorito' => $favorito,
                'status' => 'success'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar favorito'
            ], 500);
        }
    }

    /**
     * Eliminar un favorito
     */
    public function destroy($id)
    {
        try {
            $usuario = Auth::user();

            $favorito = Favorito::deUsuario($usuario->id)
                ->findOrFail($id);

            $favorito->delete();

            return response()->json([
                'mensaje' => 'Favorito eliminado correctamente',
                'status' => 'success'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar favorito'
            ], 500);
        }
    }

    /**
     * Buscar favoritos por título
     */
    public function buscar(Request $request)
    {
        try {
            $request->validate([
                'q' => 'required|string|min:2'
            ]);

            $usuario = Auth::user();

            $favoritos = Favorito::deUsuario($usuario->id)
                ->porTitulo($request->q)
                ->recientes()
                ->get();

            return response()->json([
                'favoritos' => $favoritos,
                'total' => $favoritos->count(),
                'termino' => $request->q,
                'status' => 'success'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error en la búsqueda'
            ], 500);
        }
    }
}
