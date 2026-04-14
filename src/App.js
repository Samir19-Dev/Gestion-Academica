import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import CambiarClave from "./pages/CambiarClave";
import Dashboard from "./pages/Dashboard";
import Estudiantes from "./pages/Estudiantes";
import Docente from "./pages/Docente";
import Materia from "./pages/Materia";
import Curso from "./pages/Curso";
import Inscripciones from "./pages/Inscripciones";
import Notas from "./pages/Notas";
import Asistencia from "./pages/Asistencia";
import Boletin from "./pages/Boletin";
import Predicciones from "./pages/Predicciones";

function App() {
  const checkAuth = () => !!localStorage.getItem("token");

  const [auth, setAuth] = useState(checkAuth());

  useEffect(() => {
    setAuth(checkAuth());
  }, []);

  const renderProtected = (component, roles = []) => (
    <ProtectedRoute allowedRoles={roles}>
      {component}
    </ProtectedRoute>
  );

  return (
    <BrowserRouter>
      {auth && <Navbar setAuth={setAuth} />}

      <Routes>
        <Route
          path="/"
          element={
            auth ? (
              <Navigate
                to={
                  localStorage.getItem("mustChangePassword") === "true"
                    ? "/cambiar-clave"
                    : localStorage.getItem("role") === "ROLE_ESTUDIANTE"
                    ? "/boletin"
                    : "/dashboard"
                }
                replace
              />
            ) : (
              <Login setAuth={setAuth} />
            )
          }
        />

        <Route
          path="/cambiar-clave"
          element={renderProtected(<CambiarClave />, [
            "ROLE_ADMIN",
            "ROLE_DOCENTE",
            "ROLE_ESTUDIANTE",
          ])}
        />

        <Route
          path="/dashboard"
          element={renderProtected(<Dashboard />, [
            "ROLE_ADMIN",
            "ROLE_DOCENTE",
          ])}
        />

        <Route
          path="/estudiantes"
          element={renderProtected(<Estudiantes />, [
            "ROLE_ADMIN",
            "ROLE_DOCENTE",
          ])}
        />

        <Route
          path="/docentes"
          element={renderProtected(<Docente />, [
            "ROLE_ADMIN",
            "ROLE_DOCENTE",
          ])}
        />

        <Route
          path="/materias"
          element={renderProtected(<Materia />, [
            "ROLE_ADMIN",
            "ROLE_DOCENTE",
          ])}
        />

        <Route
          path="/cursos"
          element={renderProtected(<Curso />, [
            "ROLE_ADMIN",
            "ROLE_DOCENTE",
          ])}
        />

        <Route
          path="/inscripciones"
          element={renderProtected(<Inscripciones />, [
            "ROLE_ADMIN",
          ])}
        />

        <Route
          path="/notas"
          element={renderProtected(<Notas />, [
            "ROLE_ADMIN",
            "ROLE_DOCENTE",
          ])}
        />

        <Route
          path="/asistencias"
          element={renderProtected(<Asistencia />, [
            "ROLE_ADMIN",
            "ROLE_DOCENTE",
          ])}
        />

        <Route
          path="/boletin"
          element={renderProtected(<Boletin />, [
            "ROLE_ADMIN",
            "ROLE_DOCENTE",
            "ROLE_ESTUDIANTE",
          ])}
        />

        <Route
          path="/predicciones"
          element={renderProtected(<Predicciones />, [
            "ROLE_ADMIN",
            "ROLE_DOCENTE",
          ])}
        />

        <Route
          path="*"
          element={
            <Navigate
              to={
                auth
                  ? localStorage.getItem("mustChangePassword") === "true"
                    ? "/cambiar-clave"
                    : localStorage.getItem("role") === "ROLE_ESTUDIANTE"
                    ? "/boletin"
                    : "/dashboard"
                  : "/"
              }
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;