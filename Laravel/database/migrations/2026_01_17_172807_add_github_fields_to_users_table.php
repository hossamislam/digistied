<?php
// database/migrations/xxxx_add_github_fields_to_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('github_id')->nullable()->unique();
            $table->string('avatar')->nullable();
            $table->text('github_token')->nullable();
            $table->string('password')->nullable()->change(); 
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['github_id', 'avatar', 'github_token']);
        });
    }
};