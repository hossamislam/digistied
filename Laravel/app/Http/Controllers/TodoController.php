<?php

namespace App\Http\Controllers;

use App\Http\Resources\TodoResoruce;
use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class TodoController extends Controller
{
    public function index()
    {
        $todos = Todo::all();
        return TodoResoruce::collection($todos);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $todo = $request->user()->todos()->create($request->all());
        return response()->json($todo, 201);
    }

    public function show(Request $request, $id)
    {
        $todo = $request->user()->todos()->findOrFail($id);
        return response()->json($todo);
    }

    public function update(Request $request, $id)
    {
        $todo = $request->user()->todos()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'completed' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $todo->update($request->all());
        return response()->json($todo);
    }

    public function destroy(Request $request, $id)
    {
        $todo = $request->user()->todos()->findOrFail($id);
        $todo->delete();
        return response()->json(['message' => 'Todo deleted successfully']);
    }
}