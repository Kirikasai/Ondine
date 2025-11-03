<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hilo extends Model
{
    protected $table = 'hilos';
    public $timestamps = false;
    const CREATED_AT = 'creado_en';
    const UPDATED_AT = null;

    protected $fillable = [
        'foro_id',
        'usuario_id',
        'titulo',
        'cuerpo'
    ];

    public function foro()
    {
        return $this->belongsTo(Foro::class, 'foro_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }

    public function respuestas()
    {
        return $this->hasMany(Respuesta::class, 'hilo_id');
    }
}
