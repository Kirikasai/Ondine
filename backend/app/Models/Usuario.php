<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'usuarios';

    // Tu tabla tiene timestamps (creado_en)
    public $timestamps = true;
    const CREATED_AT = 'creado_en';
    const UPDATED_AT = null;

    protected $fillable = [
        'nombre_usuario',
        'correo',
        'contrasena',
        'reputacion',
        'remember_token'
    ];

    protected $hidden = [
        'contrasena',
        'remember_token'
    ];

    protected $casts = [
        'reputacion' => 'integer',
        'creado_en' => 'datetime',
    ];

    public function getAuthPassword()
    {
        return $this->contrasena;
    }

    public function getAuthIdentifierName()
    {
        return 'id';
    }

    public function getAuthIdentifier()
    {
        return $this->getKey();
    }

    public function blogs()
    {
        return $this->hasMany(Blog::class, 'usuario_id');
    }

    public function guias()
    {
        return $this->hasMany(Guia::class, 'usuario_id');
    }

    public function hilos()
    {
        return $this->hasMany(Hilo::class, 'usuario_id');
    }

    public function respuestas()
    {
        return $this->hasMany(Respuesta::class, 'usuario_id');
    }

    public function transmisiones()
    {
        return $this->hasMany(Transmision::class, 'usuario_id');
    }

    public function favoritos()
    {
        return $this->hasMany(Favorito::class, 'usuario_id');
    }

    public function clanesCreados()
    {
        return $this->hasMany(Clan::class, 'creado_por');
    }

    public function miembrosClan()
    {
        return $this->hasMany(MiembroClan::class, 'usuario_id');
    }

    public function eventosCreados()
    {
        return $this->hasMany(Evento::class, 'creado_por');
    }

    public function asistenciasEvento()
    {
        return $this->hasMany(AsistenteEvento::class, 'usuario_id');
    }

    public function logros()
    {
        return $this->belongsToMany(Logro::class, 'logros_usuarios', 'usuario_id', 'logro_id')
                    ->withPivot('desbloqueado_en')
                    ->withTimestamps('desbloqueado_en');
    }

    public function registrosReputacion()
    {
        return $this->hasMany(RegistroReputacion::class, 'usuario_id');
    }

    /**
     * Verificar si el usuario es miembro de un clan específico
     */
    public function esMiembroDeClan($clanId)
    {
        return $this->miembrosClan()->where('clan_id', $clanId)->exists();
    }

    /**
     * Verificar si el usuario es líder de un clan específico
     */
    public function esLiderDeClan($clanId)
    {
        return $this->miembrosClan()
                    ->where('clan_id', $clanId)
                    ->where('rol', 'lider')
                    ->exists();
    }

    /**
     * Obtener todos los clanes del usuario
     */
    public function clanes()
    {
        return $this->belongsToMany(Clan::class, 'miembros_clan', 'usuario_id', 'clan_id')
                    ->withPivot('rol', 'unido_en');
    }

    /**
     * Obtener eventos a los que el usuario asistirá
     */
    public function eventosAsistire()
    {
        return $this->asistenciasEvento()
                    ->where('estado', 'asistire')
                    ->with('evento');
    }

    /**
     * Incrementar reputación del usuario
     */
    public function incrementarReputacion($puntos, $accion)
    {
        $this->reputacion += $puntos;
        $this->save();

        // Registrar en el historial
        $this->registrosReputacion()->create([
            'accion' => $accion,
            'puntos' => $puntos
        ]);
    }

    public function getFotoPerfilUrlAttribute()
{
    if ($this->foto_perfil) {
        // Si es una URL completa
        if (filter_var($this->foto_perfil, FILTER_VALIDATE_URL)) {
            return $this->foto_perfil;
        }

        // Si es un path relativo, asumimos que está en storage
        return asset('storage/' . $this->foto_perfil);
    }

    // Foto por defecto basada en las iniciales del nombre
    return null;
}

/**
 * Obtener las iniciales para el avatar por defecto
 */
public function getInicialesAttribute()
{
    $nombres = explode(' ', $this->nombre_usuario);
    $iniciales = '';

    if (count($nombres) >= 2) {
        $iniciales = strtoupper(substr($nombres[0], 0, 1) . substr($nombres[1], 0, 1));
    } else {
        $iniciales = strtoupper(substr($this->nombre_usuario, 0, 2));
    }

    return $iniciales;
}
}
