import { useEffect, useMemo, useState } from "react";
import {
  getEstudiantes,
  getBoletinPorEstudiante,
  getMiBoletin,
} from "../services/api";
import logo from "../assets/logoiub.png";
import "../styles/boletin.css";

function Boletin() {
  const boletinVacio = {
    estudiante: "",
    materias: [],
    promedioGeneral: null,
    estadoGeneral: "",
  };

  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteId, setEstudianteId] = useState("");
  const [boletin, setBoletin] = useState(boletinVacio);
  const [loading, setLoading] = useState(true);
  const [cargandoBoletin, setCargandoBoletin] = useState(false);
  const [error, setError] = useState("");

  const role = localStorage.getItem("role") || "";
  const esEstudiante = role === "ROLE_ESTUDIANTE";

  const fechaActual = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const periodoAcademico = "2026-1";
  const anioActual = new Date().getFullYear();

  useEffect(() => {
    const cargarInicial = async () => {
      try {
        setLoading(true);
        setError("");

        if (esEstudiante) {
          const data = await getMiBoletin();

          setBoletin({
            estudiante: data.estudiante || "",
            materias: Array.isArray(data.materias) ? data.materias : [],
            promedioGeneral:
              data.promedioGeneral !== undefined ? data.promedioGeneral : null,
            estadoGeneral: data.estadoGeneral || "",
          });
        } else {
          const data = await getEstudiantes();
          setEstudiantes(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setError(err.message || "No se pudo cargar el boletín");
        setBoletin(boletinVacio);
        setEstudiantes([]);
      } finally {
        setLoading(false);
      }
    };

    cargarInicial();
  }, [esEstudiante]);

  const estudianteSeleccionado = useMemo(() => {
    return estudiantes.find(
      (estudiante) => String(estudiante.id) === String(estudianteId)
    );
  }, [estudiantes, estudianteId]);

  const handleSeleccionEstudiante = (e) => {
    setEstudianteId(e.target.value);
    setBoletin(boletinVacio);
    setError("");
  };

  const consultarBoletin = async () => {
    if (!estudianteId) {
      setError("Debes seleccionar un estudiante");
      setBoletin(boletinVacio);
      return;
    }

    try {
      setCargandoBoletin(true);
      setError("");
      setBoletin(boletinVacio);

      const data = await getBoletinPorEstudiante(estudianteId);

      setBoletin({
        estudiante: data.estudiante || "",
        materias: Array.isArray(data.materias) ? data.materias : [],
        promedioGeneral:
          data.promedioGeneral !== undefined ? data.promedioGeneral : null,
        estadoGeneral: data.estadoGeneral || "",
      });
    } catch (err) {
      setError(err.message || "No se pudo cargar el boletín");
      setBoletin(boletinVacio);
    } finally {
      setCargandoBoletin(false);
    }
  };

  const imprimirBoletin = () => {
    if (!boletin.materias || boletin.materias.length === 0) {
      setError("Primero debes consultar un boletín con datos");
      return;
    }

    setError("");
    window.print();
  };

  const getEstadoBadge = (estado) => {
    if (estado === "Aprobado") return "badge bg-success";
    if (estado === "Reprobado") return "badge bg-danger";
    if (estado === "Sin nota" || estado === "Sin notas") {
      return "badge bg-secondary";
    }
    return "badge bg-warning text-dark";
  };

  const getPromedioClass = (promedio) => {
    if (promedio == null || promedio === "") return "";
    return Number(promedio) >= 3
      ? "text-success fw-bold"
      : "text-danger fw-bold";
  };

  const formatearPromedio = (valor) => {
    if (valor == null || valor === "") return "-";
    return Number(valor).toFixed(2);
  };

  const totalMaterias = boletin.materias.length;
  const aprobadas = boletin.materias.filter(
    (item) => Number(item.promedio) >= 3
  ).length;
  const reprobadas = boletin.materias.filter(
    (item) => item.promedio != null && Number(item.promedio) < 3
  ).length;

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Cargando boletín...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4 boletin-print-area">
      <div className="boletin-topbar d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 no-print">
        <div>
          <h2 className="page-title mb-1">Boletín Académico</h2>
          <p className="text-muted mb-0">
            Consulta e impresión del reporte académico institucional.
          </p>
        </div>

        <button
          className="btn btn-outline-primary mt-3 mt-md-0 btn-print-custom"
          onClick={imprimirBoletin}
        >
          <i className="bi bi-printer me-2"></i>
          Imprimir boletín
        </button>
      </div>

      {error && <div className="alert alert-danger no-print">{error}</div>}

      {!esEstudiante && (
        <div className="card boletin-filter-card shadow-sm border-0 mb-4 no-print">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-8">
                <label className="form-label form-label-custom">
                  Estudiante
                </label>
                <select
                  className="form-select input-custom"
                  value={estudianteId}
                  onChange={handleSeleccionEstudiante}
                >
                  <option value="">Seleccione un estudiante</option>
                  {estudiantes.map((estudiante) => (
                    <option key={estudiante.id} value={estudiante.id}>
                      {estudiante.nombre} - {estudiante.carreraNombre} -
                      Semestre {estudiante.semestre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <button
                  className="btn btn-primary w-100 btn-save-custom"
                  onClick={consultarBoletin}
                >
                  <i className="bi bi-search me-2"></i>
                  Consultar boletín
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {cargandoBoletin ? (
        <div className="alert alert-info no-print">Cargando boletín...</div>
      ) : boletin.materias.length > 0 ? (
        <>
          <div className="row g-3 mb-4 no-print">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card stats-card stats-card-primary h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="stats-label">Materias</h6>
                    <h2 className="stats-value text-primary">{totalMaterias}</h2>
                  </div>
                  <i className="bi bi-journal-richtext stats-icon text-primary"></i>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card stats-card stats-card-success h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="stats-label">Aprobadas</h6>
                    <h2 className="stats-value text-success">{aprobadas}</h2>
                  </div>
                  <i className="bi bi-check-circle-fill stats-icon text-success"></i>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card stats-card stats-card-danger h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="stats-label">Reprobadas</h6>
                    <h2 className="stats-value text-danger">{reprobadas}</h2>
                  </div>
                  <i className="bi bi-x-circle-fill stats-icon text-danger"></i>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card stats-card stats-card-warning h-100">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="stats-label">Promedio general</h6>
                    <h2
                      className={`stats-value ${getPromedioClass(
                        boletin.promedioGeneral
                      )}`}
                    >
                      {formatearPromedio(boletin.promedioGeneral)}
                    </h2>
                  </div>
                  <i className="bi bi-graph-up-arrow stats-icon text-warning"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0 boletin-sheet">
            <div className="card-body p-4 p-md-5">
              <div className="print-header mb-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={logo}
                      alt="Logo institucional"
                      className="boletin-logo-img"
                    />
                    <div>
                      <h3 className="mb-1 institution-name">
                        Institución Universitaria de Barranquilla
                      </h3>
                      <p className="mb-0 text-muted">
                        Sistema de Gestión Académica
                      </p>
                    </div>
                  </div>

                  <div className="text-md-end">
                    <div className="document-tag">Boletín académico</div>
                    <small className="d-block text-muted mt-2">
                      Año lectivo {anioActual}
                    </small>
                    <small className="d-block text-muted">
                      Período académico {periodoAcademico}
                    </small>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="text-center">
                  <h4 className="mb-1">Reporte oficial de calificaciones</h4>
                  <p className="text-muted mb-0">
                    Documento generado desde la plataforma académica
                    institucional.
                  </p>
                </div>
              </div>

              <div className="boletin-info mb-4">
                <div className="row g-3">
                  <div className="col-md-6 col-lg-4">
                    <div className="info-box">
                      <span className="info-label">Estudiante</span>
                      <div className="info-value">
                        {boletin.estudiante ||
                          estudianteSeleccionado?.nombre ||
                          "-"}
                      </div>
                    </div>
                  </div>

                  {!esEstudiante && (
                    <>
                      <div className="col-md-6 col-lg-4">
                        <div className="info-box">
                          <span className="info-label">Carrera</span>
                          <div className="info-value">
                            {estudianteSeleccionado?.carreraNombre || "-"}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 col-lg-4">
                        <div className="info-box">
                          <span className="info-label">Semestre</span>
                          <div className="info-value">
                            {estudianteSeleccionado?.semestre || "-"}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-md-6 col-lg-4">
                    <div className="info-box">
                      <span className="info-label">Fecha de emisión</span>
                      <div className="info-value">{fechaActual}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered align-middle boletin-table">
                  <thead>
                    <tr>
                      <th>Materia</th>
                      <th>Grupo</th>
                      <th>Parcial 1</th>
                      <th>Parcial 2</th>
                      <th>Final</th>
                      <th>Promedio</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>
                    {boletin.materias.map((item) => (
                      <tr key={`${item.materia}-${item.grupo}`}>
                        <td>{item.materia}</td>
                        <td>{item.grupo}</td>
                        <td>{item.parcial1 ?? "-"}</td>
                        <td>{item.parcial2 ?? "-"}</td>
                        <td>{item.finalNota ?? "-"}</td>
                        <td className={getPromedioClass(item.promedio)}>
                          {formatearPromedio(item.promedio)}
                        </td>
                        <td>
                          <span className={getEstadoBadge(item.estado)}>
                            {item.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr>
                      <th colSpan="5" className="text-end">
                        Promedio general
                      </th>
                      <th className={getPromedioClass(boletin.promedioGeneral)}>
                        {formatearPromedio(boletin.promedioGeneral)}
                      </th>
                      <th>
                        <span className={getEstadoBadge(boletin.estadoGeneral)}>
                          {boletin.estadoGeneral || "-"}
                        </span>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="boletin-resumen mt-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="summary-card">
                      <span className="summary-label">Promedio general</span>
                      <div
                        className={`summary-value ${getPromedioClass(
                          boletin.promedioGeneral
                        )}`}
                      >
                        {formatearPromedio(boletin.promedioGeneral)}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="summary-card">
                      <span className="summary-label">Estado general</span>
                      <div className="summary-value">
                        <span className={getEstadoBadge(boletin.estadoGeneral)}>
                          {boletin.estadoGeneral || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="observacion-box mt-4">
                <h6 className="mb-2">Observación institucional</h6>
                <p className="mb-0 text-muted">
                  Este boletín refleja el desempeño académico del estudiante en
                  las asignaturas registradas dentro del período consultado.
                </p>
              </div>

              <div className="print-footer mt-5">
                <div className="row">
                  <div className="col-6 text-center">
                    <div className="firma-linea"></div>
                    <p className="mb-0">Firma del docente</p>
                  </div>
                  <div className="col-6 text-center">
                    <div className="firma-linea"></div>
                    <p className="mb-0">Coordinación académica</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="card shadow-sm border-0 boletin-empty-state">
          <div className="card-body text-center text-muted py-5">
            <i className="bi bi-file-earmark-text display-5 d-block mb-3"></i>
            {esEstudiante
              ? "Tu boletín aparecerá aquí cuando tengas materias registradas."
              : "Selecciona un estudiante y consulta su boletín para visualizarlo aquí."}
          </div>
        </div>
      )}
    </div>
  );
}

export default Boletin;