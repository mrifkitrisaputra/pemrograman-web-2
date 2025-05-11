<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Hapus kolom 'name' jika tidak perlu
            // $table->dropColumn('name');

            // Tambahkan kolom 'username' setelah 'id'
            $table->string('username')->unique()->after('id');

            // Ubah kolom 'email' jadi nullable
            $table->string('email')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Kembalikan 'email' ke non-nullable
            $table->string('email')->change();

            // Hapus kolom 'username'
            $table->dropColumn('username');

            // Jika tadi hapus 'name', tambahkan lagi di rollback
            // $table->string('name');
        });
    }
};