import { useEffect, useState } from "react";
import FormularioNota from "../components/FormularioNota";
import {
  getNotas,
  createNota,
  updateNota,
  deleteNota,
  getInscripciones,
} from "../services/api";
import "../styles/estudiantes.css";

function Notas() {
  const [notas, setNotas] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [notaEditando, setNotaEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const role = localStorage.getItem("role") || "";
  const esDocente = role === "ROLE_DOCENTE";
  const tituloPagina = esDocente ? "Mis Notas" : "Gestión de Notas";

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const [dataNotas, dataInscripciones] = await Promise.all([
        getNotas(),
        getInscripciones(),
      ]);

      setNotas(Array.isArray(dataNotas) ? dataNotas : []);
      setInscripciones(
        Array.isArray(dataInscripciones) ? dataInscripciones : []
      );
    } catch (err) {
      setError(err.message || "Error al cargar notas");
      setNotas([]);
      setInscripciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 3000);
  };

  const handleGuardar = async (nota) => {
    try {
      setError("");
      setMensaje("");

      if (notaEditando) {
        await updateNota(notaEditando.id, nota);
        mostrarMensaje("Nota actualizada correctamente");
        setNotaEditando(null);
      } else {
        await createNota(nota);
        mostrarMensaje("Nota registrada correctamente");
      }

      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo guardar la nota");
    }
  };

  const handleEditar = (nota) => {
    setNotaEditando(nota);
    setMensaje("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar esta nota?");
    if (!confirmar) return;

    try {
      setError("");
      setMensaje("");
      await deleteNota(id);
      mostrarMensaje("Nota eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la nota");
    }
  };

  const handleCancelar = () => {
    setNotaEditando(null);
    setError("");
    setMensaje("");
  };

  const notasFiltradas = notas.filter((nota) => {
    const texto = busqueda.toLowerCase();

    return (
      String(nota.id || "").includes(texto) ||
      (nota.inscripcionDescripcion || "").toLowerCase().includes(texto) ||
      String(nota.promedio || "").includes(texto)
    );
  });

  const totalNotas = notas.length;
  const promedioGeneral =
    notas.length > 0
      ? (
          notas.reduce(
            (acumulado, nota) => acumulado + Number(nota.promedio || 0),
            0
          ) / notas.length
        ).toFixed(2)
      : "0.00";

  const aprobadas = notas.filter((nota) => Number(nota.promedio) >= 3).length;
  const resultadosVisibles = notasFiltradas.length;

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Cargando notas...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="page-title text-center">{tituloPagina}</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stats-card stats-card-primary h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="stats-label">Total notas</h6>
                <h2 className="stats-value text-primary">{totalNotas}</h2>
              </div>
              <i className="bi bi-journal-medical stats-icon text-primary"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stats-card stats-card-success h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="stats-label">Promedio general</h6>
                <h2 className="stats-value text-success">{promedioGeneral}</h2>
              </div>
              <i className="bi bi-graph-up-arrow stats-icon text-success"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stats-card stats-card-warning h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="stats-label">Aprobadas</h6>
                <h2 className="stats-value text-warning">{aprobadas}</h2>
              </div>
              <i className="bi bi-check-circle-fill stats-icon text-warning"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stats-card stats-card-danger h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="stats-label">Resultados visibles</h6>
                <h2 className="stats-value text-danger">{resultadosVisibles}</h2>
              </div>
              <i className="bi bi-funnel-fill stats-icon text-danger"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="card estudiantes-form-card mb-4">
        <div className="card-body">
          <h4 className="section-title">
            {notaEditando ? "Editar nota" : "Registrar nota"}
          </h4>

          <FormularioNota
            onSubmit={handleGuardar}
            notaEditando={notaEditando}
            onCancel={handleCancelar}
            inscripciones={inscripciones}
          />
        </div>
      </div>

      <div className="card estudiantes-table-card">
        <div className="card-body">
          <h4 className="section-title">
            {esDocente ? "Listado de notas de mis cursos" : "Listado de notas"}
          </h4>

          <div className="input-group mb-3 search-box">
            <span className="input-group-text search-icon-box">
              <i className="bi bi-search"></i>
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Buscar por ID, inscripción o promedio"
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

          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Inscripción</th>
                  <th>Parcial 1</th>
                  <th>Parcial 2</th>
                  <th>Final</th>
                  <th>Promedio</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {notasFiltradas.length > 0 ? (
                  notasFiltradas.map((nota) => (
                    <tr key={nota.id}>
                      <td>{nota.id}</td>
                      <td>{nota.inscripcionDescripcion}</td>
                      <td>{nota.parcial1}</td>
                      <td>{nota.parcial2}</td>
                      <td>{nota.finalNota}</td>
                      <td>{nota.promedio}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => handleEditar(nota)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleEliminar(nota.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No hay notas registradas.
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

export default Notas;