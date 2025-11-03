<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Clan extends Model
{
    protected $table = 'clanes';
    public $timestamps = false;
    const CREATED_AT = 'creado_en';
    const UPDATED_AT = null;

    protected $fillable = [
        'nombre',
        'descripcion',
        'creado_por'
    ];

    public function miembros()
    {
        return $this->hasMany(MiembroClan::class, 'clan_id');
    }
}
