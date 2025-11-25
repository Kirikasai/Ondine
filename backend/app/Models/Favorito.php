<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Favorito extends Model
{
    protected $table = 'favoritos';

    public $timestamps = true;
    const CREATED_AT = 'creado_en';
    const UPDATED_AT = null;

    protected $fillable = [
        'usuario_id',
        'titulo',
        'enlace',
        'resumen',
        'imagen'
    ];

    protected $casts = [
        'creado_en' => 'datetime'
    ];

    /**
     * Relación con el usuario
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    /**
     * Scope para buscar favoritos por título
     */
    public function scopePorTitulo($query, $titulo)
    {
        return $query->where('titulo', 'LIKE', "%{$titulo}%");
    }

    /**
     * Scope para favoritos de un usuario específico
     */
    public function scopeDeUsuario($query, $usuarioId)
    {
        return $query->where('usuario_id', $usuarioId);
    }

    /**
     * Scope para ordenar por fecha de creación (más recientes primero)
     */
    public function scopeRecientes($query)
    {
        return $query->orderBy('creado_en', 'desc');
    }

    /**
     * Obtener el dominio del enlace
     */
    public function getDominioAttribute()
    {
        return parse_url($this->enlace, PHP_URL_HOST);
    }

    /**
     * Verificar si el enlace es válido
     */
    public function getEnlaceValidoAttribute()
    {
        return filter_var($this->enlace, FILTER_VALIDATE_URL) !== false;
    }

    /**
     * Obtener imagen por defecto si no hay imagen
     */
    public function getImagenUrlAttribute()
    {
        if ($this->imagen && $this->enlace_valido) {
            return $this->imagen;
        }

        // Imagen por defecto para favoritos
        return 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=200&fit=crop';
    }

    /**
     * Resumen truncado
     */
    public function getResumenCortoAttribute()
    {
        if (!$this->resumen) {
            return 'Sin descripción';
        }

        return strlen($this->resumen) > 100
            ? substr($this->resumen, 0, 100) . '...'
            : $this->resumen;
    }
}
