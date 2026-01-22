<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// GitHub OAuth routes
Route::get('/auth/github/redirect', function () {
    return Socialite::driver('github')->redirect();
});

Route::get('/auth/github/callback', function () {
    try {
        $githubUser = Socialite::driver('github')->user();
        
        // Find or create user
        $user = User::updateOrCreate(
            ['email' => $githubUser->email],
            [
                'name' => $githubUser->name ?? $githubUser->nickname,
                'github_id' => $githubUser->id,
                'avatar' => $githubUser->avatar,
                'github_token' => $githubUser->token,
            ]
        );
        
        // Create Sanctum token for API authentication
        $token = $user->createToken('github-oauth')->plainTextToken;
        
        // Redirect to frontend with token
        return redirect('http://localhost:5173/api/auth/callback?token=' . $token);
        
    } catch (\Exception $e) {
        return redirect('http://localhost:5173/api/auth/callback?error=' . urlencode($e->getMessage()));
    }
});