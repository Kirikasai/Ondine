<?php
namespace App\Http\Controllers;

use App\Models\Respuesta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RespuestaController extends Controller
{
    public function index($hiloId)
    {
        return Respuesta::where('hilo_id', $hiloId)
                       ->with('usuario')
                       ->orderBy('creado_en', 'asc')
                       ->get();
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
