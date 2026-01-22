<h1>login</h1>

<form action="/api/login" method="POST">
    @csrf
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>
    
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required>
    
    <button type="submit">Login</button>
    <a href="/auth/redirect">Login with GitHub</a>
</form>