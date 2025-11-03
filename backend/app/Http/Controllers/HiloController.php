<?php
namespace App\Http\Controllers;

use App\Models\Hilo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HiloController extends Controller
{
    public function show($id)
    {
        return Hilo::with(['usuario', 'respuestas.usuario'])->findOrFail($id);
    }

    public function destroy($id)
    {
        $hilo = Hilo::findOrFail($id);

        if ($hilo->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $hilo->delete();
        return response()->json(['mensaje' => 'Hilo eliminado']);
    }
}
