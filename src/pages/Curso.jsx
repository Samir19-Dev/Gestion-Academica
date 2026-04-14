import { useEffect, useState, useCallback } from "react";
import FormularioCurso from "../components/FormularioCurso";
import {
  getCursos,
  createCurso,
  updateCurso,
  deleteCurso,
  getDocentes,
  getMaterias,
} from "../services/api";
import "../styles/estudiantes.css";

function Curso() {
  const [cursos, setCursos] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [cursoEditando, setCursoEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const role = localStorage.getItem("role") || "";
  const esDocente = role === "ROLE_DOCENTE";
  const puedeGestionar = role === "ROLE_ADMIN";

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const promesas = [getCursos()];
      if (puedeGestionar) {
        promesas.push(getDocentes(), getMaterias());
      }

      const resultados = await Promise.all(promesas);

      setCursos(Array.isArray(resultados[0]) ? resultados[0] : []);
      setDocentes(puedeGestionar && Array.isArray(resultados[1]) ? resultados[1] : []);
      setMaterias(puedeGestionar && Array.isArray(resultados[2]) ? resultados[2] : []);
    } catch (err) {
      setError(err.message || "Error al cargar cursos");
      setCursos([]);
      setDocentes([]);
      setMaterias([]);
    } finally {
      setLoading(false);
    }
  }, [puedeGestionar]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const mostrarMensaje = (texto) => {
    setMensaje(texto);
    setTimeout(() => setMensaje(""), 3000);
  };

  const handleGuardar = async (curso) => {
    if (!puedeGestionar) return;

    try {
      setError("");
      setMensaje("");

      if (cursoEditando) {
        await updateCurso(cursoEditando.id, curso);
        mostrarMensaje("Curso actualizado correctamente");
        setCursoEditando(null);
      } else {
        await createCurso(curso);
        mostrarMensaje("Curso registrado correctamente");
      }

      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo guardar el curso");
    }
  };

  const handleEditar = (curso) => {
    if (!puedeGestionar) return;

    setCursoEditando({
      id: curso.id,
      materiaId: curso.materiaId || "",
      docenteId: curso.docenteId || "",
      grupo: curso.grupo || "",
    });

    setMensaje("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    if (!puedeGestionar) return;

    const confirmar = window.confirm("¿Seguro que deseas eliminar este curso?");
    if (!confirmar) return;

    try {
      await deleteCurso(id);
      mostrarMensaje("Curso eliminado correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el curso");
    }
  };

  const handleCancelar = () => {
    setCursoEditando(null);
    setError("");
    setMensaje("");
  };

  const cursosFiltrados = cursos.filter((curso) => {
    const texto = busqueda.toLowerCase();

    return (
      String(curso.id || "").includes(texto) ||
      (curso.materiaNombre || "").toLowerCase().includes(texto) ||
      (curso.docenteNombre || "").toLowerCase().includes(texto) ||
      (curso.grupo || "").toLowerCase().includes(texto)
    );
  });

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Cargando cursos...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="page-title text-center">
        {esDocente ? "Mis Cursos" : "Gestión de Cursos"}
      </h2>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {puedeGestionar && (
        <div className="card estudiantes-form-card mb-4">
          <div className="card-body">
            <h4 className="section-title">
              {cursoEditando ? "Editar curso" : "Registrar curso"}
            </h4>

            <FormularioCurso
              onSubmit={handleGuardar}
              cursoEditando={cursoEditando}
              onCancel={handleCancelar}
              docentes={docentes}
              materias={materias}
            />
          </div>
        </div>
      )}

      <div className="card estudiantes-table-card">
        <div className="card-body">
          <h4 className="section-title">
            {esDocente ? "Listado de cursos asignados" : "Listado de cursos"}
          </h4>

          <input
            className="form-control mb-3"
            placeholder="Buscar curso..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Materia</th>
                  <th>Docente</th>
                  <th>Grupo</th>
                  {puedeGestionar && <th>Acciones</th>}
                </tr>
              </thead>

              <tbody>
                {cursosFiltrados.length > 0 ? (
                  cursosFiltrados.map((curso) => (
                    <tr key={curso.id}>
                      <td>{curso.id}</td>
                      <td>{curso.materiaNombre}</td>
                      <td>{curso.docenteNombre}</td>
                      <td>{curso.grupo}</td>

                      {puedeGestionar && (
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEditar(curso)}
                          >
                            Editar
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleEliminar(curso.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={puedeGestionar ? "5" : "4"} className="text-center">
                      No hay cursos registrados
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

export default Curso;