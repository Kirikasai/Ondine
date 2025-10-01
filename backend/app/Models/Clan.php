<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clan extends Model
{
    protected $table = 'clanes';
    protected $fillable = ['nombre', 'descripcion', 'creado_por'];

    public function miembros()
    {
        return $this->hasMany(MiembroClan::class, 'clan_id');
    }
}
