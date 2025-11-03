<?php
// database/seeders/DatabaseSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            UserSeeder::class,
            ForoSeeder::class,
            BlogSeeder::class,
            HiloSeeder::class,
            RespuestaSeeder::class,
            EventoSeeder::class,
            // Agrega más seeders aquí según necesites
        ]);
    }
}
