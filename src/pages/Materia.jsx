import { useEffect, useState } from "react";
import {
  getMaterias,
  createMateria,
  updateMateria,
  deleteMateria,
} from "../services/api";
import FormularioMateria from "../components/FormularioMateria";
import "../styles/estudiantes.css";

function Materia() {
  const [materias, setMaterias] = useState([]);
  const [materiaEditando, setMateriaEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const role = localStorage.getItem("role") || "";
  const esDocente = role === "ROLE_DOCENTE";
  const puedeGestionar = role === "ROLE_ADMIN";

  const cargarMaterias = async () => {
    try {
      setLoading(true);
      const data = await getMaterias();
      setMaterias(Array.isArray(data) ? data : []);
    } catch (error) {
      mostrarMensaje(error.message || "Error al cargar materias", "danger");
      setMaterias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMaterias();
  }, []);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);

    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 3000);
  };

  const guardarMateria = async (materia) => {
    if (!puedeGestionar) return;

    try {
      if (materiaEditando) {
        await updateMateria(materiaEditando.id, materia);
        mostrarMensaje("Materia actualizada correctamente", "success");
      } else {
        await createMateria(materia);
        mostrarMensaje("Materia creada correctamente", "success");
      }

      setMateriaEditando(null);
      cargarMaterias();
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo guardar la materia", "danger");
    }
  };

  const editarMateria = (materia) => {
    if (!puedeGestionar) return;
    setMateriaEditando(materia);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarMateria = async (id, nombre) => {
    if (!puedeGestionar) return;

    const confirmado = window.confirm(
      `¿Seguro que deseas eliminar la materia "${nombre}"?`
    );

    if (!confirmado) return;

    try {
      await deleteMateria(id);
      mostrarMensaje("Materia eliminada correctamente", "success");
      cargarMaterias();
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo eliminar la materia", "danger");
    }
  };

  const cancelarEdicion = () => {
    setMateriaEditando(null);
  };

  const materiasFiltradas = materias.filter((materia) => {
    const texto = busqueda.toLowerCase();

    return (
      String(materia.id || "").includes(texto) ||
      (materia.nombre || "").toLowerCase().includes(texto) ||
      String(materia.creditos || "").includes(texto)
    );
  });

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Cargando materias...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="page-title text-center">
        {esDocente ? "Mis Materias" : "Gestión de Materias"}
      </h2>

      {mensaje && (
        <div
          className={`alert alert-${tipoMensaje} alert-dismissible fade show`}
          role="alert"
        >
          {mensaje}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMensaje("")}
          ></button>
        </div>
      )}

      {puedeGestionar && (
        <div className="card estudiantes-form-card mb-4">
          <div className="card-body">
            <h4 className="section-title">
              {materiaEditando ? "Editar materia" : "Registrar materia"}
            </h4>

            <FormularioMateria
              onSubmit={guardarMateria}
              materiaEditando={materiaEditando}
              onCancel={cancelarEdicion}
            />
          </div>
        </div>
      )}

      <div className="card estudiantes-table-card">
        <div className="card-body">
          <h4 className="section-title">
            {esDocente ? "Listado de materias asignadas" : "Listado de materias"}
          </h4>

          <div className="input-group mb-3 search-box">
            <span className="input-group-text search-icon-box">
              <i className="bi bi-search"></i>
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Buscar por ID, nombre o créditos"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            {busqueda && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setBusqueda("")}
              >
                Limpiar
              </button>
            )}
          </div>

          {materiasFiltradas.length === 0 ? (
            <div className="alert alert-secondary">
              No hay materias registradas.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Créditos</th>
                    {puedeGestionar && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {materiasFiltradas.map((materia) => (
                    <tr key={materia.id}>
                      <td>{materia.id}</td>
                      <td>{materia.nombre}</td>
                      <td>{materia.creditos}</td>
                      {puedeGestionar && (
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => editarMateria(materia)}
                            >
                              Editar
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                eliminarMateria(materia.id, materia.nombre)
                              }
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Materia;