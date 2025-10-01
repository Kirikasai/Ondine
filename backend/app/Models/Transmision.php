<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transmision extends Model
{
    protected $table = 'transmisiones';
    protected $fillable = ['usuario_id', 'plataforma', 'canal_url', 'en_vivo'];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
