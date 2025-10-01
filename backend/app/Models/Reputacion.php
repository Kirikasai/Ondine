<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reputacion extends Model
{
    protected $table = 'logros';
    protected $fillable = ['nombre', 'descripcion', 'puntos_requeridos', 'icono'];

    public function usuarios()
    {
        return $this->belongsToMany(Usuario::class, 'logros_usuario', 'logro_id', 'usuario_id')
                    ->withPivot('desbloqueado_en');
    }
}
