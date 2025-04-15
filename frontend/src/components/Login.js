import React, { useState } from "react";

const API = process.env.REACT_APP_API;

export const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      setError(data.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setIsRegister(false);
      setError("¡Registro exitoso! Ahora puedes iniciar sesión.");
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="card card-body">
      {!isRegister ? (
        <form onSubmit={handleLogin}>
          <h3>Iniciar Sesión</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary btn-block">Entrar</button>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => {
              setIsRegister(true);
              setError("");
            }}
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h3>Registro</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary btn-block">Registrarse</button>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => {
              setIsRegister(false);
              setError("");
            }}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </form>
      )}
    </div>
  );
}; 