<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guia extends Model
{
    protected $table = 'guias';
    protected $fillable = ['videojuego', 'usuario_id', 'titulo', 'contenido'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
