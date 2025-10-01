<?php

namespace App\Http\Controllers;

use App\Models\Clan;
use App\Models\MiembroClan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClanController extends Controller
{
    public function index() { return Clan::with('miembros')->get(); }

    public function store(Request $request) {
        $clan = Clan::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'creado_por' => Auth::id()
        ]);
        MiembroClan::create([
            'clan_id' => $clan->id,
            'usuario_id' => Auth::id(),
            'rol' => 'lider'
        ]);
        return $clan;
    }

    public function unirse($id) {
        return MiembroClan::create([
            'clan_id' => $id,
            'usuario_id' => Auth::id(),
            'rol' => 'miembro'
        ]);
    }
}

