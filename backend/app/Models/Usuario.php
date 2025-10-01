<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'nombre_usuario',
        'correo',
        'contrasena',
        'reputacion',
    ];

    protected $hidden = [
        'contrasena',
        'remember_token'
    ];

    public function reputaciones()
    {
        return $this->hasMany(RegistroReputacion::class, 'usuario_id');
    }

    public function logros()
    {
        return $this->belongsToMany(Logro::class, 'logros_usuario', 'usuario_id', 'logro_id')
                    ->withPivot('desbloqueado_en');
    }
}


