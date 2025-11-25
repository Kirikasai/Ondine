<?php
namespace App\Http\Controllers;

use App\Models\Transmision;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransmisionController extends Controller
{
    public function index()
    {
        $transmisiones = Transmision::with('usuario')->get();
        return response()->json($transmisiones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'plataforma' => 'required|in:twitch,youtube',
            'canal_url' => 'required|url',
            'en_vivo' => 'boolean'
        ]);

        $transmision = Transmision::create([
            'usuario_id' => Auth::id(),
            'plataforma' => $request->plataforma,
            'canal_url' => $request->canal_url,
            'en_vivo' => $request->en_vivo ?? false
        ]);

        return response()->json($transmision, 201);
    }

    public function update(Request $request, $id)
    {
        $transmision = Transmision::where('usuario_id', Auth::id())->findOrFail($id);

        $request->validate([
            'plataforma' => 'in:twitch,youtube',
            'canal_url' => 'url',
            'en_vivo' => 'boolean'
        ]);

        $transmision->update($request->all());

        return response()->json($transmision);
    }

    public function destroy($id)
    {
        $transmision = Transmision::where('usuario_id', Auth::id())->findOrFail($id);
        $transmision->delete();

        return response()->json(null, 204);
    }
}
