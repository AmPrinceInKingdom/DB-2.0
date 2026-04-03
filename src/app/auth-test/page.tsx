"use client";

import { useState } from "react";
import { login, signup } from "@/lib/supabase/auth";

export default function AuthTestPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { error } = await signup(email, password);
    if (error) alert(error.message);
    else alert("Signup success");
  };

  const handleLogin = async () => {
    const { error } = await login(email, password);
    if (error) alert(error.message);
    else alert("Login success");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Auth Test</h1>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleSignup}>Signup</button>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}