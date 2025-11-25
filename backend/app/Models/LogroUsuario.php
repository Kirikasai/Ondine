<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogroUsuario extends Model
{
    protected $table = 'logros_usuarios';

    public $timestamps = true;
    const CREATED_AT = 'desbloqueado_en';
    const UPDATED_AT = null;

    protected $fillable = [
        'usuario_id',
        'logro_id',
        'desbloqueado_en'
    ];

    protected $casts = [
        'desbloqueado_en' => 'datetime'
    ];

    public function logro()
    {
        return $this->belongsTo(Logro::class, 'logro_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
