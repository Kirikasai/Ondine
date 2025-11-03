<?php
// app/Models/Usuario.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';
    public $timestamps = false; // ✅ Desactivar timestamps automáticos
    const CREATED_AT = 'creado_en';
    const UPDATED_AT = null;

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

    public function getAuthPassword()
    {
        return $this->contrasena;
    }

    // Relaciones...
}
