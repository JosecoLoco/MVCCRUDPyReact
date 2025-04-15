import React, { useState, useEffect, useRef } from "react";

const API = process.env.REACT_APP_API;

export const Users = ({ user: userLogged }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cliente");

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState("");

  const [memeUrl, setMemeUrl] = useState(null); // Para el meme

  const nameInput = useRef(null);

  let [users, setUsers] = useState([]);

  // Saludo personalizado
  const saludo = `Hola ${userLogged.name}, aquí tienes usuarios y memes aleatorios!!`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editing) {
      await fetch(`${API}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Role": userLogged.role,
          "Email": userLogged.email,
          "Password": userLogged.password,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });
    } else {
      await fetch(`${API}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Role": userLogged.role,
          "Email": userLogged.email,
          "Password": userLogged.password,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });
      setEditing(false);
      setId("");
    }
    await getUsers();

    setName("");
    setEmail("");
    setPassword("");
    setRole("cliente");
    nameInput.current.focus();
  };

  const getUsers = async () => {
    const res = await fetch(`${API}/users`);
    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id) => {
    const userResponse = window.confirm("¿Seguro que quieres eliminarlo?");
    if (userResponse) {
      await fetch(`${API}/users/${id}`, {
        method: "DELETE",
        headers: {
          "Role": userLogged.role,
          "Email": userLogged.email,
          "Password": userLogged.password,
        },
      });
      await getUsers();
    }
  };

  const editUser = async (id) => {
    const res = await fetch(`${API}/users/${id}`);
    const data = await res.json();

    setEditing(true);
    setId(id);

    setName(data.name);
    setEmail(data.email);
    setPassword(data.password);
    setRole(data.role || "cliente");
    nameInput.current.focus();
  };

  const getMeme = async () => {
    const res = await fetch("https://meme-api.com/gimme");
    const data = await res.json();
    setMemeUrl(data.url);
  };

  useEffect(() => {
    getUsers();
    if (userLogged.role === "cliente") {
      getMeme();
    }

  }, []);

  return (
    <>
      <h2 className="mb-4 text-center">{saludo}</h2>
      <div className="row">
        <div className="col-md-4">
          {userLogged.role === "admin" && (
            <form onSubmit={handleSubmit} className="card card-body">
              <div className="form-group">
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className="form-control"
                  placeholder="Nombre"
                  ref={nameInput}
                  autoFocus
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="form-control"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="form-control"
                  placeholder="Contraseña"
                  required
                />
              </div>
              <div className="form-group">
                <select
                  className="form-control"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <option value="cliente">Cliente</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button className="btn btn-primary btn-block">
                {editing ? "Actualizar" : "Crear"}
              </button>
            </form>
          )}
          {/* Si es cliente, muestra el meme */}
          {userLogged.role === "cliente" && memeUrl && (
            <div className="card mt-3">
              <h5 className="card-title text-center mt-2">¡Meme aleatorio!</h5>
              <img src={memeUrl} alt="Meme" className="img-fluid" style={{ maxHeight: 300, objectFit: "contain" }} />
            </div>
          )}
        </div>
        <div className="col-md-8">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Contraseña</th>
                <th>Rol</th>
                {userLogged.role === "admin" && <th>Operaciones</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.role === "admin"
                      ? "••••••••"
                      : user.password}
                  </td>
                  <td>{user.role}</td>
                  {userLogged.role === "admin" && (
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => editUser(user._id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteUser(user._id)}
                      >
                        Borrar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};