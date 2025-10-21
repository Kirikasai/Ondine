<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            // ✅ RUTAS API - ESTO ES LO MÁS IMPORTANTE
            Route::middleware('api')
                ->prefix('api') // Todas las rutas tendrán el prefijo /api
                ->group(base_path('routes/api.php'));

            // ✅ RUTAS WEB
            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            // ✅ Si tienes más archivos de rutas, los agregas aquí
            // Route::middleware('web')
            //     ->group(base_path('routes/admin.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // Puedes agregar más limitadores si necesitas
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        RateLimiter::for('steam-api', function (Request $request) {
            return Limit::perMinute(30)->by($request->ip());
        });
    }
}
