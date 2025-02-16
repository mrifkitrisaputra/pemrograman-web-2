<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        parent::boot();
    }

    public function map(): void
    {
        $this->mapApiRoutes();
        $this->mapWebRoutes();
    }

    protected function mapWebRoutes(): void
    {
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    }

    protected function mapApiRoutes(): void
    {
        // Debugging untuk memastikan method ini dipanggil
        echo "Loading API Routes...\n";

        Route::prefix('api') // Prefix 'api'
            ->middleware('api') // Middleware 'api'
            ->group(base_path('routes/api.php')); // Muat file api.php
    }
}