<?php
namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\ComentarioBlog;
use App\Models\LikeBlog;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    // Público: Ver todos los blogs con paginación
    public function index(Request $request)
    {
        try {
            $query = Blog::with('usuario')->orderBy('creado_en', 'desc');

            // Búsqueda
            if ($request->has('buscar') && $request->buscar != '') {
                $query->where('titulo', 'LIKE', "%{$request->buscar}%")
                      ->orWhere('contenido', 'LIKE', "%{$request->buscar}%")
                      ->orWhere('etiquetas', 'LIKE', "%{$request->buscar}%");
            }

            // Filtro por etiquetas
            if ($request->has('etiqueta') && $request->etiqueta != '') {
                $query->where('etiquetas', 'LIKE', "%{$request->etiqueta}%");
            }

            // Filtro por usuario
            if ($request->has('usuario_id') && $request->usuario_id != '') {
                $query->where('usuario_id', $request->usuario_id);
            }

            $blogs = $query->paginate(10);

            return response()->json([
                'blogs' => $blogs,
                'estadisticas' => [
                    'total' => Blog::count(),
                    'recientes' => Blog::where('creado_en', '>=', now()->subDays(7))->count()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al cargar los blogs',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }

    // Público: Ver blog específico
    public function show($id)
    {
        try {
            $blog = Blog::with('usuario')->findOrFail($id);

            return response()->json([
                'blog' => $blog,
                'usuario' => $blog->usuario,
                'etiquetas' => $blog->etiquetas ? explode(',', $blog->etiquetas) : []
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Blog no encontrado',
                'detalles' => $e->getMessage()
            ], 404);
        }
    }

    // Protegido: Crear blog
    public function store(Request $request)
    {
        // Verificar autenticación
        if (!Auth::check()) {
            return response()->json(['error' => 'No autorizado'], 401);
        }

        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string|max:255',
            'contenido' => 'required|string|min:100',
            'etiquetas' => 'nullable|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Error de validación',
                'detalles' => $validator->errors()
            ], 422);
        }

        try {
            $blog = Blog::create([
                'usuario_id' => Auth::id(),
                'titulo' => $request->titulo,
                'contenido' => $request->contenido,
                'etiquetas' => $request->etiquetas,
                'creado_en' => now()
            ]);

            // Cargar relación de usuario para la respuesta
            $blog->load('usuario');

            return response()->json([
                'mensaje' => 'Blog creado exitosamente',
                'blog' => $blog
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear el blog',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }

    // Protegido: Actualizar blog
    public function update(Request $request, $id)
    {
        try {
            $blog = Blog::findOrFail($id);

            // Verificar propiedad
            if ($blog->usuario_id !== Auth::id()) {
                return response()->json([
                    'error' => 'No autorizado para editar este blog'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'titulo' => 'required|string|max:255',
                'contenido' => 'required|string|min:100',
                'etiquetas' => 'nullable|string|max:255'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'error' => 'Error de validación',
                    'detalles' => $validator->errors()
                ], 422);
            }

            $blog->update([
                'titulo' => $request->titulo,
                'contenido' => $request->contenido,
                'etiquetas' => $request->etiquetas
            ]);

            $blog->load('usuario');

            return response()->json([
                'mensaje' => 'Blog actualizado exitosamente',
                'blog' => $blog
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al actualizar el blog',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }

    // Protegido: Eliminar blog
    public function destroy($id)
    {
        try {
            $blog = Blog::findOrFail($id);

            if ($blog->usuario_id !== Auth::id()) {
                return response()->json([
                    'error' => 'No autorizado para eliminar este blog'
                ], 403);
            }

            $blog->delete();

            return response()->json([
                'mensaje' => 'Blog eliminado exitosamente'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar el blog',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }

    // SISTEMA DE COMENTARIOS

    // Obtener comentarios de un blog
    public function getComentarios($id)
    {
        try {
            $comentarios = ComentarioBlog::with('usuario')
                ->where('blog_id', $id)
                ->orderBy('creado_en', 'asc')
                ->get();

            return response()->json($comentarios);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al cargar comentarios',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }

    // Crear comentario
    public function crearComentario(Request $request, $id)
    {
        // Verificar autenticación
        if (!Auth::check()) {
            return response()->json(['error' => 'No autorizado'], 401);
        }

        $validator = Validator::make($request->all(), [
            'contenido' => 'required|string|min:1|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Error de validación',
                'detalles' => $validator->errors()
            ], 422);
        }

        try {
            // Verificar que el blog existe
            Blog::findOrFail($id);

            $comentario = ComentarioBlog::create([
                'blog_id' => $id,
                'usuario_id' => Auth::id(),
                'contenido' => $request->contenido,
                'creado_en' => now()
            ]);

            // Cargar relación de usuario para la respuesta
            $comentario->load('usuario');

            return response()->json([
                'mensaje' => 'Comentario publicado',
                'comentario' => $comentario
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al publicar comentario',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }

    // Eliminar comentario
    public function eliminarComentario($blogId, $comentarioId)
    {
        // Verificar autenticación
        if (!Auth::check()) {
            return response()->json(['error' => 'No autorizado'], 401);
        }

        try {
            $comentario = ComentarioBlog::findOrFail($comentarioId);

            // Verificar que el comentario pertenezca al blog
            if ($comentario->blog_id != $blogId) {
                return response()->json(['error' => 'Comentario no encontrado'], 404);
            }

            // Verificar permisos (solo el dueño del comentario puede eliminarlo)
            if ($comentario->usuario_id !== Auth::id()) {
                return response()->json(['error' => 'No autorizado'], 403);
            }

            $comentario->delete();

            return response()->json(['mensaje' => 'Comentario eliminado']);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al eliminar comentario',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }

    // SISTEMA DE LIKES

    // Dar like a un blog
    public function darLike($id)
    {
        // Verificar autenticación
        if (!Auth::check()) {
            return response()->json(['error' => 'No autorizado'], 401);
        }

        try {
            // Verificar que el blog existe
            $blog = Blog::findOrFail($id);

            // Verificar si ya dio like
            $likeExistente = LikeBlog::where('blog_id', $id)
                ->where('usuario_id', Auth::id())
                ->first();

            if ($likeExistente) {
                // Quitar like
                $likeExistente->delete();
                $accion = 'like_removed';
            } else {
                // Dar like
                LikeBlog::create([
                    'blog_id' => $id,
                    'usuario_id' => Auth::id(),
                    'creado_en' => now()
                ]);
                $accion = 'like_added';
            }

            // Obtener conteo actualizado de likes
            $likesCount = LikeBlog::where('blog_id', $id)->count();

            return response()->json([
                'accion' => $accion,
                'likes_count' => $likesCount,
                'user_liked' => $accion === 'like_added'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al procesar like',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }

    // Obtener información de likes
    public function getLikesInfo($id)
    {
        try {
            $likesCount = LikeBlog::where('blog_id', $id)->count();

            $userLiked = false;
            if (Auth::check()) {
                $userLiked = LikeBlog::where('blog_id', $id)
                    ->where('usuario_id', Auth::id())
                    ->exists();
            }

            return response()->json([
                'likes_count' => $likesCount,
                'user_liked' => $userLiked
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al cargar información de likes',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }

    // MÉTODOS ADICIONALES

    // Obtener blogs del usuario autenticado
    public function misBlogs()
    {
        // Verificar autenticación
        if (!Auth::check()) {
            return response()->json(['error' => 'No autorizado'], 401);
        }

        try {
            $blogs = Blog::where('usuario_id', Auth::id())
                        ->orderBy('creado_en', 'desc')
                        ->paginate(10);

            return response()->json([
                'blogs' => $blogs,
                'total' => $blogs->total()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al cargar blogs',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }

    // Obtener blogs populares
    public function populares()
    {
        try {
            // Blogs con más likes
            $blogs = Blog::with('usuario')
                        ->withCount('likes')
                        ->orderBy('likes_count', 'desc')
                        ->limit(5)
                        ->get();

            return response()->json($blogs);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al cargar blogs populares',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }

    // Obtener etiquetas populares
    public function etiquetasPopulares()
    {
        try {
            $etiquetas = Blog::whereNotNull('etiquetas')
                            ->select('etiquetas')
                            ->get()
                            ->flatMap(function ($blog) {
                                return $blog->etiquetas ? explode(',', $blog->etiquetas) : [];
                            })
                            ->map(function ($etiqueta) {
                                return trim($etiqueta);
                            })
                            ->filter()
                            ->countBy()
                            ->sortDesc()
                            ->take(10);

            return response()->json($etiquetas);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al cargar etiquetas',
                'detalles' => $e->getMessage()
            ], 500);
        }
    }
}
