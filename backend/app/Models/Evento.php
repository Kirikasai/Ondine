<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    protected $table = 'eventos';
    public $timestamps = false;
    const CREATED_AT = 'creado_en';
    const UPDATED_AT = null;

    protected $fillable = [
        'titulo',
        'descripcion',
        'fecha_evento',
        'creado_por'
    ];

    public function asistentes()
    {
        return $this->hasMany(AsistenteEvento::class, 'evento_id');
    }

    public function creador()
    {
        return $this->belongsTo(Usuario::class, 'creado_por');
    }
}
