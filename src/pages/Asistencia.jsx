import { useEffect, useState } from "react";
import FormularioAsistencia from "../components/FormularioAsistencia";
import {
  getAsistencias,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia,
  getInscripciones,
} from "../services/api";
import "../styles/estudiantes.css";

function Asistencias() {
  const [asistencias, setAsistencias] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [asistenciaEditando, setAsistenciaEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const role = localStorage.getItem("role") || "";
  const esDocente = role === "ROLE_DOCENTE";
  const tituloPagina = esDocente ? "Mis Asistencias" : "Gestión de Asistencias";

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const [dataAsistencias, dataInscripciones] = await Promise.all([
        getAsistencias(),
        getInscripciones(),
      ]);

      setAsistencias(Array.isArray(dataAsistencias) ? dataAsistencias : []);
      setInscripciones(Array.isArray(dataInscripciones) ? dataInscripciones : []);
    } catch (err) {
      setError(err.message || "Error cargando asistencias");
      setAsistencias([]);
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

  const handleGuardar = async (asistencia) => {
    try {
      setError("");
      setMensaje("");

      if (asistenciaEditando) {
        await updateAsistencia(asistenciaEditando.id, asistencia);
        mostrarMensaje("Asistencia actualizada correctamente");
      } else {
        await createAsistencia(asistencia);
        mostrarMensaje("Asistencia registrada correctamente");
      }

      setAsistenciaEditando(null);
      await cargarDatos();
    } catch (err) {
      setError(err.message || "Error guardando asistencia");
    }
  };

  const handleEditar = (asistencia) => {
    setAsistenciaEditando({
      id: asistencia.id,
      fecha: asistencia.fecha,
      presente: asistencia.presente,
      inscripcionId: asistencia.inscripcionId || "",
    });

    setError("");
    setMensaje("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar asistencia?")) return;

    try {
      await deleteAsistencia(id);

      if (asistenciaEditando?.id === id) {
        setAsistenciaEditando(null);
      }

      mostrarMensaje("Asistencia eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "Error eliminando asistencia");
    }
  };

  const handleCancelar = () => {
    setAsistenciaEditando(null);
    setError("");
    setMensaje("");
  };

  const asistenciasFiltradas = asistencias.filter((a) => {
    const texto = busqueda.toLowerCase();

    return (
      String(a.id || "").includes(texto) ||
      (a.inscripcionDescripcion || "").toLowerCase().includes(texto) ||
      (a.fecha || "").toLowerCase().includes(texto) ||
      (a.presente ? "presente" : "ausente").includes(texto)
    );
  });

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Cargando asistencias...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="page-title text-center">{tituloPagina}</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card estudiantes-form-card mb-4">
        <div className="card-body">
          <h4>{asistenciaEditando ? "Editar" : "Registrar"} asistencia</h4>

          <FormularioAsistencia
            onSubmit={handleGuardar}
            asistenciaEditando={asistenciaEditando}
            onCancel={handleCancelar}
            inscripciones={inscripciones}
          />
        </div>
      </div>

      <div className="card estudiantes-table-card">
        <div className="card-body">
          <h4 className="section-title">
            {esDocente
              ? "Listado de asistencias de mis cursos"
              : "Listado de asistencias"}
          </h4>

          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Buscar por inscripción, fecha o estado"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Inscripción</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {asistenciasFiltradas.length > 0 ? (
                  asistenciasFiltradas.map((a) => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.fecha || "Sin fecha"}</td>
                      <td>{a.inscripcionDescripcion || "Sin datos"}</td>
                      <td>
                        <span
                          className={`badge ${
                            a.presente ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {a.presente ? "PRESENTE" : "AUSENTE"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-1"
                          onClick={() => handleEditar(a)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleEliminar(a.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No hay asistencias registradas
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

export default Asistencias;