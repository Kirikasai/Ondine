<?php

namespace App\Http\Controllers;

use App\Models\LogroUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogroUsuarioController extends Controller
{
    // Ver logros desbloqueados del usuario
    public function index()
    {
        return LogroUsuario::where('usuario_id', Auth::id())->with('logro')->get();
    }

    // Asignar logro a usuario
    public function store(Request $request)
    {
        $request->validate([
            'logro_id' => 'required|exists:logros,id'
        ]);

        $existe = LogroUsuario::where('usuario_id', Auth::id())
                              ->where('logro_id', $request->logro_id)
                              ->first();

        if ($existe) {
            return response()->json(['mensaje' => 'Logro ya desbloqueado'], 400);
        }

        $logroUsuario = LogroUsuario::create([
            'usuario_id' => Auth::id(),
            'logro_id' => $request->logro_id,
            'desbloqueado_en' => now()
        ]);

        return response()->json($logroUsuario, 201);
    }
}
