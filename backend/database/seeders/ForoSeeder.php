<?php
// database/seeders/ForoSeeder.php
namespace Database\Seeders;

use App\Models\Foro;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class ForoSeeder extends Seeder
{
    public function run()
    {
        DB::table('foros')->delete();

        $foros = [
            [
                'titulo' => 'General Gaming',
                'slug' => Str::slug('General Gaming'),
                'descripcion' => 'Discusiones generales sobre videojuegos, noticias y temas diversos del mundo gaming.',
                'creado_en' => now()->subMonths(6)
            ],
            [
                'titulo' => 'Noticias y Rumores',
                'slug' => Str::slug('Noticias y Rumores'),
                'descripcion' => 'Últimas noticias, anuncios y rumores del mundo de los videojuegos.',
                'creado_en' => now()->subMonths(5)
            ],
            [
                'titulo' => 'Búsqueda de Grupo',
                'slug' => Str::slug('Busqueda de Grupo'),
                'descripcion' => 'Encuentra compañeros para tus juegos favoritos y forma equipos.',
                'creado_en' => now()->subMonths(4)
            ],
            [
                'titulo' => 'Soporte Técnico',
                'slug' => Str::slug('Soporte Tecnico'),
                'descripcion' => 'Ayuda con problemas técnicos, configuración y optimización de juegos.',
                'creado_en' => now()->subMonths(3)
            ],
            [
                'titulo' => 'Desarrollo de Juegos',
                'slug' => Str::slug('Desarrollo de Juegos'),
                'descripcion' => 'Comunidad para desarrolladores indie y aspirantes a creadores de juegos.',
                'creado_en' => now()->subMonths(2)
            ],
            [
                'titulo' => 'eSports y Competitivo',
                'slug' => Str::slug('eSports y Competitivo'),
                'descripcion' => 'Discusiones sobre torneos, equipos profesionales y juego competitivo.',
                'creado_en' => now()->subMonths(1)
            ]
        ];

        foreach ($foros as $foro) {
            Foro::create($foro);
        }

        $this->command->info('✅ 6 foros de ejemplo creados!');
    }
}
