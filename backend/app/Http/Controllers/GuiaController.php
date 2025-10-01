<?php

namespace App\Http\Controllers;

use App\Models\Guia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GuiaController extends Controller
{
    public function index() { return Guia::with('usuario')->get(); }

    public function store(Request $request) {
        return Guia::create([
            'videojuego' => $request->videojuego,
            'usuario_id' => Auth::id(),
            'titulo' => $request->titulo,
            'contenido' => $request->contenido
        ]);
    }
}

