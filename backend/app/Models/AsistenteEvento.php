<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AsistenteEvento extends Model
{
    protected $table = 'asistentes_evento';
    protected $fillable = ['evento_id', 'usuario_id', 'estado'];

    public function evento()
    {
        return $this->belongsTo(Evento::class, 'evento_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
