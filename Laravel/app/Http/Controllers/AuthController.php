<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Http\Service\AuthService;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function __construct(protected AuthService $authService){}

    public function register(RegisterRequest $request): JsonResponse
    {
$user=$this->authService->register(
    $request->validate(),
    $request    
);
return response()->json([
    'message'=>"user registered successfully",
    'user'=>new UserResource($user)
]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
     try{
        $user=$this->authService->login(
            $request->validated(),
            $request
        );
        return response()->json([
            'message'=>'login successful',
            'user'=>new UserResource($user)
        ]);
     }catch(\Exception $e){
        return response()->json([
            'error'=>$e->getMessage()
        ],401);
     }
    }

    public function logout(Request $request): JsonResponse
    {
$this->authService->logout($request);
return response()->json([
    'message'=>'logout successful'
]);
    }

    public function user(Request $request)
    {
        return new UserResource($request->user());
    }
}