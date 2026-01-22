<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Socialite;
use Symfony\Component\Routing\Router;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/auth/redirect', function () {
    return Socialite::driver('github')->redirect();
});

Route::get('/auth/callback', function () {
    $githubUser = Socialite::driver('github')->user();

    $user = User::updateOrCreate(
        ['github_id' => $githubUser->id],
        [
            'name' => $githubUser->name ?? $githubUser->nickname,
            'email' => $githubUser->email,
            'github_token' => Crypt::encryptString($githubUser->token),
        ]
    );

    Auth::login($user);

    return redirect('/home',compact('user'));
});
Route::get('/home', function () {
    return view('home');
})->middleware('auth');