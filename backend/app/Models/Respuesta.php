<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Respuesta extends Model
{
    protected $table = 'respuestas';

    public $timestamps = true;
    const CREATED_AT = 'creado_en';
    const UPDATED_AT = null;

    protected $fillable = [
        'hilo_id',
        'usuario_id',
        'cuerpo'
    ];

    protected $casts = [
        'creado_en' => 'datetime'
    ];

    public function hilo()
    {
        return $this->belongsTo(Hilo::class, 'hilo_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
