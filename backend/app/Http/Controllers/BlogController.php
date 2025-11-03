<?php
namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
    // Público: Ver todos los blogs
    public function index()
    {
        return Blog::with('usuario')->orderBy('creado_en', 'desc')->get();
    }

    // Público: Ver blog específico
    public function show($id)
    {
        return Blog::with('usuario')->findOrFail($id);
    }

    // Protegido: Crear blog
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
            'etiquetas' => 'nullable|string'
        ]);

        return Blog::create([
            'usuario_id' => Auth::id(),
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
            'etiquetas' => $request->etiquetas
        ]);
    }

    // Protegido: Actualizar blog
    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        if ($blog->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $request->validate([
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string',
            'etiquetas' => 'nullable|string'
        ]);

        $blog->update($request->all());
        return $blog;
    }

    // Protegido: Eliminar blog
    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);

        if ($blog->usuario_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $blog->delete();
        return response()->json(['mensaje' => 'Blog eliminado']);
    }
}
