import React from 'react'
import {Link} from 'react-router-dom'

export const Navbar = ({ user, setUser }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Flask & React</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            {user && (
              <li className="nav-item">
                <button
                  className="btn btn-link nav-link"
                  onClick={() => {
                    localStorage.removeItem("user");
                    setUser(null);
                  }}
                >
                  Cerrar sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>
)