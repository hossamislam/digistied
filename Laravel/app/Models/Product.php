<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description'];
     protected $casts = [
        'name' => 'array',
        'description' => 'array',
    ];
}
