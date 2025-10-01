<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Respuesta extends Model
{
    protected $table = 'respuestas';
    protected $fillable = ['hilo_id', 'usuario_id', 'cuerpo'];

    public function hilo()
    {
        return $this->belongsTo(Hilo::class, 'hilo_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
