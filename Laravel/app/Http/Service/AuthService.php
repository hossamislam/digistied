<?php
namespace App\Http\Service;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function register(array $data, Request $request):User
    {
        $user=User::create([
            'name'=>$data['name'],
            'email'=>$data['email'],
            'password'=>Hash::make($data['password']),
        ]);
        Auth::login($user);
        $request->session()->regenerate();
        return $user;
    }
     public function login(array $credentials, Request $request): User
    {
        if (!Auth::attempt($credentials)) {
            throw new \Exception('Invalid credentials');
        }

        $request->session()->regenerate();

        return Auth::user();
    }
    public function logout(Request $request):void
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }   
    
}