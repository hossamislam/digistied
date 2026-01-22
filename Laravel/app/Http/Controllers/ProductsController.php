<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductsController
{
    public function index(Request $request)
    {
    $lang = $request->header('Accept-Language', 'en');
return ProductResource::collection(Product::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|array',
            'description' => 'required|array',
        ]);

        $product = Product::create([
            'name' => $data['name'],
            'description' => $data['description'],
        ]);

        return response()->json($product, 201);
    }
}
