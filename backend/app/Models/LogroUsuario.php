<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogroUsuario extends Model
{
    protected $table = 'logros_usuario';
    protected $fillable = ['usuario_id', 'logro_id', 'desbloqueado_en'];

    public function logro()
    {
        return $this->belongsTo(Logro::class, 'logro_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
