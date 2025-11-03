<?php
namespace App\Http\Controllers;

use App\Models\Foro;
use App\Models\Hilo;
use App\Models\Respuesta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForoController extends Controller
{
    // Público: Ver todos los foros
    public function index()
    {
        return Foro::all();
    }

    // Público: Ver foro específico
    public function show($id)
    {
        return Foro::with(['hilos.usuario', 'hilos.respuestas'])->findOrFail($id);
    }

    // Público: Ver hilos de un foro
    public function hilos($foroId)
    {
        return Hilo::where('foro_id', $foroId)
                   ->with(['usuario', 'respuestas.usuario'])
                   ->orderBy('creado_en', 'desc')
                   ->get();
    }

    // Protegido: Crear hilo
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

    // Protegido: Responder a hilo
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
