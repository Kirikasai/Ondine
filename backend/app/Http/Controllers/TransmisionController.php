<?php
namespace App\Http\Controllers;

use App\Models\Transmision;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransmisionController extends Controller
{
    public function index()
    {
        return Transmision::with('usuario')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'plataforma' => 'required|in:twitch,youtube',
            'canal_url' => 'required|url'
        ]);

        $transmision = Transmision::create([
            'usuario_id' => Auth::id(),
            'plataforma' => $request->plataforma,
            'canal_url' => $request->canal_url,
            'en_vivo' => false
        ]);

        return response()->json($transmision, 201);
    }
}
