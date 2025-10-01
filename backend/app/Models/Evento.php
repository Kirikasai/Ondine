<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    protected $table = 'eventos';
    protected $fillable = ['titulo', 'descripcion', 'fecha_evento', 'creado_por'];

    public function asistentes()
    {
        return $this->hasMany(AsistenteEvento::class, 'evento_id');
    }
}
