<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Foro extends Model
{
    protected $table = 'foros';
    protected $fillable = ['titulo', 'slug', 'descripcion'];

    public function hilos()
    {
        return $this->hasMany(Hilo::class, 'foro_id');
    }
}
