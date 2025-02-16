<?php

return [
    'paths' => ['api/*'], // Izinkan semua route di bawah prefix "api"
    'allowed_methods' => ['*'], // Izinkan semua metode HTTP (GET, POST, PUT, DELETE, dll.)
    'allowed_origins' => ['*'], // Izinkan semua domain untuk mengakses API
    'allowed_origins_patterns' => [], // Tidak ada pola khusus
    'allowed_headers' => ['*'], // Izinkan semua header
    'exposed_headers' => [], // Header tambahan yang diekspos ke frontend
    'max_age' => 0, // Cache preflight request selama 0 detik
    'supports_credentials' => false, // Nonaktifkan pengiriman cookie atau token otentikasi lintas domain
];