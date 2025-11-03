<?php
// database/seeders/BlogSeeder.php
namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BlogSeeder extends Seeder
{
    public function run()
    {
        DB::table('blogs')->delete();

        $users = Usuario::all();

        $blogs = [
            [
                'usuario_id' => $users[0]->id,
                'titulo' => 'Mi experiencia de 100 horas en Elden Ring: Guía para no sufrir',
                'contenido' => 'Después de completar Elden Ring con más de 100 horas de juego, quiero compartir mis consejos para los nuevos jugadores que se aventuran en las Tierras Intermedias.',
                'etiquetas' => 'eldenring,rpg,fromsoftware,guia,consejos',
                'creado_en' => now()->subDays(5)
            ],
            [
                'usuario_id' => $users[1]->id,
                'titulo' => 'Cómo mejorar tu stream en Twitch: Lecciones de 2 años transmitiendo',
                'contenido' => 'Después de 2 años haciendo streams diarios y creciendo hasta 5,000 seguidores, he aprendido algunas lecciones valiosas que quiero compartir.',
                'etiquetas' => 'twitch,streaming,contenido,crecimiento,consejos',
                'creado_en' => now()->subDays(3)
            ],
            [
                'usuario_id' => $users[2]->id,
                'titulo' => 'Análisis completo: Baldur\'s Gate 3 vs Divinity Original Sin 2',
                'contenido' => 'Como fanático de Larian Studios desde hace años, he completado ambos juegos múltiples veces y quiero compartir un análisis comparativo detallado.',
                'etiquetas' => 'baldursgate3,divinity,rpg,analisis,comparacion',
                'creado_en' => now()->subDays(1)
            ]
        ];

        foreach ($blogs as $blog) {
            Blog::create($blog);
        }

        $this->command->info('✅ 3 blogs de ejemplo creados!');
    }
}
