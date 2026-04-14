import { useEffect, useState } from "react";
import FormularioInscripcion from "../components/FormularioInscripcion";
import {
  getInscripciones,
  getEstudiantes,
  getCursos,
  createInscripcion,
  updateInscripcion,
  deleteInscripcion,
} from "../services/api";
import "../styles/estudiantes.css";

function Inscripciones() {
  const [inscripciones, setInscripciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const role = localStorage.getItem("role") || "";
  const puedeGestionar = role === "ROLE_ADMIN";

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      const promesas = [getInscripciones()];
      if (puedeGestionar) {
        promesas.push(getEstudiantes(), getCursos());
      }

      const resultados = await Promise.all(promesas);

      setInscripciones(Array.isArray(resultados[0]) ? resultados[0] : []);
      setEstudiantes(puedeGestionar && Array.isArray(resultados[1]) ? resultados[1] : []);
      setCursos(puedeGestionar && Array.isArray(resultados[2]) ? resultados[2] : []);
    } catch (err) {
      setError(err.message || "Error al cargar inscripciones");
      setInscripciones([]);
      setEstudiantes([]);
      setCursos([]);
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

  const guardarInscripcion = async (data) => {
    if (!puedeGestionar) return;

    try {
      setError("");
      setMensaje("");

      if (editando) {
        await updateInscripcion(editando.id, data);
        mostrarMensaje("Inscripción actualizada correctamente");
      } else {
        await createInscripcion(data);
        mostrarMensaje("Inscripción creada correctamente");
      }

      setEditando(null);
      await cargarDatos();
    } catch (err) {
      setError(err.message || "Error al guardar inscripción");
    }
  };

  const eliminar = async (id) => {
    if (!puedeGestionar) return;

    if (!window.confirm("¿Eliminar inscripción?")) return;

    try {
      await deleteInscripcion(id);
      mostrarMensaje("Inscripción eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "Error eliminando inscripción");
    }
  };

  const editar = (ins) => {
    if (!puedeGestionar) return;

    setEditando({
      id: ins.id,
      estudianteId: ins.estudianteId || "",
      cursoId: ins.cursoId || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelar = () => {
    setEditando(null);
  };

  const inscripcionesFiltradas = inscripciones.filter((i) => {
    const texto = busqueda.toLowerCase();

    return (
      String(i.id || "").includes(texto) ||
      (i.estudianteNombre || "").toLowerCase().includes(texto) ||
      (i.materiaNombre || "").toLowerCase().includes(texto) ||
      (i.grupo || "").toLowerCase().includes(texto) ||
      (i.docenteNombre || "").toLowerCase().includes(texto)
    );
  });

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Cargando inscripciones...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="page-title text-center">Gestión de Inscripciones</h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {puedeGestionar && (
        <div className="card estudiantes-form-card mb-4">
          <div className="card-body">
            <h4 className="section-title">
              {editando ? "Editar inscripción" : "Registrar inscripción"}
            </h4>

            <FormularioInscripcion
              onSubmit={guardarInscripcion}
              inscripcionEditando={editando}
              onCancel={cancelar}
              estudiantes={estudiantes}
              cursos={cursos}
            />
          </div>
        </div>
      )}

      <div className="card estudiantes-table-card">
        <div className="card-body">
          <h4 className="section-title">Listado de inscripciones</h4>

          <div className="input-group mb-3">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>

            <input
              type="text"
              className="form-control"
              placeholder="Buscar por estudiante, materia, grupo o docente"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover mt-3 align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Estudiante</th>
                  <th>Materia</th>
                  <th>Grupo</th>
                  <th>Docente</th>
                  {puedeGestionar && <th>Acciones</th>}
                </tr>
              </thead>

              <tbody>
                {inscripcionesFiltradas.length > 0 ? (
                  inscripcionesFiltradas.map((i) => (
                    <tr key={i.id}>
                      <td>{i.id}</td>
                      <td>{i.estudianteNombre || "Sin estudiante"}</td>
                      <td>{i.materiaNombre || "Sin materia"}</td>
                      <td>{i.grupo || "Sin grupo"}</td>
                      <td>{i.docenteNombre || "Sin docente"}</td>

                      {puedeGestionar && (
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => editar(i)}
                          >
                            Editar
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminar(i.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={puedeGestionar ? "6" : "5"} className="text-center">
                      No hay inscripciones registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!puedeGestionar && (
            <div className="alert alert-secondary mt-3 mb-0">
              Solo el administrador puede gestionar inscripciones.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inscripciones;