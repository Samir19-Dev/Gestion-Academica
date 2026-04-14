const API = "http://localhost:8080/api";

/* =========================
   HELPERS
========================= */

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("mustChangePassword");
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay token disponible");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const getPublicHeaders = () => ({
  "Content-Type": "application/json",
});

const handleJsonResponse = async (response, defaultErrorMessage) => {
  const contentType = response.headers.get("content-type");
  let data = null;

  if (contentType && contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  } else {
    const text = await response.text().catch(() => "");

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        clearSession();
      }

      throw new Error(text || defaultErrorMessage);
    }

    return text;
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearSession();
    }

    throw new Error(
      data?.mensaje ||
        data?.message ||
        data?.error ||
        (typeof data === "string" ? data : defaultErrorMessage)
    );
  }

  return data;
};

const request = async (
  endpoint,
  options = {},
  defaultErrorMessage = "Ocurrió un error"
) => {
  const response = await fetch(`${API}${endpoint}`, options);
  return await handleJsonResponse(response, defaultErrorMessage);
};

const get = async (endpoint, errorMessage, useAuth = true) =>
  await request(
    endpoint,
    {
      method: "GET",
      headers: useAuth ? getAuthHeaders() : getPublicHeaders(),
    },
    errorMessage
  );

const post = async (endpoint, body, errorMessage, useAuth = true) =>
  await request(
    endpoint,
    {
      method: "POST",
      headers: useAuth ? getAuthHeaders() : getPublicHeaders(),
      body: JSON.stringify(body),
    },
    errorMessage
  );

const put = async (endpoint, body, errorMessage, useAuth = true) =>
  await request(
    endpoint,
    {
      method: "PUT",
      headers: useAuth ? getAuthHeaders() : getPublicHeaders(),
      body: JSON.stringify(body),
    },
    errorMessage
  );

const remove = async (endpoint, errorMessage, useAuth = true) =>
  await request(
    endpoint,
    {
      method: "DELETE",
      headers: useAuth ? getAuthHeaders() : getPublicHeaders(),
    },
    errorMessage
  );

/* =========================
   AUTH
========================= */

export const login = async (username, password) =>
  await post(
    "/auth/login",
    { username, password },
    "Error al iniciar sesión",
    false
  );

export const changePassword = async (currentPassword, newPassword) =>
  await post(
    "/auth/change-password",
    { currentPassword, newPassword },
    "No se pudo cambiar la contraseña"
  );

/* =========================
   DASHBOARD
========================= */

export const getDashboardResumen = async () =>
  await get(
    "/dashboard/resumen",
    "No se pudo cargar el resumen del dashboard"
  );

/* =========================
   BOLETÍN
========================= */

export const getBoletinPorEstudiante = async (id) =>
  await get(`/boletin/estudiante/${id}`, "No se pudo cargar el boletín");

export const getMiBoletin = async () =>
  await get("/boletin/mio", "No se pudo cargar tu boletín");

/* =========================
   CARRERAS
========================= */

export const getCarreras = async () =>
  await get("/carreras", "No se pudieron cargar las carreras");

/* =========================
   ESTUDIANTES
========================= */

export const getEstudiantes = async () =>
  await get("/estudiantes", "No se pudieron cargar los estudiantes");

export const createEstudiante = async (estudiante) =>
  await post("/estudiantes", estudiante, "No se pudo crear el estudiante");

export const updateEstudiante = async (id, estudiante) =>
  await put(
    `/estudiantes/${id}`,
    estudiante,
    "No se pudo actualizar el estudiante"
  );

export const deleteEstudiante = async (id) =>
  await remove(`/estudiantes/${id}`, "No se pudo eliminar el estudiante");

/* =========================
   DOCENTES
========================= */

export const getDocentes = async () =>
  await get("/docentes", "No se pudieron cargar los docentes");

export const createDocente = async (docente) =>
  await post("/docentes", docente, "No se pudo crear el docente");

export const updateDocente = async (id, docente) =>
  await put(`/docentes/${id}`, docente, "No se pudo actualizar el docente");

export const deleteDocente = async (id) =>
  await remove(`/docentes/${id}`, "No se pudo eliminar el docente");

/* =========================
   MATERIAS
========================= */

export const getMaterias = async () =>
  await get("/materias", "No se pudieron cargar las materias");

export const createMateria = async (materia) =>
  await post("/materias", materia, "No se pudo crear la materia");

export const updateMateria = async (id, materia) =>
  await put(`/materias/${id}`, materia, "No se pudo actualizar la materia");

export const deleteMateria = async (id) =>
  await remove(`/materias/${id}`, "No se pudo eliminar la materia");

/* =========================
   CURSOS
========================= */

export const getCursos = async () =>
  await get("/cursos", "No se pudieron cargar los cursos");

export const createCurso = async (curso) =>
  await post("/cursos", curso, "No se pudo crear el curso");

export const updateCurso = async (id, curso) =>
  await put(`/cursos/${id}`, curso, "No se pudo actualizar el curso");

export const deleteCurso = async (id) =>
  await remove(`/cursos/${id}`, "No se pudo eliminar el curso");

/* =========================
   INSCRIPCIONES
========================= */

export const getInscripciones = async () =>
  await get("/inscripciones", "No se pudieron cargar las inscripciones");

export const createInscripcion = async (inscripcion) =>
  await post("/inscripciones", inscripcion, "No se pudo crear la inscripción");

export const updateInscripcion = async (id, inscripcion) =>
  await put(
    `/inscripciones/${id}`,
    inscripcion,
    "No se pudo actualizar la inscripción"
  );

export const deleteInscripcion = async (id) =>
  await remove(`/inscripciones/${id}`, "No se pudo eliminar la inscripción");

export const getCursosDisponibles = async (estudianteId) =>
  await get(
    `/inscripciones/cursos-disponibles/${estudianteId}`,
    "No se pudieron cargar los cursos disponibles"
  );

/* =========================
   NOTAS
========================= */

export const getNotas = async () =>
  await get("/notas", "No se pudieron cargar las notas");

export const createNota = async (nota) =>
  await post("/notas", nota, "No se pudo crear la nota");

export const updateNota = async (id, nota) =>
  await put(`/notas/${id}`, nota, "No se pudo actualizar la nota");

export const deleteNota = async (id) =>
  await remove(`/notas/${id}`, "No se pudo eliminar la nota");

/* =========================
   ASISTENCIAS
========================= */

export const getAsistencias = async () =>
  await get("/asistencias", "No se pudieron cargar las asistencias");

export const createAsistencia = async (asistencia) =>
  await post("/asistencias", asistencia, "No se pudo crear la asistencia");

export const updateAsistencia = async (id, asistencia) =>
  await put(
    `/asistencias/${id}`,
    asistencia,
    "No se pudo actualizar la asistencia"
  );

export const deleteAsistencia = async (id) =>
  await remove(`/asistencias/${id}`, "No se pudo eliminar la asistencia");

/* =========================
   PREDICCIONES
========================= */

export const getPredicciones = async () =>
  await get("/predicciones", "No se pudieron cargar las predicciones");

export const getRankingRiesgo = async () =>
  await get(
    "/predicciones/ranking-riesgo",
    "No se pudo cargar el ranking de riesgo"
  );