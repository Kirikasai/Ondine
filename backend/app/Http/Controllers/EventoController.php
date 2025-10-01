<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use App\Models\AsistenteEvento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventoController extends Controller
{
    public function index() { return Evento::with('asistentes')->get(); }

    public function store(Request $request) {
        return Evento::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'fecha_evento' => $request->fecha_evento,
            'creado_por' => Auth::id()
        ]);
    }

    public function asistir($id, Request $request) {
        return AsistenteEvento::create([
            'evento_id' => $id,
            'usuario_id' => Auth::id(),
            'estado' => $request->estado ?? 'asistire'
        ]);
    }
}

