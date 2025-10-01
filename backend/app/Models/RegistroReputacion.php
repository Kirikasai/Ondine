<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RegistroReputacion extends Model
{
   protected $table = 'registros_reputacion';
    protected $fillable = ['usuario_id', 'accion', 'puntos'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
