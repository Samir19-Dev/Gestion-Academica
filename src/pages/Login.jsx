import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import "../styles/login.css";

function Login({ setAuth }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = form.username.trim().toLowerCase();
    const password = form.password.trim();

    if (!username || !password) {
      setError("Debes ingresar usuario o correo y contraseña");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await login(username, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username || username);
      localStorage.setItem("role", data.role || "");
      localStorage.setItem(
        "mustChangePassword",
        String(data.mustChangePassword ?? false)
      );

      setAuth(true);

      if (data.mustChangePassword) {
        navigate("/cambiar-clave", { replace: true });
      } else {
        navigate(
          data.role === "ROLE_ESTUDIANTE" ? "/boletin" : "/dashboard",
          { replace: true }
        );
      }
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="app-box">
          <div className="text-center mb-4">
            <h2 className="mb-2">Iniciar Sesión</h2>
            <p className="text-muted mb-0">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Usuario o correo electrónico
              </label>
              <input
                id="username"
                type="text"
                name="username"
                className="form-control"
                placeholder="Ingrese su usuario o correo"
                value={form.username}
                onChange={handleChange}
                disabled={loading}
                autoComplete="username"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>

              <div className="input-group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Ingrese su contraseña"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;