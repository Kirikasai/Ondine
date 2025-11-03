<?php
// database/seeders/RespuestaSeeder.php
namespace Database\Seeders;

use App\Models\Respuesta;
use App\Models\Hilo;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class RespuestaSeeder extends Seeder
{
    public function run()
    {
        $hilos = Hilo::all();
        $users = Usuario::all();

        $respuestas = [
            // Respuestas al hilo "¿Qué están jugando este fin de semana?"
            [
                'hilo_id' => $hilos[0]->id,
                'usuario_id' => $users[2]->id,
                'cuerpo' => 'Yo voy a seguir con mi partida de Baldur\'s Gate 3. Estoy en el acto 3 y quiero ver todos los finales posibles. La cantidad de opciones es increíble!',
                'creado_en' => now()->subDays(2)->addHours(2)
            ],
            [
                'hilo_id' => $hilos[0]->id,
                'usuario_id' => $users[3]->id,
                'cuerpo' => 'Probablemente Fortnite con amigos y algo de single player por la noche. Estoy pensando en retomar Cyberpunk con la expansión.',
                'creado_en' => now()->subDays(2)->addHours(4)
            ],
            [
                'hilo_id' => $hilos[0]->id,
                'usuario_id' => $users[4]->id,
                'cuerpo' => 'Voy a probar el nuevo Hades II! Esperé tanto por esta secuela. El primero fue de mis juegos favoritos.',
                'creado_en' => now()->subDays(2)->addHours(6)
            ],

            // Respuestas al problema de Cyberpunk
            [
                'hilo_id' => $hilos[6]->id,
                'usuario_id' => $users[0]->id,
                'cuerpo' => '¿Has actualizado los drivers recientemente? También prueba a desactivar el ray tracing completamente. Cyberpunk es muy pesado con RT incluso en GPUs más potentes.',
                'creado_en' => now()->subDays(2)->addHours(1)
            ],
            [
                'hilo_id' => $hilos[6]->id,
                'usuario_id' => $users[1]->id,
                'cuerpo' => 'Revisa la configuración de energía en Windows y en el panel de Nvidia. A veces está en modo ahorro de energía. También verifica que el juego esté usando la GPU y no la integrada.',
                'creado_en' => now()->subDays(2)->addHours(3)
            ],
            [
                'hilo_id' => $hilos[6]->id,
                'usuario_id' => $users[2]->id,
                'cuerpo' => 'Con esa configuración deberías tener mejor rendimiento. ¿Has mirado el uso de CPU vs GPU mientras juegas? Podría ser cuello de botella de CPU. Cyberpunk es muy demandante del procesador.',
                'creado_en' => now()->subDays(2)->addHours(5)
            ],

            // Respuestas sobre Unity vs Godot
            [
                'hilo_id' => $hilos[8]->id,
                'usuario_id' => $users[5]->id,
                'cuerpo' => 'Para 2D te recomiendo Godot 100%. Es mucho más ligero, está diseñado pensando en 2D y la curva de aprendizaje es más suave. Además, con los recientes cambios en Unity, Godot es más future-proof.',
                'creado_en' => now()->subDays(3)->addHours(2)
            ],
            [
                'hilo_id' => $hilos[8]->id,
                'usuario_id' => $users[6]->id,
                'cuerpo' => 'Como alguien que empezó con Unity y luego migró a Godot, te digo que Godot es mejor para 2D. Unity tiene más assets y tutoriales, pero Godot es más intuitivo para 2D y el lenguaje GDScript es fácil de aprender si sabes Python.',
                'creado_en' => now()->subDays(3)->addHours(4)
            ],
            [
                'hilo_id' => $hilos[8]->id,
                'usuario_id' => $users[7]->id,
                'cuerpo' => 'No descartes GameMaker Studio 2 para 2D. Es especializado en 2D y tiene una curva de aprendizaje muy buena para principiantes. Muchos juegos indie exitosos se hicieron con GameMaker.',
                'creado_en' => now()->subDays(3)->addHours(6)
            ],

            // Respuestas sobre juegos que merecen secuela
            [
                'hilo_id' => $hilos[1]->id,
                'usuario_id' => $users[5]->id,
                'cuerpo' => 'Agregaría **The Saboteur** a la lista. Juego de la WWII con mecánicas únicas y un estilo artístico increíble que merecía más amor.',
                'creado_en' => now()->subDays(4)->addHours(1)
            ],
            [
                'hilo_id' => $hilos[1]->id,
                'usuario_id' => $users[6]->id,
                'cuerpo' => '**Split/Second**! El mejor juego de carreras arcade que jugué. La mecánica de hacer explotar el circuito era genial. Lástima que Disney cerró el studio.',
                'creado_en' => now()->subDays(4)->addHours(3)
            ]
        ];

        foreach ($respuestas as $respuesta) {
            Respuesta::create($respuesta);
        }
    }
}
