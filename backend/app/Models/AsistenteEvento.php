<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AsistenteEvento extends Model
{
    protected $table = 'asistentes_evento';
    public $timestamps = false;
    const CREATED_AT = 'creado_en';
    const UPDATED_AT = null;

    protected $fillable = [
        'evento_id',
        'usuario_id',
        'estado'
    ];

    public function evento()
    {
        return $this->belongsTo(Evento::class, 'evento_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
