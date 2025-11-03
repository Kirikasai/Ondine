<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Foro extends Model
{
    protected $table = 'foros';
    public $timestamps = false;
    const CREATED_AT = 'creado_en';
    const UPDATED_AT = null;

    protected $fillable = [
        'titulo',
        'slug',
        'descripcion'
    ];

    public function hilos()
    {
        return $this->hasMany(Hilo::class, 'foro_id');
    }
}
