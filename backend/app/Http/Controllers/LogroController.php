<?php

namespace App\Http\Controllers;

use App\Models\Logro;
use App\Models\LogroUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogroController extends Controller
{
    public function index()
    {
        return Logro::all();
    }

    public function asignar(Request $request)
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

