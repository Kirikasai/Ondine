<?php
namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
    public function index() { return Blog::with('usuario')->get(); }

    public function store(Request $request) {
        return Blog::create([
            'usuario_id' => Auth::id(),
            'titulo' => $request->titulo,
            'contenido' => $request->contenido,
            'etiquetas' => $request->etiquetas
        ]);
    }
}

