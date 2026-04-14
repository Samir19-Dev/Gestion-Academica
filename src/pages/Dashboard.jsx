import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardResumen } from "../services/api";
import "../styles/dashboard.css";

function Dashboard() {
  const [resumen, setResumen] = useState({
    estudiantes: 0,
    docentes: 0,
    materias: 0,
    cursos: 0,
    inscripciones: 0,
    notas: 0,
    asistencias: 0,
    promedioAsistencia: 0,
    estudiantesAprobados: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Usuario";

  const obtenerSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const fechaActual = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const cargarResumen = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardResumen();

        setResumen({
          estudiantes: data?.estudiantes ?? 0,
          docentes: data?.docentes ?? 0,
          materias: data?.materias ?? 0,
          cursos: data?.cursos ?? 0,
          inscripciones: data?.inscripciones ?? 0,
          notas: data?.notas ?? 0,
          asistencias: data?.asistencias ?? 0,
          promedioAsistencia: data?.promedioAsistencia ?? 0,
          estudiantesAprobados: data?.estudiantesAprobados ?? 0,
        });
      } catch (err) {
        setError(err.message || "No se pudo cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };

    cargarResumen();
  }, []);

  const cards = [
    {
      titulo: "Estudiantes",
      valor: resumen.estudiantes,
      icono: "bi bi-people-fill",
      clase: "dashboard-primary",
      ruta: "/estudiantes",
    },
    {
      titulo: "Docentes",
      valor: resumen.docentes,
      icono: "bi bi-person-workspace",
      clase: "dashboard-success",
      ruta: "/docentes",
    },
    {
      titulo: "Materias",
      valor: resumen.materias,
      icono: "bi bi-journal-bookmark-fill",
      clase: "dashboard-warning",
      ruta: "/materias",
    },
    {
      titulo: "Cursos",
      valor: resumen.cursos,
      icono: "bi bi-easel-fill",
      clase: "dashboard-dark",
      ruta: "/cursos",
    },
    {
      titulo: "Inscripciones",
      valor: resumen.inscripciones,
      icono: "bi bi-file-earmark-check-fill",
      clase: "dashboard-info",
      ruta: "/inscripciones",
    },
    {
      titulo: "Notas",
      valor: resumen.notas,
      icono: "bi bi-bar-chart-fill",
      clase: "dashboard-secondary",
      ruta: "/notas",
    },
    {
      titulo: "Asistencias",
      valor: resumen.asistencias,
      icono: "bi bi-calendar-check-fill",
      clase: "dashboard-danger",
      ruta: "/asistencias",
    },
    {
      titulo: "Boletín",
      valor: "Ver",
      icono: "bi bi-file-earmark-text-fill",
      clase: "dashboard-light",
      ruta: "/boletin",
    },
  ];

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="alert alert-info">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="dashboard-hero card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h2 className="dashboard-title mb-2">
                {obtenerSaludo()}, {username}
              </h2>
              <p className="dashboard-subtitle mb-0">
                Bienvenido al sistema de gestión académica. Desde aquí puedes
                consultar el estado general de la plataforma y acceder a cada módulo.
              </p>
            </div>

            <div className="dashboard-date-badge">
              <i className="bi bi-calendar3 me-2"></i>
              {fechaActual}
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {cards.map((card, index) => (
          <div key={index} className="col-sm-6 col-lg-4 col-xl-3">
            <div
              className={`card dashboard-stat-card border-0 h-100 ${card.clase}`}
              onClick={() => navigate(card.ruta)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="dashboard-card-label">{card.titulo}</h6>
                  <h2 className="dashboard-card-value">{card.valor}</h2>
                </div>

                <div className="dashboard-card-icon">
                  <i className={card.icono}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mt-1">
        <div className="col-md-6">
          <div className="card dashboard-summary-card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="dashboard-section-title mb-2">Promedio de asistencia</h5>
              <h3 className="mb-0">{Number(resumen.promedioAsistencia).toFixed(2)}%</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card dashboard-summary-card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="dashboard-section-title mb-2">Estudiantes aprobados</h5>
              <h3 className="mb-0">{resumen.estudiantesAprobados}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card dashboard-summary-card mt-4 border-0 shadow-sm">
        <div className="card-body">
          <h5 className="dashboard-section-title mb-2">Vista general</h5>
          <p className="text-muted mb-0">
            Este panel resume la cantidad total de estudiantes, docentes,
            materias, cursos, inscripciones, notas y asistencias registradas,
            además de ofrecer acceso directo al módulo de boletín académico.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

