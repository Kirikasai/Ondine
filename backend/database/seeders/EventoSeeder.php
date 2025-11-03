<?php
// database/seeders/EventoSeeder.php
namespace Database\Seeders;

use App\Models\Evento;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class EventoSeeder extends Seeder
{
    public function run()
    {
        $users = Usuario::all();

        $eventos = [
            [
                'titulo' => 'Torneo Amateur de Valorant - Copa Ondine',
                'descripcion' => '¡Primer torneo oficial de la comunidad Ondine! Torneo amateur de Valorant abierto a todos los rangos.\n\n**Formato:**\n- Equipos de 5 jugadores\n- Eliminación simple\n- Mapas: Bind, Ascent, Haven\n- Premio: $100 para el equipo ganador + roles especiales en el servidor\n\n**Requisitos:**\n- Cuenta de Riot válida\n- Microfono para comunicación\n- Residencia en LATAM\n\n¡Inscríbanse con sus equipos!',
                'fecha_evento' => now()->addDays(7)->setHour(18)->setMinute(0),
                'creado_por' => $users[0]->id,
                'creado_en' => now()->subDays(3)
            ],
            [
                'titulo' => 'Q&A Especial: Desarrollador Indie de "Cosmic Journey"',
                'descripcion' => 'Charla exclusiva con el desarrollador indie **IndieDev** sobre su próximo juego "Cosmic Journey".\n\n**Temas a cubrir:**\n- Proceso de desarrollo indie\n- Desafíos técnicos y artísticos\n- Lanzamiento en Steam\n- Futuros planes\n\n**Formato:**\n- 30 minutos de presentación\n- 45 minutos de preguntas y respuestas\n- Transmisión en vivo por Twitch\n\n¡Preparen sus preguntas!',
                'fecha_evento' => now()->addDays(3)->setHour(20)->setMinute(0),
                'creado_por' => $users[4]->id,
                'creado_en' => now()->subDays(1)
            ],
            [
                'titulo' => 'Maratón Coop: Deep Rock Galactic',
                'descripcion' => '¡Noche de cooperativo en Deep Rock Galactic! Unámonos para minar, combatir bichos y gritar "Rock and Stone!"\n\n**Detalles:**\n- Evento casual, todos los niveles son bienvenidos\n- Formaremos grupos de 4 jugadores\n- Misiones de dificultad variable\n- Premios simbólicos para mejores momentos\n\n**Requisitos:**\n- Tener el juego en Steam\n- Ganas de divertirse\n\n¡Nos vemos en Hoxxes!',
                'fecha_evento' => now()->addDays(5)->setHour(19)->setMinute(30),
                'creado_por' => $users[3]->id,
                'creado_en' => now()->subDays(2)
            ],
            [
                'titulo' => 'Workshop: Introducción a Godot Engine para Principiantes',
                'descripcion' => '¿Quieres empezar en el desarrollo de juegos? Workshop práctico de introducción a Godot Engine.\n\n**Lo que aprenderás:**\n- Instalación y configuración de Godot\n- Conceptos básicos de GDScript\n- Crear tu primer juego 2D (un simple platformer)\n- Exportar tu juego para diferentes plataformas\n\n**Requisitos:**\n- Conocimientos básicos de programación (no necesariamente en GDScript)\n- Godot Engine instalado\n- Muchas ganas de aprender\n\n**Materiales incluidos:**\n- Assets gratuitos para usar\n- Código de ejemplo\n- Grabación del workshop',
                'fecha_evento' => now()->addDays(10)->setHour(17)->setMinute(0),
                'creado_por' => $users[4]->id,
                'creado_en' => now()->subDays(4)
            ],
            [
                'titulo' => 'Torneo de FIFA 24 - Modalidad 1v1',
                'descripcion' => 'Torneo 1v1 de FIFA 24 para la comunidad hispanohablante. ¡Demuestra que eres el mejor!\n\n**Formato:**\n- Eliminación simple\n- Partidos de 6 minutos por tiempo\n- Equipos: Máximo 4.5 estrellas\n- Conexión: P2P\n\n**Premios:**\n- 1er lugar: $50 + trofeo virtual\n- 2do lugar: $25\n- 3er lugar: $15\n\n**Plataforma:** PC/PS5/Xbox Series (categorías separadas)\n\n¡Inscripciones abiertas!',
                'fecha_evento' => now()->addDays(14)->setHour(16)->setMinute(0),
                'creado_por' => $users[1]->id,
                'creado_en' => now()->subDays(5)
            ]
        ];

        foreach ($eventos as $evento) {
            Evento::create($evento);
        }
    }
}
