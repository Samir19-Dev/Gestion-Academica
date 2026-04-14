import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{
      width: "220px",
      background: "#2c3e50",
      height: "100vh",
      color: "#fff",
      padding: "20px"
    }}>

      <h4 className="mb-4">Sistema</h4>

      <ul className="list-unstyled">

        <li className="mb-2">
          <Link className="text-white text-decoration-none" to="/dashboard">
            Dashboard
          </Link>
        </li>

        <li className="mb-2">
          <Link className="text-white text-decoration-none" to="/estudiantes">
            Estudiantes
          </Link>
        </li>

        <li className="mb-2">
          <Link className="text-white text-decoration-none" to="/materias">
            Materias
          </Link>
        </li>

        <li className="mb-2">
          <Link className="text-white text-decoration-none" to="/cursos">
            Cursos
          </Link>
        </li>

        <li className="mb-2">
          <Link className="text-white text-decoration-none" to="/notas">
            Notas
          </Link>
        </li>

        <li className="mb-2">
          <Link className="text-white text-decoration-none" to="/asistencias">
            Asistencias
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;