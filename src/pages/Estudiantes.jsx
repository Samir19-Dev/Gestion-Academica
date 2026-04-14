import { useEffect, useState } from "react";
import {
  getEstudiantes,
  getCarreras,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
} from "../services/api";
import FormularioEstudiante from "../components/FormularioEstudiante";
import "../styles/estudiantes.css";

function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [estudianteEditando, setEstudianteEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const role = localStorage.getItem("role") || "";
  const esDocente = role === "ROLE_DOCENTE";
  const puedeGestionar = role === "ROLE_ADMIN";

  const cargarEstudiantes = async () => {
    try {
      setLoading(true);
      const data = await getEstudiantes();
      setEstudiantes(Array.isArray(data) ? data : []);
    } catch (error) {
      mostrarMensaje(error.message || "Error al cargar estudiantes", "danger");
      setEstudiantes([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarCarreras = async () => {
    try {
      const data = await getCarreras();
      setCarreras(Array.isArray(data) ? data : []);
    } catch (error) {
      mostrarMensaje(error.message || "Error al cargar carreras", "danger");
      setCarreras([]);
    }
  };

  useEffect(() => {
    cargarEstudiantes();
    if (puedeGestionar) {
      cargarCarreras();
    }
  }, []);

  const mostrarMensaje = (texto, tipo) => {
    setMensaje(texto);
    setTipoMensaje(tipo);

    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 3000);
  };

  const guardarEstudiante = async (estudiante) => {
    if (!puedeGestionar) return;

    try {
      if (estudianteEditando) {
        await updateEstudiante(estudianteEditando.id, estudiante);
        mostrarMensaje("Estudiante actualizado correctamente", "success");
      } else {
        await createEstudiante(estudiante);
        mostrarMensaje("Estudiante creado correctamente", "success");
      }

      setEstudianteEditando(null);
      cargarEstudiantes();
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo guardar el estudiante", "danger");
    }
  };

  const editarEstudiante = (estudiante) => {
    if (!puedeGestionar) return;
    setEstudianteEditando(estudiante);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarEstudiante = async (id, nombre) => {
    if (!puedeGestionar) return;

    const confirmado = window.confirm(
      `¿Seguro que deseas eliminar al estudiante "${nombre}"?`
    );

    if (!confirmado) return;

    try {
      await deleteEstudiante(id);
      mostrarMensaje("Estudiante eliminado correctamente", "success");
      cargarEstudiantes();
    } catch (error) {
      mostrarMensaje(error.message || "No se pudo eliminar el estudiante", "danger");
    }
  };

  const cancelarEdicion = () => {
    setEstudianteEditando(null);
  };

  const estudiantesFiltrados = estudiantes.filter((estudiante) => {
    const texto = busqueda.toLowerCase();

    return (
      String(estudiante.id || "").includes(texto) ||
      (estudiante.nombre || "").toLowerCase().includes(texto) ||
      (estudiante.carreraNombre || "").toLowerCase().includes(texto) ||
      String(estudiante.semestre || "").includes(texto)
    );
  });

  const totalEstudiantes = estudiantes.length;
  const carrerasUnicas = new Set(
    estudiantes.map((e) => e.carreraNombre).filter(Boolean)
  ).size;
  const semestresIniciales = estudiantes.filter(
    (e) => Number(e.semestre) >= 1 && Number(e.semestre) <= 4
  ).length;
  const semestresAvanzados = estudiantes.filter(
    (e) => Number(e.semestre) >= 5
  ).length;
  const resultadosVisibles = estudiantesFiltrados.length;

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Cargando estudiantes...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="page-title text-center">
        {esDocente ? "Mis Estudiantes" : "Gestión de Estudiantes"}
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

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stats-card stats-card-primary h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="stats-label">Total estudiantes</h6>
                <h2 className="stats-value text-primary">{totalEstudiantes}</h2>
              </div>
              <i className="bi bi-people-fill stats-icon text-primary"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stats-card stats-card-success h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="stats-label">Carreras únicas</h6>
                <h2 className="stats-value text-success">{carrerasUnicas}</h2>
              </div>
              <i className="bi bi-journal-bookmark-fill stats-icon text-success"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stats-card stats-card-warning h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="stats-label">Semestres 1 a 4</h6>
                <h2 className="stats-value text-warning">{semestresIniciales}</h2>
              </div>
              <i className="bi bi-mortarboard-fill stats-icon text-warning"></i>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card stats-card stats-card-danger h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="stats-label">Semestres 5 o más</h6>
                <h2 className="stats-value text-danger">{semestresAvanzados}</h2>
              </div>
              <i className="bi bi-bar-chart-fill stats-icon text-danger"></i>
            </div>
          </div>
        </div>
      </div>

      {puedeGestionar && (
        <div className="card estudiantes-form-card mb-4">
          <div className="card-body">
            <h4 className="section-title">
              {estudianteEditando ? "Editar estudiante" : "Registrar estudiante"}
            </h4>

            <FormularioEstudiante
              onSubmit={guardarEstudiante}
              estudianteEditando={estudianteEditando}
              onCancel={cancelarEdicion}
              carreras={carreras}
            />
          </div>
        </div>
      )}

      <div className="card estudiantes-table-card">
        <div className="card-body">
          <h4 className="section-title">
            {esDocente ? "Listado de estudiantes de mis cursos" : "Listado de estudiantes"}
          </h4>

          <div className="input-group mb-3 search-box">
            <span className="input-group-text search-icon-box">
              <i className="bi bi-search"></i>
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Buscar por ID, nombre, carrera o semestre"
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

          {estudiantes.length === 0 ? (
            <div className="alert alert-secondary">
              No hay estudiantes registrados.
            </div>
          ) : estudiantesFiltrados.length === 0 ? (
            <div className="alert alert-warning">
              No se encontraron estudiantes con esa búsqueda.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-bordered align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Carrera</th>
                    <th>Semestre</th>
                    {puedeGestionar && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {estudiantesFiltrados.map((estudiante) => (
                    <tr key={estudiante.id}>
                      <td>{estudiante.id}</td>
                      <td>{estudiante.nombre}</td>
                      <td>{estudiante.carreraNombre}</td>
                      <td>{estudiante.semestre}</td>
                      {puedeGestionar && (
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => editarEstudiante(estudiante)}
                            >
                              Editar
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                eliminarEstudiante(estudiante.id, estudiante.nombre)
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

          <div className="mt-3 text-muted">
            Resultados visibles: {resultadosVisibles} de {totalEstudiantes}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estudiantes;

