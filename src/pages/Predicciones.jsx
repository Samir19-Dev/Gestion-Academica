import { useEffect, useState } from "react";
import { getPredicciones } from "../services/api";

function Predicciones() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarPredicciones();
  }, []);

  const cargarPredicciones = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getPredicciones();
      setData(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error cargando predicciones", err);
      setError(err.message || "No se pudieron cargar las predicciones");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeRiesgo = (riesgo) => {
    if (riesgo === "ALTO") {
      return <span className="badge bg-danger">ALTO</span>;
    }

    if (riesgo === "MEDIO") {
      return <span className="badge bg-warning text-dark">MEDIO</span>;
    }

    return <span className="badge bg-success">BAJO</span>;
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <h4>Cargando predicciones...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Predicción de Riesgo Académico (IA)</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {data.length === 0 ? (
        <div className="alert alert-info">
          No hay datos de predicción disponibles.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Estudiante</th>
                <th>Promedio</th>
                <th>Asistencia %</th>
                <th>Riesgo</th>
                <th>Probabilidad</th>
              </tr>
            </thead>

            <tbody>
              {data.map((e) => (
                <tr key={e.estudianteId}>
                  <td>{e.estudianteNombre}</td>
                  <td>{Number(e.promedio || 0).toFixed(2)}</td>
                  <td>{Number(e.porcentajeAsistencia || 0).toFixed(2)}%</td>
                  <td>{getBadgeRiesgo(e.riesgo)}</td>
                  <td>{Number(e.probabilidad || 0).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Predicciones;