import React, { useEffect, useState } from "react";
import {
  getDocentes,
  createDocente,
  updateDocente,
  deleteDocente,
} from "../services/api";
import FormularioDocente from "../components/FormularioDocente";
import "../styles/estudiantes.css";

function Docente() {
  const [docentes, setDocentes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [docenteEditando, setDocenteEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role") || "";
  const esDocente = role === "ROLE_DOCENTE";
  const puedeGestionar = role === "ROLE_ADMIN";

  useEffect(() => {
    cargarDocentes();
  }, []);

  const cargarDocentes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDocentes();
      setDocentes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los docentes");
      setDocentes([]);
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 3000);
  };

  const handleNuevo = () => {
    if (!puedeGestionar) return;
    setDocenteEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditar = (docente) => {
    if (!puedeGestionar) return;
    setDocenteEditando(docente);
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id) => {
    if (!puedeGestionar) return;

    const confirmar = window.confirm("¿Deseas eliminar este docente?");
    if (!confirmar) return;

    try {
      await deleteDocente(id);
      mostrarMensaje("Docente eliminado correctamente");
      await cargarDocentes();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el docente");
    }
  };

  const handleGuardar = async (docente) => {
    if (!puedeGestionar) return;

    try {
      setError("");
      setMensaje("");

      if (docenteEditando) {
        await updateDocente(docenteEditando.id, docente);
        mostrarMensaje("Docente actualizado correctamente");
      } else {
        await createDocente(docente);
        mostrarMensaje("Docente creado correctamente");
      }

      setMostrarFormulario(false);
      setDocenteEditando(null);
      await cargarDocentes();
    } catch (err) {
      setError(err.message || "No se pudo guardar el docente");
    }
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setDocenteEditando(null);
  };

  const docentesFiltrados = docentes.filter((docente) => {
    const texto = busqueda.toLowerCase();
    return (
      (docente.nombre || "").toLowerCase().includes(texto) ||
      (docente.especialidad || "").toLowerCase().includes(texto)
    );
  });

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Cargando docentes...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="page-title mb-0">
          {esDocente ? "Listado de Docentes" : "Gestión de Docentes"}
        </h2>

        {puedeGestionar && !mostrarFormulario && (
          <button className="btn btn-primary" onClick={handleNuevo}>
            Nuevo docente
          </button>
        )}
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {puedeGestionar && mostrarFormulario && (
        <div className="card estudiantes-form-card mb-4">
          <div className="card-body">
            <h4 className="section-title">
              {docenteEditando ? "Editar docente" : "Registrar docente"}
            </h4>

            <FormularioDocente
              onSubmit={handleGuardar}
              docenteEditando={docenteEditando}
              onCancel={handleCancelar}
            />
          </div>
        </div>
      )}

      <div className="card estudiantes-table-card">
        <div className="card-body">
          <h4 className="section-title">Listado de docentes</h4>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre o especialidad"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Especialidad</th>
                  {puedeGestionar && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {docentesFiltrados.length > 0 ? (
                  docentesFiltrados.map((docente) => (
                    <tr key={docente.id}>
                      <td>{docente.id}</td>
                      <td>{docente.nombre}</td>
                      <td>{docente.especialidad || "Sin especialidad"}</td>

                      {puedeGestionar && (
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEditar(docente)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleEliminar(docente.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={puedeGestionar ? "4" : "3"}
                      className="text-center"
                    >
                      No hay docentes registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Docente;