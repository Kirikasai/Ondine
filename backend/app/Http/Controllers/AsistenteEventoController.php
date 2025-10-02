<?php

namespace App\Http\Controllers;

use App\Models\AsistenteEvento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AsistenteEventoController extends Controller
{
    // Ver asistentes de un evento
    public function index($eventoId)
    {
        return AsistenteEvento::where('evento_id', $eventoId)->with('usuario')->get();
    }

    public function store(Request $request, $eventoId)
    {
        $request->validate([
            'estado' => 'in:asistire,interesado,no_asistire'
        ]);

        $asistente = AsistenteEvento::updateOrCreate(
            [
                'evento_id' => $eventoId,
                'usuario_id' => Auth::id()
            ],
            [
                'estado' => $request->estado ?? 'asistire'
            ]
        );

        return response()->json($asistente, 201);
    }
}

