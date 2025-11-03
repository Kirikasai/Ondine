<?php
namespace App\Http\Controllers;

use App\Models\Evento;
use App\Models\AsistenteEvento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventoController extends Controller
{
    // Público: Ver todos los eventos
    public function index()
    {
        return Evento::with(['asistentes.usuario', 'creador'])
                    ->orderBy('fecha_evento', 'asc')
                    ->get();
    }

    // Público: Ver evento específico
    public function show($id)
    {
        return Evento::with(['asistentes.usuario', 'creador'])->findOrFail($id);
    }

    // Protegido: Crear evento
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:200',
            'descripcion' => 'required|string',
            'fecha_evento' => 'required|date'
        ]);

        return Evento::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'fecha_evento' => $request->fecha_evento,
            'creado_por' => Auth::id()
        ]);
    }

    public function asistir($id, Request $request)
    {
        $request->validate([
            'estado' => 'in:asistire,interesado,no_asistire'
        ]);

        $asistente = AsistenteEvento::updateOrCreate(
            [
                'evento_id' => $id,
                'usuario_id' => Auth::id()
            ],
            [
                'estado' => $request->estado ?? 'asistire'
            ]
        );

        return response()->json($asistente, 201);
    }

    public function destroy($id)
    {
        $evento = Evento::findOrFail($id);

        if ($evento->creado_por !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $evento->delete();
        return response()->json(['mensaje' => 'Evento eliminado']);
    }
}
