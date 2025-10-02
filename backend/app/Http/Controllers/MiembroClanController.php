<?php

namespace App\Http\Controllers;

use App\Models\MiembroClan;
use Illuminate\Support\Facades\Auth;

class MiembroClanController extends Controller
{
    // Ver todos los miembros de un clan
    public function index($clanId)
    {
        return MiembroClan::where('clan_id', $clanId)->with('usuario')->get();
    }

    // Unirse a un clan
    public function unirse($clanId)
    {
        $existe = MiembroClan::where('clan_id', $clanId)
                             ->where('usuario_id', Auth::id())
                             ->first();

        if ($existe) {
            return response()->json(['mensaje' => 'Ya eres miembro de este clan'], 400);
        }

        $miembro = MiembroClan::create([
            'clan_id' => $clanId,
            'usuario_id' => Auth::id(),
            'rol' => 'miembro'
        ]);

        return response()->json($miembro, 201);
    }
}
