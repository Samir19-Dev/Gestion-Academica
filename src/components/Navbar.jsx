import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../styles/navbar.css";

function Navbar({ setAuth }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const navbarRef = useRef(null);

  const username = localStorage.getItem("username") || "Usuario";
  const role = localStorage.getItem("role") || "";

  const esAdmin = role === "ROLE_ADMIN";
  const esDocente = role === "ROLE_DOCENTE";
  const esEstudiante = role === "ROLE_ESTUDIANTE";

  const toggleDropdown = (menu) => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeAllMenus = () => {
    setOpenDropdown(null);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("mustChangePassword");
    setAuth(false);
    closeAllMenus();
    navigate("/");
  };

  useEffect(() => {
    closeAllMenus();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      ref={navbarRef}
      className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm"
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center"
          to={esEstudiante ? "/boletin" : "/dashboard"}
          onClick={closeAllMenus}
        >
          <i className="bi bi-book-half me-2"></i>
          Gestión Académica
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${mobileOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar-menu-custom">
            {!esEstudiante && (
              <li className="nav-item">
                <Link
                  className="nav-link text-white text-decoration-none navbar-link-custom"
                  to="/dashboard"
                  onClick={closeAllMenus}
                >
                  Dashboard
                </Link>
              </li>
            )}

            {(esAdmin || esDocente) && (
              <li className="nav-item dropdown position-relative">
                <button
                  className="nav-link dropdown-toggle btn btn-link border-0 bg-transparent text-white text-decoration-none navbar-link-custom"
                  type="button"
                  onClick={() => toggleDropdown("academico")}
                >
                  Académico
                </button>

                {openDropdown === "academico" && (
                  <ul className="dropdown-menu show">
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/estudiantes"
                        onClick={closeAllMenus}
                      >
                        Estudiantes
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="dropdown-item"
                        to="/docentes"
                        onClick={closeAllMenus}
                      >
                        Docentes
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="dropdown-item"
                        to="/materias"
                        onClick={closeAllMenus}
                      >
                        Materias
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="dropdown-item"
                        to="/cursos"
                        onClick={closeAllMenus}
                      >
                        Cursos
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )}

            {(esAdmin || esDocente) && (
              <li className="nav-item dropdown position-relative">
                <button
                  className="nav-link dropdown-toggle btn btn-link border-0 bg-transparent text-white text-decoration-none navbar-link-custom"
                  type="button"
                  onClick={() => toggleDropdown("matricula")}
                >
                  Matrícula
                </button>

                {openDropdown === "matricula" && (
                  <ul className="dropdown-menu show">
                    {esAdmin && (
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/inscripciones"
                          onClick={closeAllMenus}
                        >
                          Inscripciones
                        </Link>
                      </li>
                    )}

                    <li>
                      <Link
                        className="dropdown-item"
                        to="/notas"
                        onClick={closeAllMenus}
                      >
                        Notas
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="dropdown-item"
                        to="/asistencias"
                        onClick={closeAllMenus}
                      >
                        Asistencias
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )}

            {(esAdmin || esDocente) && (
              <li className="nav-item dropdown position-relative">
                <button
                  className="nav-link dropdown-toggle btn btn-link border-0 bg-transparent text-white text-decoration-none navbar-link-custom"
                  type="button"
                  onClick={() => toggleDropdown("analitica")}
                >
                  Analítica
                </button>

                {openDropdown === "analitica" && (
                  <ul className="dropdown-menu show">
                    <li>
                      <Link
                        className="dropdown-item"
                        to="/boletin"
                        onClick={closeAllMenus}
                      >
                        Boletín
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="dropdown-item"
                        to="/predicciones"
                        onClick={closeAllMenus}
                      >
                        Predicción IA
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )}

            {esEstudiante && (
              <li className="nav-item">
                <Link
                  className="nav-link text-white text-decoration-none navbar-link-custom"
                  to="/boletin"
                  onClick={closeAllMenus}
                >
                  Boletín
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav navbar-menu-custom">
            <li className="nav-item dropdown position-relative">
              <button
                className="nav-link dropdown-toggle btn btn-link border-0 bg-transparent text-white text-decoration-none navbar-link-custom"
                type="button"
                onClick={() => toggleDropdown("perfil")}
              >
                <i className="bi bi-person-circle me-1"></i>
                {username}
              </button>

              {openDropdown === "perfil" && (
                <ul className="dropdown-menu dropdown-menu-end show">
                  {!esEstudiante && (
                    <>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/dashboard"
                          onClick={closeAllMenus}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                    </>
                  )}

                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;