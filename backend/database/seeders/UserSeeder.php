<?php
// database/seeders/UserSeeder.php
namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Verificar si ya existen usuarios para evitar duplicados
        if (Usuario::count() > 0) {
            echo "Usuarios ya existen, saltando seeder...\n";
            return;
        }

        $users = [
            [
                'nombre_usuario' => 'GamerPro',
                'correo' => 'gamerpro@ondine.com',
                'contrasena' => Hash::make('password123'),
                'reputacion' => 250,
                'creado_en' => now()->subMonths(3)
            ],
            [
                'nombre_usuario' => 'StreamMaster',
                'correo' => 'streamer@ondine.com',
                'contrasena' => Hash::make('password123'),
                'reputacion' => 180,
                'creado_en' => now()->subMonths(2)
            ],
            [
                'nombre_usuario' => 'GuiaExpert',
                'correo' => 'guias@ondine.com',
                'contrasena' => Hash::make('password123'),
                'reputacion' => 320,
                'creado_en' => now()->subMonths(4)
            ],
            [
                'nombre_usuario' => 'EventLover',
                'correo' => 'eventos@ondine.com',
                'contrasena' => Hash::make('password123'),
                'reputacion' => 150,
                'creado_en' => now()->subMonths(1)
            ],
            [
                'nombre_usuario' => 'IndieDev',
                'correo' => 'dev@ondine.com',
                'contrasena' => Hash::make('password123'),
                'reputacion' => 200,
                'creado_en' => now()->subMonths(5)
            ],
            [
                'nombre_usuario' => 'CosmicPlayer',
                'correo' => 'cosmic@ondine.com',
                'contrasena' => Hash::make('password123'),
                'reputacion' => 90,
                'creado_en' => now()->subWeeks(2)
            ],
            [
                'nombre_usuario' => 'TechGuru',
                'correo' => 'tech@ondine.com',
                'contrasena' => Hash::make('password123'),
                'reputacion' => 170,
                'creado_en' => now()->subMonths(6)
            ],
            [
                'nombre_usuario' => 'RetroFan',
                'correo' => 'retro@ondine.com',
                'contrasena' => Hash::make('password123'),
                'reputacion' => 110,
                'creado_en' => now()->subMonths(7)
            ]
        ];

        foreach ($users as $user) {
            Usuario::create($user);
        }

        echo "Usuarios creados exitosamente!\n";
    }
}
