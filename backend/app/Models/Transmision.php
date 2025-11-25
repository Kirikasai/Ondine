<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transmision extends Model
{
    protected $table = 'transmisiones';

    public $timestamps = true;
    const CREATED_AT = 'creado_en';
    const UPDATED_AT = null;

    protected $fillable = [
        'usuario_id',
        'plataforma',
        'canal_url',
        'en_vivo'
    ];

    protected $casts = [
        'en_vivo' => 'boolean',
        'creado_en' => 'datetime'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
