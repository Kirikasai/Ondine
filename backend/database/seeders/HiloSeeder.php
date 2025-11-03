<?php
// database/seeders/HiloSeeder.php
namespace Database\Seeders;

use App\Models\Hilo;
use App\Models\Foro;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class HiloSeeder extends Seeder
{
    public function run()
    {
        $foros = Foro::all();
        $users = Usuario::all();

        $hilos = [
            // General Gaming
            [
                'foro_id' => $foros[0]->id,
                'usuario_id' => $users[0]->id,
                'titulo' => '¿Qué están jugando este fin de semana?',
                'cuerpo' => 'Compartan qué juegos van a disfrutar este fin de semana y por qué los recomiendan. Yo empiezo:\n\nEstoy enganchado con **Hades II** desde el acceso anticipado. El combate es tan adictivo como el primero pero con nuevas mecánicas interesantes.\n\nTambien planeo probar el nuevo modo de **Fortnite** que acaban de sacar.\n\n¿Y ustedes?',
                'creado_en' => now()->subDays(2)
            ],
            [
                'foro_id' => $foros[0]->id,
                'usuario_id' => $users[1]->id,
                'titulo' => 'Juegos que merecen una secuela pero nunca la tuvieron',
                'cuerpo' => 'Siempre me pregunté por qué algunos juegos increíbles nunca tuvieron secuela. Mi lista:\n\n1. **Sleeping Dogs** - El mejor juego de crimen que jugué, mundo abierto increíble en Hong Kong\n2. **Titanfall 2** - Campaña brillante, multiplayer único\n3. **Bulletstorm** - Disparos creativos y humor over-the-top\n4. **Alpha Protocol** - RPG de espías con decisiones que importan\n\n¿Qué juegos agregarían a la lista?',
                'creado_en' => now()->subDays(4)
            ],

            // Noticias y Rumores
            [
                'foro_id' => $foros[1]->id,
                'usuario_id' => $users[2]->id,
                'titulo' => 'Rumor: Nintendo Switch 2 anuncio en junio según fuentes',
                'cuerpo' => 'Según varias fuentes cercanas a Nintendo, la Switch 2 se anunciaría oficialmente en junio con lanzamiento para marzo 2025.\n\n**Especificaciones rumoreadas:**\n- Pantalla OLED 8 pulgadas\n- Nvidia Tegra T239\n- 12GB RAM\n- Compatibilidad con juegos de Switch 1\n\n¿Creen que sea cierto? ¿Qué esperan de la nueva consola?',
                'creado_en' => now()->subDays(1)
            ],
            [
                'foro_id' => $foros[1]->id,
                'usuario_id' => $users[3]->id,
                'titulo' => 'Xbox Game Pass sube de precio: ¿Sigue valiendo la pena?',
                'cuerpo' => 'Microsoft anunció el aumento de precio de Game Pass:\n- Ultimate: $18.99 (antes $16.99)\n- PC: $11.99 (antes $9.99)\n\nCon este aumento, ¿creen que sigue siendo worth it? \n\nEn mi caso, juego principalmente en PC y la biblioteca sigue siendo excelente, pero el precio se está acercando a lo que pagaría por juegos en oferta.',
                'creado_en' => now()->subDays(3)
            ],

            // Búsqueda de Grupo
            [
                'foro_id' => $foros[2]->id,
                'usuario_id' => $users[4]->id,
                'titulo' => 'Buscando equipo para ranked en Valorant (Platino)',
                'cuerpo' => 'Hola comunidad,\n\nSoy jugador Platino 2 en Valorant, main controlador (Omen, Brimstone). Busco equipo serio para subir ranked, preferiblemente que use discord y tenga horarios consistentes.\n\n**Disponibilidad:**\n- Lunes a viernes: 7pm - 11pm\n- Fines de semana: Flexible\n\n**Region:** LATAM\n\nSi alguien está armando equipo o necesita un controlador, déjenme saber!',
                'creado_en' => now()->subDays(1)
            ],
            [
                'foro_id' => $foros[2]->id,
                'usuario_id' => $users[5]->id,
                'titulo' => '¿Alguien para jugar Monster Hunter: World? Retomando el juego',
                'cuerpo' => 'Después de 2 años, quiero retomar MH: World y necesito compañeros de caza!\n\nEstoy en Master Rank 45, armadura de Velkhana y IG main.\n\nNo importa si son nuevos o veteranos, lo importante es divertirse cazando. Puedo ayudar con misiones o farmeo.\n\n**Plataforma:** PC (Steam)\n**Idioma:** Español/English\n\nAgréguenme si quieren jugar!',
                'creado_en' => now()->subDays(5)
            ],

            // Soporte Técnico
            [
                'foro_id' => $foros[3]->id,
                'usuario_id' => $users[6]->id,
                'titulo' => 'Problema con FPS en Cyberpunk 2077: RTX 3060 + i5 11400',
                'cuerpo' => 'Hola, tengo problemas de rendimiento en Cyberpunk 2077 con mi setup:\n\n**Especificaciones:**\n- RTX 3060 12GB\n- i5 11400\n- 16GB RAM 3200MHz\n- SSD NVMe\n\n**Problema:** No paso de 45 FPS en medium con DLSS en Quality, incluso a 1080p. Las temperaturas están bien (GPU 65°, CPU 60°).\n\n**Lo que intenté:**\n- Reinstalar drivers con DDU\n- Verificar archivos de Steam\n- Desactivar ray tracing\n- Bajar configuración a low\n\n¿Alguna sugerencia? Pensé que la 3060 manejaría mejor este juego.',
                'creado_en' => now()->subDays(2)
            ],
            [
                'foro_id' => $foros[3]->id,
                'usuario_id' => $users[7]->id,
                'titulo' => 'Mejor configuración para stream en OBS con internet de 10mb upload',
                'cuerpo' => 'Quiero empezar a streamear pero solo tengo 10mb de upload. ¿Cuál es la mejor configuración para OBS?\n\n**Mi setup:**\n- Ryzen 5 5600X\n- RTX 3060\n- 10mb upload estable\n\n**Lo que probé:**\n- 720p60 a 3500 bitrate\n- NVENC encoder\n- Pero se ve pixelado en movimiento rápido\n\n¿Algún streamer con internet similar que me pueda ayudar con la configuración óptima?',
                'creado_en' => now()->subDays(6)
            ],

            // Desarrollo de Juegos
            [
                'foro_id' => $foros[4]->id,
                'usuario_id' => $users[4]->id,
                'titulo' => '¿Unity vs Godot vs Unreal para primer juego 2D?',
                'cuerpo' => 'Estoy empezando en el desarrollo de juegos y quiero hacer un juego 2D tipo metroidvania. ¿Cuál motor recomiendan?\n\n**Mi experiencia:**\n- Programador intermedio (C#, Python)\n- Cero experiencia en desarrollo de juegos\n- Arte: Pixel art básico\n\n**Lo que busco:**\n- Curva de aprendizaje no muy empinada\n- Buena documentación\n- Comunidad activa\n- Rendimiento para 2D\n\n¿Recomiendan empezar con Godot que es más simple o mejor Unity que tiene más recursos?',
                'creado_en' => now()->subDays(3)
            ],

            // eSports
            [
                'foro_id' => $foros[5]->id,
                'usuario_id' => $users[0]->id,
                'titulo' => 'Análisis: El meta actual de Valorant y por qué Jett sigue siendo top pick',
                'cuerpo' => 'Después del último parche, Jett mantiene su posición como dualista más picked a pesar de los nerfs.\n\n**Por qué sigue siendo fuerte:**\n- Dash sigue siendo el mejor tool de entrada\n- Ultimate económica (no gasta balas)\n- Smokes que permiten plays agresivos\n\n**Agentes que están subiendo:**\n- Harbor con buffs recientes\n- Skye en comps agresivas\n- Cypher con las mejoras a sus trips\n\n¿Qué opinan del meta actual? ¿Algún agente que creen que necesita buff/nerf?',
                'creado_en' => now()->subHours(12)
            ]
        ];

        foreach ($hilos as $hilo) {
            Hilo::create($hilo);
        }
    }
}
