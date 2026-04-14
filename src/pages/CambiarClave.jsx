import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/api";

function CambiarClave() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Debes completar todos los campos");
      return;
    }

    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("La confirmación no coincide");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMensaje("");

      await changePassword(currentPassword, newPassword);
      localStorage.setItem("mustChangePassword", "false");

      setMensaje("Contraseña actualizada correctamente");

      setTimeout(() => {
        navigate(role === "ROLE_ESTUDIANTE" ? "/boletin" : "/dashboard", {
          replace: true,
        });
      }, 1000);
    } catch (err) {
      setError(err.message || "No se pudo cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="mb-3">Cambiar contraseña</h3>
          <p className="text-muted">
            Debes cambiar tu contraseña antes de continuar.
          </p>

          {mensaje && <div className="alert alert-success">{mensaje}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Contraseña actual</label>
              <input
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nueva contraseña</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmar nueva contraseña</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Guardando..." : "Actualizar contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CambiarClave;