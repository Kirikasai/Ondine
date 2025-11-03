<?php
// app/Models/MiembroClan.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MiembroClan extends Model
{
    protected $table = 'miembros_clan';
    public $timestamps = false; 
    const CREATED_AT = 'unido_en';
    const UPDATED_AT = null;

    protected $fillable = [
        'clan_id',
        'usuario_id',
        'rol'
    ];

    public function clan()
    {
        return $this->belongsTo(Clan::class, 'clan_id');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_id');
    }
}
