<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComentarioBlog extends Model
{
    use HasFactory;

    protected $table = 'comentarios_blogs';

    // Desactivar timestamps automáticos
    public $timestamps = false;

    protected $fillable = [
        'blog_id',
        'usuario_id',
        'contenido'
    ];

    protected $casts = [
        'creado_en' => 'datetime'
    ];

    // Relación con el blog
    public function blog()
    {
        return $this->belongsTo(Blog::class, 'blog_id');
    }

    // Relación con el usuario
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
